<template>
  <el-dialog title="用户提现流水" width="1000px" :visible.sync="visible">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
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
          导出 Excel
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
        prop="title"
        label="标题"
        header-align="center"
      />
      <el-table-column
        label="用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { target_cny_withdrawal: { account_info } } }">
          <div v-if="account_info">
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ account_info.name }}
                <span v-if="account_info.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ account_info.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ account_info.number }}
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
        prop="amount"
        label="提现金额"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        label="手续费"
        header-align="center"
      >
        <template slot-scope="{ row: { currency, target_cny_withdrawal } }">
          <svg-icon :icon-class="currency" /> {{ target_cny_withdrawal.service_charge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="到账金额"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ minusNum(row.amount, row.target_cny_withdrawal.service_charge) | cutZero }}
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
  </el-dialog>
</template>
<script>
import { getCnyWithdrawalLogs, getCnyWithdrawalExport } from '@/api/common'
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/explain'
import { BigNumber } from 'bignumber.js'
import { DominKey, getToken } from '@/utils/auth'

export default {
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      loading: false,
      downloadLoading: false,
      pickerOptions,
      dateRangeValue: [],
      list: [],
      search: {
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
  },
  methods: {
    init() {
      this.visible = true
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      getCnyWithdrawalLogs({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
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
    onHandleDownload() {
      this.downloadLoading = true
      getCnyWithdrawalExport(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    minusNum(num, fee) {
      return new BigNumber(num).minus(fee)
    }
  }
}
</script>
<style scoped>

</style>
