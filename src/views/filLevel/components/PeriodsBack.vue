<template>
  <el-dialog title="归还流水" :visible.sync="visible">
    <el-row>
      <el-col :span="12">
        <p v-if="data.node && ['fil'].includes(data.type)">
          节点号：
          {{ data.node }}
        </p>
        <p>
          当前期数：
          {{ data.name }}
        </p>
      </el-col>
    </el-row>
    <el-divider />
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <!-- <el-form-item label="类型">
          <el-select v-model="search.type" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
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
        prop="receivable_pledge"
        label="上月剩余质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.receivable_pledge) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivable_gas"
        label="上月剩余gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.receivable_gas) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="归还gas"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.gas) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="归还质押"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.pledge) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="receivable_interest"
        label="应收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.receivable_interest) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="interest"
        label="实收利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.interest) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="total_arrears_interest"
        label="累计欠款利息"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ parseFloat(row.total_arrears_interest) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { periodsBackList, exportOrder } from '@/api/fil-level'
import { pickerOptions } from '@/utils/explain'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'PeriodsBack',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      downloadLoading: false,
      pickerOptions,
      dateRangeValue: [],
      data: {
        id: 0,
        node: '',
        name: '',
        type: ''
      },
      list: [],
      search: {
        type: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      typeOptions: [
        { label: '全部', value: '' },
        { label: '正常归还', value: 0 },
        { label: '提前归还', value: 1 }
      ]
    }
  },
  created() {
    this.init()
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

      periodsBackList(this.data.id, { page, limit: this.pages.limit })
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
      exportOrder(this.search)
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

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 1200px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
