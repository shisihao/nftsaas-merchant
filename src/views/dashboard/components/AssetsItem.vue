<template>
  <div>
    <el-row :gutter="20" class="panel-box">
      <el-col :xs="24" :span="12" class="card-panel-col">
        <el-card shadow="never" class="card-boder">
          <div slot="header">
            <span class="card-header-left">现平台用户总资产</span>
            <div class="card-header-right">
              <div>资产类型：</div>
              <el-select v-model="currencyValue" placeholder="请选择" @change="onChangeCurrency">
                <el-option
                  v-for="item in currencyReportOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div>
            <el-row>
              <el-col :xs="24" :span="8">
                <div class="card-total">
                  <b>{{ asset[currencyValue].total | cutZero }}</b>
                  <div>
                    当前累计
                  </div>
                </div>
                <div v-if="['fil', 'eth', 'xch', 'btc'].includes(currencyValue)" class="card-total">
                  <b>{{ asset[currencyValue].total_miner | cutZero }}</b>
                  <div>
                    总分发
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :span="16">
                <div class="cakeChart" style="width: 100%;height: 228px;" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :span="12" class="card-panel-col">
        <el-card shadow="never" class="card-boder card-boder-sale">
          <div slot="header">
            <span class="card-header-left">销售数据</span>
            <div v-show="zoneOptions.length > 4" class="card-header-right">
              <el-button type="text" @click="onMore">查看更多 <i class="el-icon-arrow-right" /></el-button>
            </div>
          </div>
          <div class="card-sale">
            <section v-for="(value, index) in zoneOptions.slice(0,4)" :key="index">
              <div class="sale-header"><svg-icon :icon-class="`radius-${value.value}`" :style="`color: ${coinColor[index]}`" /> {{ value.label }}</div>
              <div class="sale-content">昨日销售T数 <span :style="`color: ${coinColor[index]}`">{{ statistics[`${value.value}_miner`].yesterday_increase | cutZero }}</span></div>
              <div class="sale-content">累计销售T数 <span>{{ statistics[`${value.value}_miner`].total | cutZero }}</span></div>
            </section>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="销售数据"
      :visible.sync="dialogVisible"
      width="580"
    >
      <div class="card-sale">
        <section v-for="(value, index) in zoneOptions" :key="index">
          <div class="sale-header"><svg-icon :icon-class="`radius-${value.value}`" :style="`color: ${coinColor[index]}`" /> {{ value.label }}</div>
          <div class="sale-content">昨日销售T数 <span :style="`color: ${coinColor[index]}`">{{ statistics[`${value.value}_miner`].yesterday_increase | cutZero }}</span></div>
          <div class="sale-content">累计销售T数 <span>{{ statistics[`${value.value}_miner`].total | cutZero }}</span></div>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { currencyReportOptions, zoneOptions } from '@/utils/explain'
import * as echarts from 'echarts'
import resize from '../admin/components/mixins/resize'

