<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <!-- <el-form-item label="标签">
          <el-input v-model="search.name" placeholder="标签" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button> -->
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdateTag()">
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
        label="标签"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdateTag(row)">编辑</el-button>
          <el-button type="danger" :loading="row.loadingDel" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-tag
      v-if="addOrUpdateTagVisible"
      ref="addOrUpdateTag"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { tagList, deleteDataTag } from '@/api/feedback'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import AddOrUpdateTag from './components/AddOrUpdateTag'

export default {
  name: 'Feedback',
  components: { Pagination, AddOrUpdateTag },
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
      statusOptions: [
        { label: '全部', value: '' },
        { label: '未解决', value: 0 },
        { label: '已解决', value: 1 }
      ],
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      addOrUpdateTagVisible: false
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
      tagList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onAddOrUpdateTag(data) {
      this.addOrUpdateTagVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateTag && this.$refs.addOrUpdateTag.init(data)
      })
    },
    onDelete(row) {
      row.loadingDel = true
      this.$confirm(`确定对[(#${row.id})]进行[删除]操作?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
      )
        .then(() => {
          deleteDataTag(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              row.loadingDel = false
            })
        })
        .catch(() => {
          row.loadingDel = false
        })
    }
  }
}
</script>
