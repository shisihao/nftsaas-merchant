<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="分类名称">
          <el-input v-model="search.name" placeholder="名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
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
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      :data="list"
    >
      <el-table-column
        label="ID"
        prop="id"
        width="80"
      />
      <el-table-column
        label="名称"
        prop="name"
      />
      <el-table-column
        label="分类大图"
      >
        <template slot-scope="{row}">
          <el-image
            class="image"
            :src="row.image && domin + row.image"
            :preview-src-list="[domin + row.image]"
            header-align="center"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="分类小图"
      >
        <template slot-scope="{row}">
          <el-image
            class="image"
            :src="row.icon && domin + row.icon"
            :preview-src-list="[domin + row.icon]"
            header-align="center"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sort"
        width="80"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/shop-classify'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'
export default {
  name: 'ShopClassify',
  components: { AddOrUpdate, Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      addOrUpdateVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current) {
      if (page === 1) this.pages.current = 1
      this.loading = true
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((data) => {
          this.list = data.data.data
          this.pages.total = data.data.total
        })
        .finally(() => { this.loading = false })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onDelete({ name, id }) {
      this.$confirm(
        `确定对[${name}(#${id})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(id).then((data) => {
            this.$message.success(data.msg)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.image{
  width: 100px;
  height: 100px;
}
</style>
