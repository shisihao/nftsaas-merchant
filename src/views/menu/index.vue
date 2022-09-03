<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="权限名称">
          <el-input v-model="search.name" placeholder="权限名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="权限别名">
          <el-input v-model="search.alias" placeholder="权限别名" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
      row-key="id"
      :tree-props="{children: 'children'}"
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
        align="center"
      />
      <el-table-column
        prop="name"
        label="权限名称"
        align="center"
      />
      <el-table-column
        prop="alias"
        label="权限别名"
        width="120"
        align="center"
      />
      <el-table-column
        prop="icon"
        label="权限图标"
        align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon v-if="row.icon" :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="跳转地址"
        align="center"
      />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.type ? 'success' : ''">{{ row.type ? '菜单' : '目录' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="show"
        label="是否显示"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.show ? "是" : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="80"
        align="center"
      />
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="!['whisper', 'assist', 'renew', 'coupons'].includes(row.alias)">
            <el-button type="primary" @click="onAddOrUpdate(lists, row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/menu'
import AddOrUpdate from './components/AddOrUpdate'
import { listTree } from '@/utils/index'

export default {
  name: 'Menu',
  components: { AddOrUpdate },
  data() {
    return {
      rawList: [],
      list: [],
      lists: [],
      search: {
        name: '',
        alias: ''
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList({ ...this.search })
        .then(response => {
          if (response.code !== 0) return
          this.rawList = response.data
          this.list = listTree(response.data, 'id')
          if (this.lists.length === 0) {
            this.lists = this.list
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(list, data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(list, data)
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
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-wrapper {
  background: #303133;
  color: #fff;
  padding-top: 0;
  padding-bottom: 0;
  &[x-placement^="top"] .popper__arrow::after {
    border-top-color: #303133;
  }
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
.role-box {
  width: 100px;
  max-height: 100px;
  position: relative;
}
.role-box img {
  width: 100%;
}
.role-box span {
  position: absolute;
  width: 58px;
  left: 32px;
  top: 7px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
