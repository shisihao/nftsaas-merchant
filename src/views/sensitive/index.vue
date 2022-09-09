<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item v-if="false" label="名称">
          <el-input v-model="search.name" placeholder="名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button v-if="false" icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
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
        prop="type"
        label="类型"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { type } }">
          <el-tag :type="type === 'replace' ? 'success': 'warning'">
            {{ type === "replace" ? "替换" : "提示" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="word"
        label="敏感词"
        align="center"
      />
      <el-table-column
        prop="replace"
        label="替换内容"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/sensitive'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'Sensitive',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      list: [],
      search: {
        name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false,
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(
        `确定对[(#${row.id})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
::v-deep .image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>
