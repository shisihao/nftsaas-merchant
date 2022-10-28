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
        label="名称"
        align="center"
      />
      <el-table-column
        prop="state"
        label="状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="onNoRegion(row)">不配送区域</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="160"
        align="center"
      />
      <el-table-column
        label="操作"
        width="180"
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
      @closeAddOrUpdate="onCloseAddOrUpdate"
    />

    <!-- 弹窗, 不配送区域 -->
    <no-region
      v-if="noRegionVisible"
      ref="noRegion"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData } from '@/api/delivery'
import AddOrUpdate from './components/AddOrUpdate'
import NoRegion from './components/NoRegion'

export default {
  name: 'Delivery',
  components: { Pagination, AddOrUpdate, NoRegion },
  data() {
    return {
      list: [],
      search: {},
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      addOrUpdateVisible: false,
      noRegionVisible: false
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
    onCloseAddOrUpdate() {
      this.addOrUpdateVisible = false
    },
    onNoRegion(data) {
      this.noRegionVisible = true
      this.$nextTick(() => {
        this.$refs.noRegion && this.$refs.noRegion.init(data)
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
          deleteData(id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
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
