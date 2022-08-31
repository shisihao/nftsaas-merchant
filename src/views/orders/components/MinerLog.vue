<template>
  <div>
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="收益流水" name="miner_release" :disabled="loading">
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
            prop="title"
            label="标题"
            header-align="center"
          />
          <template v-if="['fil'].includes(type)">
            <el-table-column
              prop="extend.withdrawable"
              label="可用"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.extend.withdrawable | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="extend.lock"
              label="锁仓"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.extend.lock | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="extend.frozen"
              label="冻结"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.extend.frozen | cutZero }}
              </template>
            </el-table-column>
            <el-table-column
              prop="extend.pawn"
              label="抵押"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.extend.pawn | cutZero }}
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              prop="amount"
              label="收益数量"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.amount | cutZero }}
              </template>
            </el-table-column>
          </template>
          <el-table-column
            prop="created_at"
            label="时间"
            width="140"
            align="center"
          >
          </el-table-column>
        </el-table>       
      </el-tab-pane>
      <el-tab-pane v-if="['fil'].includes(type)" label="补发流水" name="miner_borrow" :disabled="loading">
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
            prop="title"
            label="标题"
            header-align="center"
          />
          <el-table-column
            prop="action"
            label="类型"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-link :type="row.action === 1 ? 'success' : 'danger'" :underline="false">{{ row.action | paraphrase(actionOptions) }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="extend.pledge_amount"
            label="质押"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.extend.pledge_amount | cutZero }}
            </template>
          </el-table-column>
          <el-table-column
            prop="extend.gas_amount"
            label="GAS"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.extend.gas_amount | cutZero }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>
<script>
import { minerList, minerExportOrder } from '@/api/order'
import Pagination from '@/components/Pagination'
export default {
  name: 'MinnerLog',
  components: { Pagination },
  props: {
    type: {
      type: String,
      default: 'fil'
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      activeName: 'miner_release',
      actionOptions: [
        { label: '增加', value: 1 },
        { label: '扣除', value: 2 }
      ],
      search: {
        order_id: 0,
        type: 'miner_release'
      },
      list: [],
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
      minerList({ page, ...this.search, order_id: this.id, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      minerExportOrder({ order_id: this.id })
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    handleClick() {
      this.search.type = this.activeName
      this.getList(1)
    }
  }
}
</script>