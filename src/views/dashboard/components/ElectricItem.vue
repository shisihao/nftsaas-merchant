<template>
  <div>
    <el-row>
      <el-col :span="24" class="card-panel-col">
        <el-card shadow="never" class="card-boder">
          <div slot="header" class="clearfix">
            <div class="filter-container">
              <el-form :inline="true" :model="search">
                <el-form-item label="用户电费报表">
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
                <el-descriptions-item label="当前累计充值电费金额（元）">
                  {{ electric.electric_bank_total | cutZero }} <span>元</span>
                </el-descriptions-item>
                <el-descriptions-item label="当前累计充值电费金额（U）">
                  {{ electric.electric_usdt_total | cutZero }} <span>USDT</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="eletriclChart" style="width: 100%;height: 360px;" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <electric-logs
      v-if="electricLogsVisible"
      ref="electricLogs"
    />
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/explain'
import * as echarts from 'echarts'
import resize from '../admin/components/mixins/resize'
import { getElectric } from '@/api/common'
import ElectricLogs from './logs/ElectricLogs'

export default {
  mixins: [resize],
  components: {
    ElectricLogs
  },
  data() {
    return {
      chart: null,
      dateRangeValue: [],
      pickerOptions,
      search: {
        start_time: '',
        end_time: ''
      },
      electric: {
        electric_bank: [
          {
            amount: 0,
            created_at: ''
          }
        ],
        electric_bank_total: 0,
        electric_usdt: [
          {
            amount: 0,
            created_at: ''
          }
        ],
        electric_usdt_total: 0
      },
      electricLogsVisible: false
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
    electric: {
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
      getElectric(this.search)
        .then(response => {
          this.electric = response.data
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
      this.chart = echarts.init(document.querySelector('.eletriclChart'))
      this.setOptions(this.electric)
    },
    setOptions(beforeDate) {
      let _this = this
      let afterRechargeTime = beforeDate.electric_bank.map(v => {
        return v.created_at
      })
      let afterRechargeDate = beforeDate.electric_bank.map(v => {
        return v.amount
      })
      let afterWithdrawalDate = beforeDate.electric_usdt.map(v => {
        return v.amount
      })

      this.chart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['银行卡', 'USDT']
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
            name: '银行卡',
            type: 'line',
            data: afterRechargeDate
          },
          {
            name: 'USDT',
            type: 'line',
            data: afterWithdrawalDate
          }
        ]
      })
    },
    onLogs() {
      this.electricLogsVisible = true
      this.$nextTick(() => {
        this.$refs.electricLogs && this.$refs.electricLogs.init()
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
