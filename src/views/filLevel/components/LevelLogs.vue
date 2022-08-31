<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="分发记录" top="30px" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <p v-if="data.node && ['fil'].includes(data.type)">
            节点号：{{ data.node }}
          </p>
          <p>
            当前期数：{{ data.name }}
          </p>
          <p v-if="['fil'].includes(data.type)">
            期数类型：{{ data.cate | paraphrase(catesOptions) }}
          </p>
          <p v-if="['fil'].includes(data.type)">
            规格：{{ data.specs.name }}
          </p>
        </el-col>
      </el-row>

      <el-descriptions title="统计" size="medium">
        <el-descriptions-item label="已分发天数">{{ count.total_days }}</el-descriptions-item>
        <el-descriptions-item label="分发总量">{{ (count.total_amount || 0) | cutZero }}</el-descriptions-item>
        <el-descriptions-item v-if="data.type === 'fil' && data.cate === 0" label="封装总量">{{ (count.total_fz_num || 0) | cutZero }}</el-descriptions-item>
      </el-descriptions>

      <div class="filter-container">
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
          prop="currency"
          label="专区"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.currency ? row.currency.toUpperCase() : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="order_count"
          label="算力统计"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.order_count || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="real_amount"
          label="实发数量"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.real_amount || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="分发数量"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.amount || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="['fil'].includes(data.type)"
          prop="fz_num"
          label="封装数量"
          align="center"
        >
          <template slot-scope="{ row:{ fz_num } }">
            {{ (fz_num || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="['fil'].includes(data.type)"
          prop="gas"
          :label="`${data.cate === 0 ? '借贷' : '使用'}Gas`"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.gas || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="['fil'].includes(data.type)"
          prop="pledge"
          :label="`${data.cate === 0 ? '借贷' : '使用'}质押`"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.pledge || 0) | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="admin"
          label="分发管理员"
          header-align="center"
        >
          <template slot-scope="{ row:{ admin } }">
            <div v-if="admin">
              <div># {{ admin.id }}</div>
              <div>{{ admin.name }}</div>
            </div>
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
import { dataListLogs } from '@/api/fil-level'
import { agreeCancel } from '@/api/fil'
import { catesOptions, pickerOptions } from '@/utils/explain'
import { parseDate } from '@/utils'

export default {
  name: 'FilLevel',
  components: { Pagination },
  data() {
    return {
      visible: false,
      domin: getToken(DominKey),
      catesOptions,
      pickerOptions,
      search: {
        period_id: 0,
        start_time: '',
        end_time: ''
      },
      count: {
        total_amount: 0,
        total_days: 0,
        total_fz_num: 0
      },
      dateRangeValue: [],
      data: {
        id: 0,
        type: '',
        cate: '',
        name: '',
        node: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      setWalletVisible: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.search.period_id = data.id
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataListLogs({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.count = response.data.count
          this.list = response.data.periodLogs.data
          this.pages.total = response.data.periodLogs.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('data', false)
    },
    onHandCancel(row) {
      const { id } = row
      this.$confirm(`确定对[(#${id})]进行[撤销]操作?`, '撤销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          agreeCancel(id)
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
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog {
  width: 1200px;
}
</style>
