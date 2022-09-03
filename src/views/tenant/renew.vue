<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
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
        <el-button v-if="false" icon="el-icon-search" @click="getList(1)">
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
        prop="order_no"
        label="订单号"
        header-align="center"
      />
      <el-table-column
        prop="pay_type"
        label="续费方式"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            支付方式：<svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
          </div>
          <div>
            应付金额：<span style="text-decoration: line-through;">{{ row.total_price | moneyToFormat }}</span>
          </div>
          <div>
            实付金额：<b>{{ row.pay_price | moneyToFormat }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="coupon"
        label="优惠券"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.coupon">
            <div>
              优惠券名：{{ row.coupon.title }}
            </div>
            <div>
              优惠券金额：-{{ row.coupon.amount | moneyToFormat }}
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="续费类型"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.extend.id ? '套餐' : '自定义' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="days"
        label="延续天数"
        align="center"
      />
      <el-table-column
        width="82"
        label="凭证"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            v-if="row.credential"
            style="width: 60px;height: 60px;"
            fit="cover"
            :src="row.credential ? domin + row.credential : ''"
            :preview-src-list="[row.credential ? domin + row.credential : '']"
          />
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="120"
      >
        <template slot-scope="{ row: { status, reason } }">
          <div v-if="status === 3">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="续费时间"
        width="140"
        align="center"
      />
      <el-table-column
        v-if="false"
        label="操作"
        width="80"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="danger" @click="onDelete({ row, $index })">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions, payOptions } from '@/utils/explain'
import { getRenewList } from '@/api/tenant'

export default {
  name: 'Renew',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      payOptions,
      statusOptions: [
        { label: '全部', value: '', type: '' },
        { label: '待支付', value: 0, type: '' },
        { label: '已支付(待确认)', value: 1, type: 'warning' },
        { label: '通过', value: 2, type: 'success' },
        { label: '驳回', value: 3, type: 'danger' },
        { label: '关闭', value: 4, type: 'info' }
      ],
      list: [],
      search: {
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
      getRenewList({ page, ...this.search, limit: this.pages.limit })
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
    }
  }
}
</script>
<style scoped>
</style>
