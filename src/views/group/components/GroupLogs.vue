<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="分发记录" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <span>
            # {{ data.id }}
            <el-divider direction="vertical" />
            专区：<span style="text-transform:uppercase;">{{ data.zone }}</span>
            <el-divider direction="vertical" />
            {{ ['fil', 'bzz'].includes(data.zone) ? '节点号' : '分组名称' }}：{{ data.name }}
          </span>
        </el-col>
      </el-row>
      <el-divider />
      <div v-if="false" class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="时间">
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
          label="单T产量"
          header-align="center"
        >
          <template slot-scope="{ row }">
            {{ parseFloat(row.per_ming_num) }}
          </template>
        </el-table-column>
        <el-table-column
          label="总产量"
          header-align="center"
        >
          <template slot-scope="{ row }">
            {{ parseFloat(row.total_ming_num) }}
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
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button v-if="isCancel(row)" type="danger" @click="onHandCancel(row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import { groupLogs, issueCancel } from '@/api/group'
import { parseDate } from '@/utils'

export default {
  name: 'GroupLogs',
  components: { Pagination },
  data() {
    return {
      visible: false,
      domin: getToken(DominKey),
      data: {
        id: 0,
        zone: '',
        name: ''
      },
      list: [],
      search: {
        currency: '',
        action: '',
        start: '',
        end: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      setWalletVisible: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      groupLogs(this.data.id, { page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start = value[0]
        this.search.end = value[1]
      } else {
        this.search.start = ''
        this.search.end = ''
        this.getList(1)
      }
    },
    onClose() {
      this.$reset('search', false)
    },
    onHandCancel(row) {
      this.$confirm(`确定对[(#${row.id})]进行[撤销]操作?`, '撤销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          issueCancel(row.id)
            .then(({ msg = '撤销成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    },
    isCancel(row) {
      return new Date().getDate() === parseDate(row.created_at).getDate() && new Date().getMonth() === parseDate(row.created_at).getMonth() && new Date().getYear() === parseDate(row.created_at).getYear()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1000px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
