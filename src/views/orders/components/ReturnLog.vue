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
        width="80"
        align="center"
      />
      <el-table-column
        prop="pledge"
        label="上月剩余质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_pledge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="上月剩余gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_gas | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="surplus_interest"
        label="上月剩余利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.surplus_interest | cutZero }}
        </template>
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
        prop="pledge"
        label="归还质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.pledge | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="归还gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.gas | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="interest"
        label="应收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.interest | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="back_interest"
        label="实收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.back_interest | cutZero }}
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
  </div>
</template>
<script>
import { returnList, returnExportOrder } from '@/api/order'
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'AheadLog',
  components: { Pagination },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pickerOptions,
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
      returnList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
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
      returnExportOrder({ order_id: this.id })
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>