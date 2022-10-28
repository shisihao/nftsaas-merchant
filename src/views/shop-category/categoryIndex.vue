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
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        width="120"
        label="封面图"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            class="image-item"
            fit="contain"
            :src="row.image && domin + row.image"
            :preview-src-list="[domin + row.image]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
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
          <el-button type="primary" @click="onLowerCate(row)">下级分类</el-button>
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

    <!-- 弹窗, 下级分类 -->
    <lower-category
      v-if="lowerCategoryVisible"
      ref="lowerCategory"
    />
  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/shop-category'
import { getToken, DominKey } from '@/utils/auth'
import CategoryAddOrUpdate from './components/CategoryAddOrUpdate'
import LowerCategory from './components/LowerCategory'
import Pagination from '@/components/Pagination'

export default {
  name: 'Category',
  components: { Pagination, CategoryAddOrUpdate, LowerCategory },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {},
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false,
      lowerCategoryVisible: false,
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
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onLowerCate(data) {
      this.lowerCategoryVisible = true
      this.$nextTick(() => {
        this.$refs.lowerCategory && this.$refs.lowerCategory.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(`确定对[(#${row.id})]进行[删除]操作?`, '删除',
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
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
  }
</style>
