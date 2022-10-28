<template>
  <el-dialog top="30px" width="1000px" :title="data.name" :visible.sync="visible" @closed="onClose()">
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
          width="80"
          align="center"
        />
        <el-table-column
          label="操作"
          width="240"
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
      <category-add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshList="getList()"
      />

    </div>
  </el-dialog>
</template>

<script>
import { dataList, deleteData } from '@/api/shop-category'
import { getToken, DominKey } from '@/utils/auth'
import CategoryAddOrUpdate from './CategoryAddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'Category',
  components: { Pagination, CategoryAddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      search: {
        level: 2,
        parent_id: 0
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      data: {
        name: ''
      },
      addOrUpdateVisible: false,
      moveGoodsVisible: false,
      loading: false
    }
  },
  methods: {
    init(data) {
      if (data.id) {
        this.visible = true
        this.search.parent_id = data.id
        this.data.name = data.name
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      if (!data) {
        data = {
          id: 0,
          name: '',
          parent_id: this.search.parent_id,
          sort: 0
        }
      }
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(`确定对[(#${row.id})]进行[删除]操作?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
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
    onClose() {
      this.$reset('data', false)
    }
  }
}
</script>
<style scoped>
</style>
