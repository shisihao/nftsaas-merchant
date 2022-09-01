<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        header-align="center"
        prop="title"
        label="标题"
      />
      <el-table-column
        align="center"
        label="内容"
      >
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="onContent(row)">点击查看</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        prop="sort"
        label="排序"
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
      :add-or-update-visible.sync="addOrUpdateVisible"
      @refreshList="getList()"
    />

    <el-dialog
      :title="form.title"
      width="800px"
      append-to-body
      :visible.sync="editTinymceVisible"
    >
      <div class="dialog-img" v-html="form.content" />
    </el-dialog>

  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/helps'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'Helps',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      form: {
        title: '',
        content: ''
      },
      addOrUpdateVisible: false,
      editTinymceVisible: false,
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
      dataList({ page, limit: this.pages.limit })
        .then(response => {
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
    },
    onContent(row) {
      this.form = { ...row }
      this.editTinymceVisible = true
    }
  }
}
</script>
<style scoped lang="scss">
</style>
