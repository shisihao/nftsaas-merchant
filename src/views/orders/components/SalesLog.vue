<template>
  <div>
    <el-descriptions size="medium" title="" :column="2">
      <el-descriptions-item label="订单金额">{{ data.total_price }}</el-descriptions-item>
      <el-descriptions-item label="确认时间">{{ data.confirm_time }}</el-descriptions-item>
    </el-descriptions>
    <el-row>
      <el-col v-if="direct_log" :span="12">
        <el-descriptions size="medium" title="" :column="1">
          <el-descriptions-item label="直推奖励">#{{ direct_log.id }}</el-descriptions-item>
          <el-descriptions-item label="奖励形式">{{ direct_log.currency | paraphrase(currencyReportOptions) }}</el-descriptions-item>
          <el-descriptions-item label="奖励金额">{{ direct_log.amount | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="奖励用户">
            <div v-if="direct_log.user" style="display: inline-block;margin-left: 2px">
              <div>
                #{{ direct_log.user.id }}
                <el-divider direction="vertical" />
                {{ direct_log.user.name }}
              </div>
              <div>
                {{ direct_log.user.phone || direct_log.user.email }}
              </div>
            </div>
            <div v-else>
              用户已删除
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col v-if="indirect_log" :span="12">
        <el-descriptions size="medium" title="" :column="1">
          <el-descriptions-item label="间推奖励">#{{ indirect_log.id }}</el-descriptions-item>
          <el-descriptions-item label="奖励形式">{{ indirect_log.currency | paraphrase(currencyReportOptions) }}</el-descriptions-item>
          <el-descriptions-item label="奖励金额">{{ indirect_log.amount | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="奖励用户">
            <div v-if="indirect_log.user" style="display: inline-block;margin-left: 2px">
              <div>
                #{{ indirect_log.user.id }}
                <el-divider direction="vertical" />
                {{ indirect_log.user.name }}
              </div>
              <div>
                {{ indirect_log.user.phone || indirect_log.user.email }}
              </div>
            </div>
            <div v-else>
              用户已删除
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>

    <div class="filter-container">
      <el-form :inline="true" :model="search">
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
      />
      <el-table-column
        prop="currency"
        label="资产类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.currency | paraphrase(currencyReportOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="奖励用户信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
                <span>
                  <el-divider direction="vertical" />
                  {{ row.user.agency ? row.user.agency.name : '注册用户' }}
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="团队奖励权益"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.extend.sale_commission || 0 }}%
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>
<script>
import { salesList, salesExportOrder } from '@/api/order'
import Pagination from '@/components/Pagination'
import { currencyReportOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'SalesLog',
  components: { Pagination },
  props: {
    id: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      downloadLoading: false,
      currencyReportOptions,
      search: {
        order_id: 0
      },
      list: [],
      direct_log: {
        id: 0,
        currency: '',
        amount: 0,
        user: {
          id: 0,
          name: '',
          phone: '',
          email: ''
        }
      },
      indirect_log: {
        id: 0,
        currency: '',
        amount: 0,
        user: {
          id: 0,
          name: '',
          phone: '',
          email: ''
        }
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(row) {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      salesList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.team_logs.data
          this.pages.total = response.data.team_logs.total
          this.direct_log = response.data.direct_log
          this.indirect_log = response.data.indirect_log
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      salesExportOrder({ order_id: this.id })
        .then(response => {
          location.href = '/' + response.data.filename
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
