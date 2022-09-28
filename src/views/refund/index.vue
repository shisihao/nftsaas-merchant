<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="交易订单号">
          <el-input v-model="search.refund_no" placeholder="交易订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="商户订单号">
          <el-input v-model="search.oriOrderCode" placeholder="商户订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="search.type" clearable @change="getList(1)">
            <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间">
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" @change="getList(1)">
            <el-badge v-for="(item, index) in statusOptions" :key="index" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t("table.search") }}
        </el-button>
        <el-button type="warning" @click="onStatusWithdraw">
          退款
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <!-- <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      /> -->
      <el-table-column
        prop="refund_no"
        label="交易订单号"
        header-align="center"
      />
      <el-table-column
        prop="oriOrderCode"
        label="商户订单号"
        header-align="center"
      />
      <el-table-column
        label="类型"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.type | paraphrase(typeOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="refundAmount"
        label="金额"
        align="center"
      >
        <template slot-scope="{ row: { refundAmount } }">
          <el-link :underline="false" type="warning">¥ {{ refundAmount }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="70"
      >
        <template slot-scope="{ row: { status } }">
          <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
        width="140"
      />
      <el-table-column
        prop="audit_time"
        label="审核时间"
        align="center"
        width="140"
      />
      <!-- <el-table-column
        label="操作"
        fixed="right"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <status-withdraw
      v-if="statusWithdrawVisible"
      ref="statusWithdraw"
      @refreshList="getList()"
    />

    <authenticator-dialog
      v-if="googleCodeVisible"
      ref="googleCode"
    />

  </div>
</template>

<script>
import { dataList } from '@/api/refund'
import Pagination from '@/components/Pagination'
import StatusWithdraw from './components/StatusWithdraw'
import { pickerOptions, examineStatusOptions } from '@/utils/explain'
import { getToken } from '@/utils/auth'

export default {
  name: 'Refund',
  components: { Pagination, StatusWithdraw },
  data() {
    return {
      loading: false,
      statusWithdrawVisible: false,
      googleCodeVisible: false,
      statusOptions: examineStatusOptions,
      pickerOptions,
      dateRangeValue: [],
      list: [],
      typeOptions: [
        { label: '全部', value: '' },
        { label: '开户', value: 0 },
        { label: '一级市场', value: 1 },
        { label: '二级市场', value: 2 }
      ],
      search: {
        refund_no: '',
        oriOrderCode: '',
        status: '',
        type: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
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
    },
    onStatusWithdraw() {
      if (parseInt(getToken('security')) === 0) {
        this.onGoogleCode({ type: 1 })
        return false
      }

      this.statusWithdrawVisible = true
      this.$nextTick(() => {
        this.$refs.statusWithdraw && this.$refs.statusWithdraw.init()
      })
    },
    onGoogleCode(data) {
      this.googleCodeVisible = true
      this.$nextTick(() => {
        this.$refs.googleCode && this.$refs.googleCode.init(data)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .ellipsis span {
  display: inline-block;
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

::v-deep .item .el-badge__content {
  transform: translateY(-50%) translateX(50%);
  z-index: 1;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
  border-left: 0;
}
::v-deep .item:first-child .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
}
::v-deep .item:last-child .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}
</style>
