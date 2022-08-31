<template>
  <div>
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="类型">
          <el-select v-model="search.type" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
import { aheadList, aheadExportOrder } from '@/api/order'
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
      dateRangeValue: [],
      search: {
        order_id: 0,
        type: '',
        start_time: '',
        end_time: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      typeOptions: [
        { label: '全部', value: '' },
        { label: '正常归还', value: 0 },
        { label: '提前归还', value: 1 }
      ]
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
      aheadList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
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
      aheadExportOrder({ order_id: this.id })
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    }
  }
}
</script>