<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          导出
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="date"
        label="日期"
        align="center"
      />
      <el-table-column
        prop="uv"
        label="当日UV峰值"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="统计时间"
        align="center"
      />
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import { uvList, uvExport } from '@/api/tenant'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'

export default {
  name: 'UvStatistics',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      pickerOptions,
      dateRangeValue: [],
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        start_time: '',
        end_time: ''
      },
      downloadLoading: false
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
      uvList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
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
    onHandleDownload() {
      this.downloadLoading = true
      uvExport(this.search).then(response => {
        location.href = this.domin + response.data.filename
      })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
