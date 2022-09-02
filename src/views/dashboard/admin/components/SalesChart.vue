<template>
  <div>
    <el-card shadow="never" class="card-boder">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-form :inline="true" :model="search">
            <el-form-item label="销售报表" />
            <el-form-item label="资产类型">
              <el-select v-model="search.type" placeholder="请选择" @change="onChangeCurrency">
                <el-option
                  v-for="item in payTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
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
            <el-button icon="el-icon-search" @click="getList()">
              {{ $t('table.search') }}
            </el-button>
          </el-form>
        </div>
      </div>
      <div v-loading="loading">
        <div id="salesChart" style="width: 100%; height: 360px" />
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { homeSales } from '@/api/common'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'UserChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      payTypeOptions: [
        { label: '现金', value: 'cny' },
        { label: '藏豆', value: 'integral' }
      ],
      datas: {
        info: []
      },
      loading: false,
      search: {
        type: 'cny',
        end_time: '',
        start_time: ''
      },
      pickerOptions,
      dateRangeValue: []
    }
  },
  watch: {
    datas: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created() {
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
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.loading = true
      homeSales(this.search)
        .then((response) => {
          this.datas = response.data
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onChangeCurrency() {
      this.getList()
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList()
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('salesChart'))
      this.setOptions(this.datas)
    },
    setOptions(beforeDate) {
      const _this = this
      if (beforeDate.info) {
        const afterRechargeTime = beforeDate.info.map((v) => {
          return v.created_at
        })
        const afterRechargeDate = beforeDate.info.map((v) => {
          return v.amount
        })

        this.chart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [_this.search.type === 'cny' ? '现金销售金额' : '藏豆销售数量']
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
              name: _this.search.type === 'cny' ? '现金销售金额' : '藏豆销售数量',
              type: 'line',
              data: afterRechargeDate,
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#e6a23c',
                  lineStyle: {
                    color: '#e6a23c'
                  }
                }
              },
              areaStyle: {
                color: '#fff7ec'
              }
            }
          ]
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
