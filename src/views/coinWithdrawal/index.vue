<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="到账地址">
          <el-input v-model="search.address" placeholder="到账地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="search.currency" clearable @change="getList(1)">
            <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
          {{ $t("table.search") }}
        </el-button>
      </el-form>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <span style="color: #409eff;">{{ `${collapseTitle ? '收起' : '展开'}提资产统计` }}</span>
        </template>
        <el-table
          :data="data"
          style="width: 100%"
        >
          <el-table-column
            prop="currency"
            label="资产类型"
            width="80"
          >
            <template slot-scope="{ row }">
              <span class="uppercase">{{ row.currency }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="success"
            label="成功提现数量"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ (row.success || 0) | cutZero }}
            </template>
          </el-table-column>
          <el-table-column
            prop="wait"
            label="待审核数量"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ (row.wait || 0) | cutZero }}
            </template>
          </el-table-column>
          <el-table-column
            prop="failed"
            label="驳回提现数量"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ (row.failed || 0) | cutZero }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_num"
            label="今日提现数量"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ (row.total_num || 0) | cutZero }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_fee"
            label="手续费"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ (row.total_fee || 0) | cutZero }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

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
        label="提现用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.user.id }}<el-divider direction="vertical" />{{ row.user.name }}
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
        label="提现相关"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row: { num, fee, currency, withdraw_balance } }">
          <div>资产类型: <span v-if="currency">{{ currency | paraphrase(currencyOptions) }}</span><span v-else>-</span></div>
          <div>提现个数：{{ num | cutZero }}</div>
          <div>手续费：{{ fee | cutZero }}</div>
          <div>实际到账：{{ minusNum(num, fee) }}</div>
          <div>可提现：{{ withdraw_balance | cutZero }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pid"
        label="流水号"
        header-align="center"
      />
      <el-table-column
        label="到账地址"
        header-align="center"
      >
        <template slot-scope="{ row: { to_address, currency } }">
          <div v-if="to_address">
            <el-tooltip class="item" effect="dark" :content="to_address" placement="bottom-start">
              <div class="ellipsis">
                <el-link v-if="[...withdrawOptions[0].currency].includes(currency)" class="ellipsis" type="primary" target="_blank" :href="currency | paraphrase(withdrawOptions[1].to_address,'type','address') | intactmerge(to_address)" :underline="false">{{ to_address }}</el-link>
                <span v-else>{{ to_address }}</span>
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="HASH"
        header-align="center"
      >
        <template slot-scope="{ row: { hash, currency } }">
          <div v-if="hash">
            <el-tooltip class="item" effect="dark" :content="hash" placement="bottom-start">
              <div class="ellipsis">
                <el-link v-if="[...withdrawOptions[0].currency].includes(currency)" class="ellipsis" type="primary" target="_blank" :href="currency | paraphrase(withdrawOptions[2].hash,'type','hash') | intactmerge(hash)" :underline="false">{{ hash }}</el-link>
                <span v-else>{{ hash }}</span>
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="70"
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
        align="center"
        width="170"
      >
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建: {{ created_at }}</div>
          <div>更新: {{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 0">
            <el-button type="success" @click="onStatusWithdraw(row, 1)">通过</el-button>
            <el-button type="danger" @click="onStatusWithdraw(row, 2)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
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
import { getWithdrawList, getStatistics } from '@/api/fil'
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import StatusWithdraw from './components/StatusWithdraw'
import { BigNumber } from 'bignumber.js'
import { pickerOptions, examineStatusOptions, withdrawOptions, currencyOptions } from '@/utils/explain'

export default {
  name: 'FilWithdraw',
  components: { Pagination, StatusWithdraw },
  filters: {
    intactmerge: function(url, val) {
      return `${url}${val}`
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      statusWithdrawVisible: false,
      googleCodeVisible: false,
      activeNames: [],
      collapseTitle: 0,
      currencyOptions1: currencyOptions,
      currencyOptions: [
        { label: '全部', value: '' },
        { label: 'FIL', value: 'fil' },
        { label: 'ETH', value: 'eth' },
        { label: 'BTC', value: 'btc' },
        { label: 'XCH', value: 'xch' },
        { label: 'USDT-ERC20', value: 'usdt' },
        { label: 'USDT-TRC20', value: 'usdt_trx' }
      ],
      withdrawOptions,
      statusOptions: examineStatusOptions.concat([{ label: '进行中', value: 3 }]),
      pickerOptions,
      dateRangeValue: [],
      list: [],
      wait_count: 0,
      data: [
        { currency: 'btc', failed: 0, success: 0, total_fee: 0, total_num: 0, wait: 0 },
        { currency: 'eth', failed: 0, success: 0, total_fee: 0, total_num: 0, wait: 0 },
        { currency: 'fil', failed: 0, success: 0, total_fee: 0, total_num: 0, wait: 0 },
        { currency: 'xch', failed: 0, success: 0, total_fee: 0, total_num: 0, wait: 0 },
        { currency: 'usdt', failed: 0, success: 0, total_fee: 0, total_num: 0, wait: 0 }
      ],
      search: {
        status: '',
        keywords: '',
        currency: '',
        address: '',
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
  watch: {
    activeNames(val, oldVal) { // 普通的watch监听
      this.collapseTitle = val.length ? 1 : 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getList()
      this.getStatistics()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      getWithdrawList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    getStatistics() {
      getStatistics()
        .then(response => {
          const data = []
          Object.keys(response.data).forEach(key => {
            data.push(Object.assign(response.data[key], { currency: key }))
          })
          this.data = data
        })
        .catch(() => {
        })
        .finally(() => {
        })
    },
    minusNum(num, fee) {
      return new BigNumber(num).minus(fee)
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
    onStatusWithdraw(data, status) {
      if (parseInt(getToken('security')) === 0 && status === 1) {
        this.onGoogleCode({ type: 1 })
        return false
      }

      this.statusWithdrawVisible = true
      this.$nextTick(() => {
        this.$refs.statusWithdraw && this.$refs.statusWithdraw.init(data, status)
      })
    },
    onChangeStatus(value) {
      this.getList(1)
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
.el-link {
  display: inline;
}
.ellipsis {
  width: 100%;
}
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
