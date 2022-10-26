<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="手机号/邮箱" clearable @clear="getList()" @keyup.enter.native="getList()" />
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
        <el-button icon="el-icon-search" @click="getList()">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="search.type" @tab-click="handleClick">
      <el-tab-pane label="订单列表" name="order">
        <order-list ref="orderList" :search="search" />
      </el-tab-pane>
      <el-tab-pane label="提资产列表" name="withdrawal">
        <coin-list ref="coinList" :search="search" />
      </el-tab-pane>
      <el-tab-pane label="提现列表" name="cny_withdrawal">
        <cny-list ref="cnyList" :search="search" />
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { exportOrder } from '@/api/report'
import { pickerOptions } from '@/utils/explain'
import OrderList from './components/OrderList'
import CoinList from './components/CoinList'
import CnyList from './components/CnyList'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Report',
  components: { Pagination, OrderList, CoinList, CnyList },
  data() {
    return {
      domin: getToken(DominKey),
      downloadLoading: false,
      list: [],
      dateRangeValue: [],
      pickerOptions,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        keywords: '',
        type: 'order',
        start_time: '',
        end_time: ''
      }
    }
  },
  created() {
    this.handleClick()
  },
  methods: {
    init() {

    },
    getList() {
      if (this.search.type === 'order') {
        this.$refs.orderList.getList(1)
      } else if (this.search.type === 'withdrawal') {
        this.$refs.coinList.getList(1)
      } else if (this.search.type === 'cny_withdrawal') {
        this.$refs.cnyList.getList(1)
      }
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = ''
        this.search.end_time = ''
        this.getList()
      }
    },
    handleClick(tab) {
      this.pages.total = 0
      this.list = []
      if (this.search.phone) {
        this.getList()
      }
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    }
  }
}
</script>
<style scoped>
.statistics {
  display: inline-block;
  margin-right: 20px;
}
</style>
