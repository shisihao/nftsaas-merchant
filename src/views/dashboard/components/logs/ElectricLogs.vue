<template>
  <el-dialog title="用户电费流水" width="1000px" :visible.sync="visible">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="支付方式">
          <el-select v-model="search.pay_type" @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
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
          导出 Excel
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
        prop="title"
        label="标题"
        header-align="center"
      />
      <el-table-column
        prop="amount"
        label="充值金额"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon icon-class="cny" /> {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="实付金额"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.target_electric.pay_type" /> {{ row.target_electric.pay_price | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="target_electric.order_no"
        label="关联订单"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />

    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>
<script>
import { getElectricLogs, getElectricExport } from '@/api/common'
import Pagination from '@/components/Pagination'
import { pickerOptions, payOptions } from '@/utils/explain'
import { DominKey, getToken } from '@/utils/auth'
export default {
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      domin: getToken(DominKey),
      downloadLoading: false,
      pickerOptions,
      payOptions,
      dateRangeValue: [],
      list: [],
      search: {
        start_time: '',
        end_time: '',
        pay_type: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  created() {
  },
  methods: {
    init() {
      this.visible = true
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      getElectricLogs({ page, ...this.search, limit: this.pages.limit })
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
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onHandleDownload() {
      this.downloadLoading = true
      getElectricExport(this.search)
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
<style scoped>

</style>
