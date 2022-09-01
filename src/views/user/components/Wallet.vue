<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="钱包流水详情" top="30px" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <span>
            当前用户：
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="data.avatar && domin + data.avatar" />
            {{ data.name }}
          </span>
          <el-divider direction="vertical" />
          {{ data.phone || data.email }}
          <el-divider direction="vertical" />
          <el-button type="primary" size="mini" @click="onSetWallet(data)">增加/扣除</el-button>
        </el-col>
      </el-row>

      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <span style="color: #409eff;">{{ `${collapseTitle ? '收起' : '展开'}资产详情` }}</span>
          </template>
          <el-divider content-position="left"><svg-icon icon-class="radius-cny" style="color: #C49C5D;" /> 现金 </el-divider>
          <el-row>
            <el-col :span="6">余额：{{ walletCustomData.cny.balance || 0 | cutZero }}</el-col>
            <el-col :span="6">总提现：{{ walletCustomData.cny.total_withdrawal || 0 | cutZero }}</el-col>
            <el-col :span="6">总销售奖励：{{ walletCustomData.cny.sale || 0 | cutZero }}</el-col>
            <el-col :span="6">总团队奖励：{{ walletCustomData.cny.team || 0 | cutZero }}</el-col>
          </el-row>
          <el-divider content-position="left"><svg-icon icon-class="radius-dfb" style="color: #4197FF;" /> 预存电费 </el-divider>
          <el-row>
            <el-col :span="6">余额：{{ walletCustomData.dfb.balance || 0 | cutZero }}</el-col>
            <el-col :span="6">预存总电费：{{ walletCustomData.dfb.income || 0 | cutZero }}</el-col>
            <el-col :span="6">预计使用天数：{{ walletCustomData.dfb.electric_days || 0 }}</el-col>
            <el-col :span="6">总消耗电费(元)：{{ walletCustomData.dfb.expend || 0 | cutZero }}</el-col>
          </el-row>
          <el-divider content-position="left"><svg-icon icon-class="radius-usdt" style="color: #269A77;" /> USDT </el-divider>
          <el-row>
            <el-col :span="6">余额：{{ walletCustomData.usdt.balance || 0 | cutZero }}</el-col>
            <el-col :span="6">总消费支出：{{ walletCustomData.usdt.expend || 0 | cutZero }}</el-col>
            <el-col :span="6">总充值：{{ walletCustomData.usdt.recharge || 0 | cutZero }}</el-col>
            <el-col :span="6">总提现：{{ walletCustomData.usdt.withdraw_finish || 0 | cutZero }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">总转入：{{ walletCustomData.usdt.transfer_to || 0 | cutZero }}</el-col>
            <el-col :span="6">总转出：{{ walletCustomData.usdt.transfer_out || 0 | cutZero }}</el-col>
            <el-col :span="6">总销售奖励：{{ walletCustomData.usdt.sale || 0 | cutZero }}</el-col>
            <el-col :span="6">总团队奖励：{{ walletCustomData.usdt.team || 0 | cutZero }}</el-col>
          </el-row>
          <el-divider content-position="left"><svg-icon icon-class="radius-fil" style="color: #40B6BF" /> FIL </el-divider>
          <el-row style="margin-bottom: 10px;">
            类型：
            <el-select v-model="search.cate" clearable @change="getList(1)" @clear="getList(1)">
              <el-option v-for="item in catesOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-row>
          <el-row>
            <div v-if="[''].includes(search.cate)">
              <el-col :span="6">总可用：{{ walletCustomData.fil.withdrawable || 0 | cutZero }}</el-col>
              <el-col :span="6">累计收益：{{ walletCustomData.fil.miner || 0 | cutZero }}</el-col>
              <el-col :span="6">总充值：{{ walletCustomData.fil.recharge || 0 | cutZero }}</el-col>
              <el-col :span="6">总提现：{{ walletCustomData.fil.withdraw_finish || 0 | cutZero }}</el-col>
              <el-col :span="6">总转入：{{ walletCustomData.fil.transfer_to || 0 | cutZero }}</el-col>
              <el-col :span="6">总转出：{{ walletCustomData.fil.transfer_out || 0 | cutZero }}</el-col>
              <el-col :span="6">总锁仓：{{ walletCustomData.fil.lock || 0 | cutZero }}</el-col>
              <el-col :span="6">总抵押：{{ walletCustomData.fil.pawn || 0 | cutZero }}</el-col>
              <el-col :span="6">总冻结：{{ walletCustomData.fil.frozen || 0 | cutZero }}</el-col>
            </div>
            <div v-if="[0].includes(search.cate)">
              <el-col :span="6">总借贷GAS：{{ walletCustomData.fil.gas || 0 | cutZero }}</el-col>
              <el-col :span="6">总借贷抵押：{{ walletCustomData.fil.pledge || 0 | cutZero }}</el-col>
              <el-col :span="6">已还GAS：{{ walletCustomData.fil.return_gas || 0 | cutZero }}</el-col>
              <el-col :span="6">已还抵押：{{ walletCustomData.fil.return_pledge || 0 | cutZero }}</el-col>
              <el-col :span="6">待还GAS：{{ walletCustomData.fil.wait_gas || 0 | cutZero }}</el-col>
              <el-col :span="6">待还抵押：{{ walletCustomData.fil.wait_pledge || 0 | cutZero }}</el-col>
              <el-col :span="6">当前总欠款利息：{{ walletCustomData.fil.interest || 0 | cutZero }}</el-col>
            </div>

            <div v-if="[1, 2].includes(search.cate)">
              <el-col :span="6">总使用GAS：{{ walletCustomData.fil.full_use_gas || 0 | cutZero }}</el-col>
              <el-col :span="6">总使用抵押：{{ walletCustomData.fil.full_use_pledge || 0 | cutZero }}</el-col>
            </div>
            <div v-if="[2].includes(search.cate)">
              <el-col :span="6">总同步抵押：{{ walletCustomData.fil.full_sync_pledge || 0 | cutZero }}</el-col>
            </div>
          </el-row>
          <el-divider />

          <el-table
            v-loading="loadingWallet"
            stripe
            :data="walletData"
          >
            <el-table-column
              prop="zone"
              label="资产类型"
              width="80"
              header-align="center"
            >
              <template slot-scope="{ row }">
                <svg-icon :icon-class="row.zone" /> {{ row.zone | paraphrase(currencyReportOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="balance"
              label="余额"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.balance | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="miner"
              label="累计收益"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.miner | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="recharge"
              label="总充值"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.recharge | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="总提现"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.expend | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="transfer_out"
              label="总转入"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.expend | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="总转出"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.expend | cutZero }}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <p />

      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="资产类型">
            <el-select v-model="search.currency" clearable @change="getList(1)" @clear="getList(1)">
              <el-option v-for="item in currencyReportOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="search.type" clearable @change="getList(1)" @clear="getList(1)">
              <el-option v-for="item in streamTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="收支">
            <el-select v-model="search.action" clearable @change="getList(1)" @clear="getList(1)">
              <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            导出充值Excel
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
          align="center"
        />
        <el-table-column
          prop="amount"
          label="数量"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.amount | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="资产类型"
          align="center"
        >
          <template slot-scope="{ row }">
            <svg-icon :icon-class="row.currency" /> {{ row.currency | paraphrase(currencyReportOptions) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.type | paraphrase(streamTypeOptions) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="收支"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-link style="cursor: text" :underline="false" :type="row.action === 1 ? 'success' : 'danger'">{{ actionOptions[row.action].label }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.status === 0 ? 'warning' :(row.status === 1 ? 'success' : 'danger')">{{ statusOptions[row.status].label }}</el-tag>
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

    <!-- 增加/扣除 -->
    <set-wallet
      v-if="setWalletVisible"
      ref="setWallet"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { BigNumber } from 'bignumber.js'
import { wallet, walletList, exportExcel } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'
import SetWallet from './SetWallet'
import { pickerOptions, currencyReportOptions, streamTypeOptions, catesOptions } from '@/utils/explain'

export default {
  name: 'Wallet',
  components: { Pagination, SetWallet },
  data() {
    return {
      visible: false,
      downloadLoading: false,
      currencyReportOptions,
      streamTypeOptions,
      catesOptions,
      domin: getToken(DominKey),
      data: {
        id: 0,
        name: '',
        phone: '',
        email: '',
        avatar: ''
      },
      walletData: [],
      walletCustomData: {
        cny: {},
        dfb: {},
        usdt: {},
        fil: {}
      },
      list: [],
      search: {
        currency: '',
        action: '',
        type: '',
        start_time: '',
        end_time: '',
        cate: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      actionOptions: [
        { label: '全部', value: '' },
        { label: '收入', value: 1 },
        { label: '支出', value: 2 }
      ],
      statusOptions: [
        { label: '待入账', value: '' },
        { label: '完成', value: 1 },
        { label: '失败', value: 2 }
      ],
      dateRangeValue: [],
      activeNames: ['1'],
      collapseTitle: 1,
      pickerOptions,
      loading: false,
      loadingWallet: false,
      setWalletVisible: false
    }
  },
  watch: {
    activeNames(val, oldVal) { // 普通的watch监听
      this.collapseTitle = val.length ? 1 : 0
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.getList()
        this.getWallet()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      walletList({ user_id: this.data.id, page, ...this.search, limit: this.pages.limit })
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
    getWallet() {
      this.loadingWallet = true
      wallet(this.data.id)
        .then(response => {
          if (response.code !== 0) return
          if (response.data.fil) {
            let balance = 0
            Object.keys(response.data.fil).forEach((item) => {
              if (['security', 'withdrawable', 'frozen', 'lock', 'pawn'].includes(item)) {
                balance = new BigNumber(balance).plus(response.data.fil[item] || 0)
              }
            })
            response.data.fil.balance = balance
            response.data.fil.expend = new BigNumber(response.data.fil.expend || 0).plus(response.data.fil.withdraw_finish || 0)
          }
          ['cny', 'dfb', 'usdt', 'fil'].forEach(v => {
            this.walletCustomData[v] = response.data[v]
          })
          this.walletData = ['btc', 'eth', 'xch'].map(v => {
            return { ...response.data[v], zone: v }
          })
        })
        .catch(() => {})
        .finally(() => {
          this.loadingWallet = false
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
    onClose() {
      this.$reset('data', false)
    },
    onSetWallet(data) {
      this.setWalletVisible = true
      this.$nextTick(() => {
        this.$refs.setWallet && this.$refs.setWallet.init(data)
      })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportExcel(this.search)
        .then(response => {
          location.href = location.origin + '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    handleChange(val) {
      console.log(this.activeNames)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1240px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
