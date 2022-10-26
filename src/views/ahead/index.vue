<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" style="width: 250px;" placeholder="用户ID/昵称/账号/期数名/订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="是否还完">
          <el-select v-model="search.pay_off" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
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
    >
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
          <div v-if="row.order && row.order.user">
            <el-avatar :key="row.order.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.order.user.avatar && domin + row.order.user.avatar" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.order.user.id }}<el-divider direction="vertical" />{{ row.order.user.name }}
                <span v-if="row.order.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.order.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.order.user.phone || row.order.user.email }}
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
        prop="order.goods_order.period.name"
        label="期数名"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.order && row.order.goods_order && row.order.goods_order.period">
            {{ row.order.goods_order.period.name }}
          </div>
          <div v-else>
            <span style="color: #F56C6C;">
              期数已删除
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="order.order_no"
        label="订单号"
        header-align="center"
      />
      <el-table-column
        prop="pay_off"
        label="是否还完"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link :type="row.pay_off ? 'success' : 'danger'">{{ row.pay_off | paraphrase(whetherOptions) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="上月剩余质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_pledge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="上月剩余gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_gas | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="surplus_interest"
        label="上月剩余利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="归还金额"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="归还质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.pledge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="归还gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.gas | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="interest"
        label="应收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="back_interest"
        label="实收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.back_interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { dataList, aheadExportOrder } from '@/api/ahead'
import Pagination from '@/components/Pagination'
import { pickerOptions, whetherOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'AheadLog',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      whetherOptions,
      pickerOptions,
      loading: false,
      downloadLoading: false,
      dateRangeValue: [],
      search: {
        keywords: '',
        start_time: '',
        end_time: '',
        pay_off: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      typeOptions: [
        { label: '全部', value: '' },
        { label: '正常归还', value: 0 },
        { label: '提前归还', value: 1 }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(row) {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      aheadExportOrder(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
::v-deep .grid-content {
  color: #606266;
  font-size: 14px;
}

::v-deep .el-radio-group .item {
  .el-badge__content {
    transform: translateY(-50%) translateX(50%);
    z-index: 1;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
    border-left: 0;
  }
  &:first-child .el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #DCDFE6;
    border-radius: 4px 0 0 4px;
  }
  &:last-child .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0 4px 4px 0;
  }
}
</style>
