<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="期数">
          <el-select v-model="search.period_id" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="时间">
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
        <el-button v-if="false" type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}分发
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
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
        prop="node"
        label="节点号"
        header-align="center"
      />
      <el-table-column
        prop="period.name"
        label="期数"
        header-align="center"
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
        label="期数类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.currency)">
            {{ row.period.cate | paraphrase(catesOptions) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="规格"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.currency)">
            {{ row.period.specs.name }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_count"
        label="算力统计"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.order_count | cutZero }}
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
          {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fz_num"
        label="封装数量"
        align="center"
      >
        <template slot-scope="{ row:{ currency, fz_num } }">
          <div v-if="['fil'].includes(currency)">
            {{ fz_num | cutZero }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="借贷/使用 Gas"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.currency)">
            {{ row.gas | cutZero }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="借贷/使用 质押"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.currency)">
            {{ row.pledge | cutZero }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="admin"
        label="分发管理员"
        header-align="center"
      >
        <template slot-scope="{ row:{ admin } }">
          <div v-if="admin">
            <div>#{{ admin.id }}</div>
            <div>{{ admin.name }}</div>
          </div>
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
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button v-if="isCancel(row)" type="danger" @click="onHandCancel(row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, agreeCancel, exportExport } from '@/api/fil'
import { dataList as filLevel } from '@/api/fil-level'
import { pickerOptions, catesOptions } from '@/utils/explain'
import { parseDate } from '@/utils'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Fil',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      downloadLoading: false,
      catesOptions,
      search: {
        start: '',
        end: '',
        period_id: ''
      },
      dateRangeValue: [],
      levelOptions: [],
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      pickerOptions,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.getFileLevelList()
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
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getFileLevelList() {
      filLevel({ limit: 1000 })
        .then(response => {
          this.levelOptions = response.data.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          })
        })
        .catch(() => {
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start = value[0]
        this.search.end = value[1]
      } else {
        this.search.start = this.search.end = ''
        this.getList(1)
      }
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
    onHandleDownload() {
      this.downloadLoading = true
      exportExport(this.search)
        .then(response => {
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