export default {
  mixins: [resize],
  props: {
    asset: {
      type: Object,
      default: () => ({
        btc: {
          total: 0,
          total_miner: 0
        },
        cny: {
          total: 0
        },
        dfb: {
          total: 0
        },
        eth: {
          total: 0,
          total_miner: 0
        },
        fil: {
          total: 0,
          frozen: 0,
          lock: 0,
          pawn: 0,
          withdrawable: 0,
          total_miner: 0
        },
        usdt: {
          total: 0
        },
        xch: {
          total: 0,
          total_miner: 0
        }
      })
    },
    statistics: {
      type: Object,
      default: () => ({
        eth_miner: {
          total: 0,
          yesterday_increase: 0
        },
        fil_miner: {
          total: 0,
          yesterday_increase: 0
        },
        btc_miner: {
          total: 0,
          yesterday_increase: 0
        },
        xch_miner: {
          total: 0,
          yesterday_increase: 0
        }
      })
    }
  },
  data() {
    return {
      currencyReportOptions: currencyReportOptions.slice(1),
      currencyValue: currencyReportOptions.slice(1)[0].value,
      zoneOptions: zoneOptions.slice(1),
      coinColor: ['#42C1CA', '#F7931A', '#627EEA', '#55A95D'],
      dialogVisible: false,
      chart: null
    }
  },
  watch: {
    asset: {
      deep: true,
      handler(val) {
        this.setOptions(val[this.currencyValue])
      }
    }
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
  methods: {
    initChart() {
      this.chart = echarts.init(document.querySelector('.cakeChart'))
      this.setOptions(this.asset[this.currencyValue])
    },
    setOptions(beforeDate) {
      const _this = this
      let afterDate = [{ name: `当前累计(${['cny', 'dfb'].includes(this.currencyValue) ? '元' : '个'})`, value: beforeDate.total, proportion: `${((beforeDate.total / beforeDate.total || 0) * 100).toFixed(4)}%` }]
      if (this.currencyValue === 'fil') {
        afterDate = [
          { name: '可用', value: beforeDate.withdrawable, proportion: `${((beforeDate.withdrawable / beforeDate.total || 0) * 100).toFixed(4)}%` },
          { name: '冻结', value: beforeDate.frozen, proportion: `${((beforeDate.frozen / beforeDate.total || 0) * 100).toFixed(4)}%` },
          { name: '锁仓', value: beforeDate.lock, proportion: `${((beforeDate.lock / beforeDate.total || 0) * 100).toFixed(4)}%` },
          { name: '抵押', value: beforeDate.pawn, proportion: `${((beforeDate.pawn / beforeDate.total || 0) * 100).toFixed(4)}%` }
        ]
      }
      this.chart.setOption({
        series: [{
          type: 'pie',
          radius: [20, 60],
          label: {
            alignTo: 'edge',
            formatter: function(params) {
              return `${params.name}:${params.value}\n{proportion|${params.data.proportion}}`
            },
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              proportion: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
          },
          labelLayout: function(params) {
            var isLeft = params.labelRect.x < _this.chart.getWidth() / 2
            var points = params.labelLinePoints
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width

            return {
              labelLinePoints: points
            }
          },
          data: afterDate
        }]
      })
    },
    onChangeCurrency(val) {
      this.setOptions(this.asset[this.currencyValue])
    },
    onMore() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-box {
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-boder {
    border: 0px;
    .el-card__header > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 28px;
      .card-header-left {
        font-size: 18px;
      }
      .card-header-right {
        display: flex;
        align-items: center;
        font-size: 14px;
        .el-select {
          width: 100px;
        }
      }
    }
    .card-total {
      margin-top: 34px;
      margin-bottom: 34px;
      b {
        display: block;
        color: #409EFF;
        font-size: 24px;
        margin-bottom: 6px;
        font-weight: normal;
      }
      &>div {
        font-size: 14px;
      }
    }
  }
  .card-boder-sale {
    ::v-deep .el-card__body {
      padding: 0;
    }
  }
}

.card-sale {
  display: flex;
  flex-wrap: wrap;
  section {
    box-sizing: border-box;
    padding: 20px;
    width: 50%;
    position: relative;
    &>div {
      margin-top: 10px;
    }
    &>div:nth-child(1) {
      margin-top: 0;
    }
    &::before {
      content: '';
      width: calc(100% - 40px);
      height: 1px;
      position: absolute;
      left: 20px;
      bottom: 0;
      background-color: #DCDFE6;
    }
    &:after {
      content: '';
      width: 1px;
      height: calc(100% - 40px);
      position: absolute;
      right: 0;
      top: 20px;
      background-color: #DCDFE6;
    }
    &:nth-last-child(-n+2)::before {
      background-color: transparent;
    }
    &:nth-child(2n)::after {
      background-color: transparent;
    }
    .sale-header {
      font-size: 18px;
    }
    .sale-content {
      font-size: 14px;
      span {
        font-size: 24px;
        vertical-align: sub;
      }
    }
  }
}

@media (min-width: 768px) {
}
</style>
