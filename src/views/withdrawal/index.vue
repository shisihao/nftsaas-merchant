<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="提现方式">
          <el-select v-model="search.account_type" clearable @change="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="onChangeStatus">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>
    <el-divider content-position="left">统计</el-divider>

    <el-row>
      <el-col :span="8">
        <div class="grid-content">
          总提现金额：{{ statistics.total }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          成功提现金额：{{ statistics.success }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          待审核金额：{{ statistics.wait }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          驳回提现金额：{{ statistics.fail }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          今日提现金额：{{ statistics.today }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          服务费：{{ statistics.fee }}
        </div>
      </el-col>
    </el-row>

    <el-divider />

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
        label="用户信息"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar icon="el-icon-user-solid" :src="row.user ? (row.user.avatar ? domin + row.user.avatar : '') : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.user.id }}<el-divider direction="vertical"></el-divider>{{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical"></el-divider>
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email}}
              </div>
              <div>
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="提现账号信息"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row: { account_info: { name, number }, amount, service_charge, withdraw_balance } }">
          <div>姓名：{{ name }}</div>
          <div>账号：{{ number }}</div>
          <div>到账金额：{{ minusNum(amount, service_charge) }}</div>
          <div>余额：{{ withdraw_balance }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="提现信息"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row: { amount, service_charge, account_type } }">
          <div>手续费：{{ service_charge }}</div>
          <div>申请金额：{{ amount }}</div>
          <div>提现方式：<svg-icon :icon-class="account_type" /> {{ account_type | paraphrase(payOptions) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status, reason, handler } }">
          <div v-if="status === 2">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
          </div>

          <div v-if="handler">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ handler.id }}
                </div>
                <div>
                  {{ handler.name }}
                </div>
              </div>
              <div slot="reference">
                审核人<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>审核：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 0">
            <el-button type="primary" @click="onPassOrReject(row,1)">通过</el-button>
            <el-button type="danger" @click="onPassOrReject(row,2)">驳回</el-button>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, statusReject } from '@/api/withdrawal'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, examineStatusOptions } from '@/utils/explain'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'Withdrawal',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      wait_count: 0,
      statistics: {
        fail: '0.00',
        fee: '0.00',
        success: '0.00',
        today: '0.00',
        total: '0.00',
        wait: '0.00'
      },
      search: {
        keywords: '',
        account_type: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: examineStatusOptions,
      payOptions: [
        { label: '全部', value: '' },
        { label: '银行卡', value: 'bank' },
        { label: '支付宝', value: 'alipay' }
      ],
      dateRangeValue: [],
      pickerOptions,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
          this.statistics = response.data.statistics
          delete response.data.data
          this.any_num = response.data
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, user: { name }}, type) {
      const title = type === 1 ? '通过' : '驳回'
      const confirmType = type === 1 ? this.$confirm : this.$prompt

      confirmType(`用户「${name}提现`, `提现${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 1 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api =
            type === 1
              ? statusPass(id)
              : statusReject(id, value)
          api
            .then(() => {
              this.$message.success(`${type === 1 ? '已通过' : '已驳回'}提现`)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
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
    onChangeStatus(value) {
      this.getList(1)
    },
    minusNum(num1, num2) {
      return new BigNumber(num1).minus(num2)
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
