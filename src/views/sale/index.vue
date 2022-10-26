<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="search.order_no" placeholder="订单编号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="search.currency" clearable @change="getList(1)">
            <el-option v-for="item in currencyReportOptions.filter(v => !['dfb'].includes(v.value))" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型">
          <el-select v-model="search.type" clearable @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="search.status" clearable @change="getList(1)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="warning" icon="el-icon-collection-tag" :disabled="selectValue.length === 0" @click="onSettlement(selectValue)">
          批量设置发放
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
      @selection-change="onHandleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        :selectable="getSelectEnable"
      />
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="账号"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.user.id }}
                <el-divider direction="vertical" />
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
              <div />
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="order.order_no"
        label="关联订单编号"
        header-align="center"
      />
      <el-table-column
        prop="title"
        label="标题"
        header-align="center"
      />
      <el-table-column
        label="奖励类型"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>{{ row.type | paraphrase(typeOptions) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="奖励数量"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>资产类型：<span>{{ row.currency | paraphrase(currencyReportOptions) }}</span></div>
          <div>奖励数量：<svg-icon :icon-class="row.currency" /> {{ row.amount | cutZero }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="结算状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status | paraphrase(statusOptions, 'value', 'type')">{{ row.status | paraphrase(statusOptions) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button v-if="row.status === 0" type="primary" @click="onSettlement(row)">设置发放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 多选 -->
    <settlement
      v-if="settlementVisible"
      ref="settlement"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, exportOrder } from '@/api/sale'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, currencyReportOptions } from '@/utils/explain'
import Settlement from './components/Settlement'

export default {
  name: 'Sale',
  components: { Pagination, Settlement },
  data() {
    return {
      domin: getToken(DominKey),
      settlementVisible: false,
      downloadLoading: false,
      list: [],
      search: {
        keywords: '',
        currency: '',
        type: '',
        status: '',
        order_no: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      typeOptions: [
        { label: '全部', value: '' },
        { label: '直推销售奖励', value: 'sales_commission' },
        { label: '间推销售奖励', value: 'indirect_sales_commission' },
        { label: '团队销售奖励', value: 'team_sales_commission' },
        { label: '分红奖励', value: 'miner_bonus' }
      ],
      statusOptions: [
        { label: '全部', value: '', type: '' },
        { label: '未发放', value: 0, type: 'warning' },
        { label: '已发放', value: 1, type: 'success' }
      ],
      currencyReportOptions,
      dateRangeValue: [],
      selectValue: [],
      pickerOptions,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
        this.getList(1)
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onChangeStatus(value) {
      this.getList(1)
    },
    getSelectEnable(row, rowIndex) {
      if (row.status === 0) {
        return true
      }
    },
    onHandleSelectionChange(val) {
      this.selectValue = val
    },
    onSettlement(data) {
      if (Array.isArray(data)) {
        if (!this.search.currency || !this.search.type || !this.search.start_time || !this.search.end_time) {
          return this.$message.warning('请先筛选资产类型、奖励类型以及要结算的时间段')
        }
      }

      this.settlementVisible = true
      this.$nextTick(() => {
        this.$refs.settlement && this.$refs.settlement.init(data, this.search)
      })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
