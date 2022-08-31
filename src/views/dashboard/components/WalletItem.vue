<template>
  <div>
    <el-row>
      <el-col :span="24" class="card-panel-col">
        <el-card shadow="never" class="card-boder">
          <div slot="header" class="clearfix">
            <div class="filter-container">
              <el-form :inline="true" :model="search">
                <el-form-item label="用户充提资产报表">
                </el-form-item>
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
                <el-button type="primary" style="float: right;" @click="onLogs">查看流水</el-button>
              </el-form>
            </div>
          </div>
          <div>
            <div>
              <el-descriptions direction="vertical" size="medium" :column="4">
                <el-descriptions-item label="当前累计充值数量（个）">
                  {{ wallet.recharge_total | cutZero }} <span style="text-transform:uppercase;">{{ search.currency }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="当前累计提现数量（个）">
                  {{ wallet.withdrawal_total | cutZero }} <span style="text-transform:uppercase;">{{ search.currency }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div style="font-size: 14px;color: #8C8C8C;margin-bottom: 10px;">
              注：由于平台并没有BTC和XCH的应用场景，所以没有BTC和XCH的充值功能和这两种资产类型的充值报表
            </div>
            <div class="walletChart" style="width: 100%;height: 360px;" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <wallet-logs
      v-if="walletLogsVisible"
      ref="walletLogs"
    />
  </div>
</template>

<script>
import { currencyOptions, pickerOptions } from '@/utils/explain'
import * as echarts from 'echarts'
import resize from '../admin/components/mixins/resize'
import { getWallet } from '@/api/common'
import WalletLogs from './logs/WalletLogs'

export default {
  mixins: [resize],
  components: {
    WalletLogs
  },
  data() {
    return {
      currencyOptions: currencyOptions.slice(1),
      chart: null,
      dateRangeValue: [],
      pickerOptions,
      search: {
        currency: currencyOptions.slice(1)[0].value,
        start_time: '',
        end_time: ''
      },
      wallet: {
        recharge_total: 0,  // 充值
        recharge: [
          {
            amount: 0,
            created_at: ''
          }
        ],
        withdrawal_total: 0,  // 提取
        withdrawal: [
          {
            amount: 0,
            created_at: ''
          }
        ]
      },
      walletLogsVisible: false
    }
  },
  created() {
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    var year = start.getFullYear()
    var month = start.getMonth() + 1
    var date = start.getDate()
    this.search.start_time = `${year}-${month}-${date} 00:00:00`

    const end = new Date();
    var year1 = end.getFullYear()
    var month1 = end.getMonth() + 1
    var date1 = end.getDate()
    
    this.search.end_time = `${year1}-${month1}-${date1} 23:59:59`
    this.dateRangeValue = [this.search.start_time, this.search.end_time]
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  watch: {
    wallet: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      getWallet(this.search)
        .then(response => {
          this.wallet = response.data
        })
        .catch(() => {})
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = ''
        this.search.end_time = ''
        this.getList(1)
      }
    },
    initChart() {
      this.chart = echarts.init(document.querySelector('.walletChart'))
      this.setOptions(this.wallet)
    },
    setOptions(beforeDate) {
      let _this = this
      let afterRechargeTime = beforeDate.recharge.map(v => {
        return v.created_at
      })
      let afterRechargeDate = beforeDate.recharge.map(v => {
        return v.amount
      })
      let afterWithdrawalDate = beforeDate.withdrawal.map(v => {
        return v.amount
      })

      this.chart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [`充值${_this.search.currency.toUpperCase()}`, `提现${_this.search.currency.toUpperCase()}`]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: afterRechargeTime
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            name: `充值${_this.search.currency.toUpperCase()}`,
            type: 'line',
            data: afterRechargeDate
          },
          {
            name: `提现${_this.search.currency.toUpperCase()}`,
            type: 'line',
            data: afterWithdrawalDate
          }
        ]
      })
    },
    onLogs() {
      this.walletLogsVisible = true
      this.$nextTick(() => {
        this.$refs.walletLogs && this.$refs.walletLogs.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel-col {
  margin-bottom: 20px;
}
.panel-box {
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-boder {
    border: 0px;
  }
}

@media (min-width: 768px) {
  .filter-container {
    padding-bottom: 0;
    .el-form--inline .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
