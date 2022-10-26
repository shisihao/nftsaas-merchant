<template>
  <el-dialog title="用户充提现流水" width="1000px" :visible.sync="visible">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="资产类型">
          <el-select v-model="search.currency" @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          导出 Excel
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeName" @tab-click="onHandleClick">
      <el-tab-pane label="充值流水" name="recharge" />
      <el-tab-pane label="提现流水" name="withdraw" />
      <el-tab-pane label="互转流水" name="transfer" />
    </el-tabs>

    <el-table
      v-if="['recharge', 'withdraw'].includes(activeName)"
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
        prop="amount"
        :label="activeName === 'recharge' ? '充值数量' : '提现数量'"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName === 'withdraw'"
        prop="target_withdrawal.fee"
        label="手续费"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.target_withdrawal.fee | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName === 'withdraw'"
        label="实际到账"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ toFixedNum(row.amount, row.target_withdrawal.fee) | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user"
        label="用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { user } }">
          <div v-if="user">
            <el-avatar :key="user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="user.avatar && domin + user.avatar" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ user.name }}
                <span v-if="user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ user.phone || user.email }}
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
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
    </el-table>

    <el-table
      v-else
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
        prop="amount"
        label="互转数量"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="transfer.fee"
        label="手续费"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.transfer ? row.transfer.fee : 0 | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        label="实际到账"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ toFixedNum(row.amount, row.transfer ? row.transfer.fee : 0) | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user"
        label="用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { user } }">
          <div v-if="user">
            <el-avatar :key="user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="user.avatar && domin + user.avatar" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ user.name }}
                <span v-if="user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ user.phone || user.email }}
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
        prop="target_user"
        label="接收用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { target_user } }">
          <div v-if="target_user">
            <el-avatar :key="target_user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="target_user.avatar && domin + target_user.avatar" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ target_user.name }}
                <span v-if="target_user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ target_user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ target_user.phone || target_user.email }}
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
import { getWalletLogs, getWalletExport, getWithdrawalLogs, getWithdrawalExport, getTransferLogs, getTransferExport } from '@/api/common'
import Pagination from '@/components/Pagination'
import { currencyOptions, pickerOptions, streamTypeOptions } from '@/utils/explain'
import { BigNumber } from 'bignumber.js'
import { DominKey, getToken } from '@/utils/auth'

export default {
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      currencyOptions: currencyOptions.slice(1),
      visible: false,
      loading: false,
      downloadLoading: false,
      pickerOptions,
      streamTypeOptions,
      dateRangeValue: [],
      list: [],
      activeName: 'recharge',
      search: {
        currency: currencyOptions.slice(1)[0].value,
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
      let api
      if (this.activeName === 'recharge') {
        api = getWalletLogs({ page, ...this.search, limit: this.pages.limit, type: 'recharge' })
      } else if (this.activeName === 'withdraw') {
        api = getWithdrawalLogs({ page, ...this.search, limit: this.pages.limit, type: 'withdrawal' })
      } else {
        api = getTransferLogs({ page, ...this.search, limit: this.pages.limit, type: 'transfer' })
      }
      api
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
      let api
      if (this.activeName === 'recharge') {
        api = getWalletExport(this.search)
      } else if (this.activeName === 'withdraw') {
        api = getWithdrawalExport(this.search)
      } else {
        api = getTransferExport(this.search)
      }

      api.then(response => {
        location.href = this.domin + response.data.filename
      })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onHandleClick() {
      this.getList(1)
    },
    toFixedNum(num, fee) {
      return new BigNumber(num).minus(fee)
    }
  }
}
</script>
<style scoped>

</style>
