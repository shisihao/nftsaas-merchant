<template>
  <div class="app-container">
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
        prop="ip"
        label="IP"
        align="center"
        width="120"
      />
      <el-table-column
        prop="request_method"
        label="请求方式"
        align="center"
        width="80"
      />
      <el-table-column
        prop="code"
        label="状态码"
        align="center"
        width="80"
      />
      <el-table-column
        prop="module"
        label="路由"
        header-align="center"
      />
      <el-table-column
        prop="message"
        label="信息"
        header-align="center"
      />
      <el-table-column
        prop="admin"
        label="管理员"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            # {{ row.admin_id }}
          </div>
          <div>
            {{ row.admin_name }}
          </div>
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
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/log'

export default {
  name: 'Logs',
  components: { Pagination },
  data() {
    return {
      list: [],
      search: {
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
