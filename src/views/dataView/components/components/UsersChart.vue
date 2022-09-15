<template>
  <div>
    <el-card shadow="never" class="card-boder">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-form :inline="true" :model="search">
            <el-form-item label="用户报表" />
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
        <div id="usersChart" style="width: 100%; height: 360px" />
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '../../../dashboard/admin/components/mixins/resize'
import { usersSales } from '@/api/common'
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
      datas: {
        info: []
      },
      loading: false,
      search: {
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
      usersSales(this.search)
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
      this.chart = echarts.init(document.getElementById('usersChart', 'dark'))
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
            data: ['用户数量']
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
              name: '用户数量',
              type: 'line',
              data: afterRechargeDate,
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#303133',
                  lineStyle: {
                    color: '#303133'
                  }
                }
              },
              areaStyle: {
                color: '#e8e8e8'
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
