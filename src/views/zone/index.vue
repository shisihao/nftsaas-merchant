<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div> -->
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
        label="专区名称"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="uppercase">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_hide"
        label="是否隐藏"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.is_hide"
            :active-value="1"
            :inactive-value="0"
            @change="onChangeHide(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="220"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.displaySort">
            <el-input-number v-model="row.sort" controls-position="right" :min="0" :precision="0" />
            <el-button type="success" icon="el-icon-check" circle :loading="row.loadingSort" @click="onChangeSort(row)" />
            <el-button type="warning" icon="el-icon-close" circle :loading="row.loadingSort" @click="row.displaySort = false;row.sort = row.defaultSort" />
          </div>
          <el-link v-else type="primary" @click="row.displaySort = true">{{ row.sort }} </el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="created_at"
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import { dataList, zoneHidden, zoneSort } from '@/api/zone'
import Pagination from '@/components/Pagination'

export default {
  name: 'Category',
  components: { Pagination },
  data() {
    return {
      list: [],
      search: {},
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            return Object.assign(v, { displaySort: false, defaultSort: v.sort, loadingSort: false })
          })
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onChangeHide(row) {
      zoneHidden(row)
        .then(({ msg = '修改成功' }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          row.is_hide = row.is_hide ? 0 : 1
        })
    },
    onChangeSort(row) {
      row.loadingSort = true
      zoneSort(row)
        .then(({ msg = '修改成功' }) => {
          this.$message.success(msg)
          row.displaySort = false
        })
        .finally(() => {
          row.loadingSort = false
        })
    }
  }
}
</script>
