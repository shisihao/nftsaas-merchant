<template>
  <div>
    <el-card shadow="never" class="card-boder">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-form :inline="true" :model="search">
            <el-form-item label="订单报表" />
            <el-form-item label="昨日新增订单">
              <count-to :start-val="0" :end-val="order.yesterday" :duration="2000" class="card-panel-num" />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="search.status" clearable @change="getList()">
                <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <div id="orderChart" style="width: 100%; height: 360px" />
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '../../../dashboard/admin/components/mixins/resize'
import { homeOrder } from '@/api/common'
import { pickerOptions, orderStatusOptions } from '@/utils/explain'
import CountTo from 'vue-count-to'

export default {
  name: 'UserChart',
  components: {
    CountTo
  },
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
    },
    order: {
      type: Object,
      default: () => ({
        yesterday: 0,
        total: 0
      })
    }
  },
  data() {
    return {
      chart: null,
      datas: {
        info: []
      },
      loading: false,
      search: {
        status: '',
        end_time: '',
        start_time: ''
      },
      pickerOptions,
      orderStatusOptions,
      dateRangeValue: [],
      orderTotal: 0
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
      homeOrder(this.search)
        .then((response) => {
          this.loading = false
          this.datas = response.data
        })
        .catch(() => {})
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
      this.chart = echarts.init(document.getElementById('orderChart'))
      this.setOptions(this.datas)
    },
    setOptions(beforeDate) {
      if (beforeDate.info) {
        const afterRechargeTime = beforeDate.info.map((v) => {
          return v.created_at
        })
        const afterRechargeDate = beforeDate.info.map((v) => {
          return v.count
        })

        this.chart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['订单数量']
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
              name: '订单数量',
              type: 'line',
              data: afterRechargeDate,
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#f56c6c',
                  lineStyle: {
                    color: '#f56c6c'
                  }
                }
              },
              areaStyle: {
                color: '#fdecec'
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

  .card-panel-num{
    margin-right: 20px;
    font-weight: 600;
    color: #1890ff;
  }
</style>
