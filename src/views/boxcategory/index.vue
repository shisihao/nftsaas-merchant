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
        label="分类名称"
        align="center"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <template v-if="row.sortEdit">
            <el-input-number v-model="row.sort" controls-position="right" class="edit-input" size="small" :min="0" :precision="0" />
            <el-button
              class="cancel-btn"
              type="warning"
              @click="onCancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <el-link v-else type="primary" :underline="false" @click="row.sortEdit = true">{{ row.sort }}</el-link>
        </template>
      </el-table-column>
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
          <template v-if="row.sortEdit">
            <el-button type="success" @click="onConfirmSortEdit(row)">确定</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </template>
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
import { dataList, deleteData, sortCategory } from '@/api/boxcategory'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination/index'

export default {
  name: 'Category',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        zone: ''
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
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            return Object.assign(v, { sortEdit: false, sortOld: v.sort })
          })
          this.pages.total = response.data.total
        })
        .catch(error => {
          this.$message.error(error.msg)
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
            .catch(({ msg = '删除失败' }) => {
              this.$message.error(msg)
            })
        })
        .catch(() => {})
    },
    onCancelEdit(row) {
      row.sortEdit = false
      row.sort = row.sortOld
    },
    onConfirmSortEdit(row) {
      sortCategory({ id: row.id, data: { sort: row.sort }})
        .then(({ msg = '修改成功' }) => {
          this.$message.success(msg)
          row.sortEdit = false
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style scoped>
::v-deep .edit-input {
  padding-right: 50px;
}
::v-deep .cancel-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  margin-top: -14px;
}
::v-deep .edit-input .el-input-number__decrease,::v-deep .edit-input .el-input-number__increase{
  display: none;
}
::v-deep .edit-input.is-controls-right .el-input__inner {
  padding: 0;
}
</style>
