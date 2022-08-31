<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="名称">
          <el-input v-model="search.keywords" placeholder="ID/分组名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="专区">
          <el-select v-model="search.zone" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in zoneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否分发">
          <el-select v-model="search.is_issue" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="zone"
        label="专区"
        align="center"
      >
        >
        <template slot-scope="{ row }">
          {{ row.zone | paraphrase(zoneOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="分组名称"
        header-align="center"
      />
      <el-table-column
        label="今日是否分发"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link v-if="row.issue_status" type="success" :underline="false">是</el-link>
          <el-link v-else type="danger" :underline="false">否</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
      <el-table-column
        label="操作"
        width="340"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="primary" @click="onAddIssue(row)">分发</el-button>
          <el-button type="primary" @click="onGroupLogs(row)">分发记录</el-button>
          <el-button type="primary" @click="onPeriodsList(row)">分组期数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-group
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList(1)"
    />
    <!-- 分发记录 -->
    <group-logs
      v-if="groupLogsVisible"
      ref="groupLogs"
    />
    <!-- 分发 -->
    <add-issue
      v-if="addIssueVisible"
      ref="addIssue"
    />
    <!-- 分组期数 -->
    <periods-list
      v-if="priodsListVisible"
      ref="priodsList"
    />

  </div>
</template>

<script>
import { dataList } from '@/api/group'
import Pagination from '@/components/Pagination'
import AddOrUpdateGroup from './components/AddOrUpdateGroup'
import GroupLogs from './components/GroupLogs'
import AddIssue from './components/AddIssue'
import PeriodsList from './components/PeriodsList'
import { zoneOptions, catesOptions, whetherOptions } from '@/utils/explain'

export default {
  name: 'Group',
  components: { Pagination, AddOrUpdateGroup, GroupLogs, AddIssue, PeriodsList },
  data() {
    return {
      zoneOptions,
      catesOptions,
      whetherOptions,
      search: {
        keywords: '',
        zone: '',
        is_issue: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false,
      groupLogsVisible: false,
      addIssueVisible: false,
      priodsListVisible: false,
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
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(row)
      })
    },
    onGroupLogs(row) {
      this.groupLogsVisible = true
      this.$nextTick(() => {
        this.$refs.groupLogs && this.$refs.groupLogs.init(row)
      })
    },
    onAddIssue(row) {
      this.addIssueVisible = true
      this.$nextTick(() => {
        this.$refs.addIssue && this.$refs.addIssue.init(row)
      })
    },
    onPeriodsList(row) {
      this.priodsListVisible = true
      this.$nextTick(() => {
        this.$refs.priodsList && this.$refs.priodsList.init(row)
      })
    }
  }
}
</script>
