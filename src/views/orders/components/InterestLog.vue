<template>
  <div>
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
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
        width="80">
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="订单ID"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        label="归还金额"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="should_interest"
        label="实还利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ (row.interest > row.should_interest ? row.should_interest : row.interest) | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="arrears_interest"
        label="新增欠款利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.arrears_interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="归还抵押数量"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.pledge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="归还GAS数量"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.gas | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="interest"
        label="归还累计欠款利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ (row.interest > row.should_interest ? minusNum(row.interest, row.should_interest) : 0) | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="arrears_interest"
        label="累计利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.arrears_interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        width="140"
        align="center"
      />
    </el-table>
  </div>
</template>
<script>
import { interestList, interestExportOrder } from '@/api/order'
import Pagination from '@/components/Pagination'
import { BigNumber } from 'bignumber.js'

export default {
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: 'fil'
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      search: {
        order_id: 0
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(row) {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      interestList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      interestExportOrder({ order_id: this.id })
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    minusNum(num1, num2) {
      return new BigNumber(num1).minus(num2)
    }
  }
}
</script>