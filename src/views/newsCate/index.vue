<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
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
        prop="name"
        label="栏目名称"
        align="center"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="80"
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
import { dataList, deleteData } from '@/api/news-cate'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'New',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        keywords: '',
        is_delete: 0
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false,
      commentsVisible: false,
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList(this.search)
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data
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
      this.$confirm(`确定对[(#${row.id})]进行[删除]操作?
        ${row.news_count ? '<div style="color: #f56c6c;">注：删除分栏，该分栏下的资讯也会删除，确认删除？</div>' : ''}`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'error'
      }
      )
        .then(() => {
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(({ msg = '删除失败' }) => {
              this.$message.error(msg)
            })
        })
        .catch(() => {})
    }
  }
}
</script>
