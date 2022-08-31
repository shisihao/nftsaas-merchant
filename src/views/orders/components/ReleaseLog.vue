<template>
  <div>
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
          prop="amount"
          label="释放金额"
          align="center"
        />
        <el-table-column
          prop="should_amount"
          label="当前锁仓总数"
          align="center"
        />
        <el-table-column
          prop="extend.frozen"
          label="冻结金额"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.extend ? row.extend.frozen : 0 | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="extend.withdrawable"
          label="可用金额"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.extend ? row.extend.withdrawable : 0 | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="释放时间"
          align="center"
        />
      </el-table>

      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { releaseLogList } from '@/api/order'
import Pagination from '@/components/Pagination'

export default {
  name: 'ReleaseLog',
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
      list: [],
      currencyOptions: [
        { label: '-', value: null },
        { label: '可用', value: 'withdrawable' },
        { label: '冻结', value: 'frozen' }
      ],
      search: {},
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
    init(data) {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      releaseLogList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('data', false)
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog {
  width: 600px;
}
.el-input-number {
  width: 200px;
}
</style>
