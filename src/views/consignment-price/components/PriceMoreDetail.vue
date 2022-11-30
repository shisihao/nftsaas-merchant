<template>
  <el-dialog title="全部" width="70%" :visible.sync="visible" append-to-body @closed="onClose()">
    <div>
      <el-table
        v-loading="loading"
        border
        :data="list"
      >
        <el-table-column
          label="ID"
          width="80"
          align="center"
          prop="id"
        />
        <el-table-column
          label="基准价"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            ￥{{ row.cny_price }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          header-align="center"
          align="center"
          prop="num"
        />
        <el-table-column
          label="是否选中"
          width="160"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            <div :class="row.status === 1 ? 'is-status' : 'no-status'">{{ row.status | paraphrase(whetherOptions) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="基准价时间"
          align="center"
          width="180"
          prop="time"
        />
        <el-table-column
          label="创建时间"
          align="center"
          width="180"
          prop="created_at"
        />
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { consignmentPriceList } from '@/api/consignment-price'
import { whetherOptions } from '@/utils/explain'

export default {
  name: 'PriceMoreDetail',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      list: [],
      search: {
        log_id: 0
      },
      whetherOptions,
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
      if (data) {
        this.visible = true
        this.search.log_id = data.id
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      consignmentPriceList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>

<style  scoped>
.is-status{
color:#2ed573;
font-weight: 700;
}
.no-status{
  color: #909399;
  font-weight: 700;
}
</style>
