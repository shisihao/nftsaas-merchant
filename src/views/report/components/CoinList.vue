<template>
  <div>
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
        label="提现用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { user } }">
          <div v-if="user">
            <el-avatar :key="user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="user.avatar ? (domin + user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ user.name }}
                <span v-if="user.certification">
                  <el-divider direction="vertical"></el-divider>
                  <el-tag effect="plain">{{ user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ user.phone || user.email}}
              </div>
              <div>
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="提现相关"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row: { num, fee, currency } }">
          <div>资产类型: <span v-if="currency">{{ currency.toUpperCase() }}</span><span v-else>-</span></div>
          <div>提现个数：{{ num | cutZero }}</div>
          <div>手续费：{{ fee | cutZero }}</div>
          <div>实际到账：{{ toFixedNum(num, fee) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pid"
        label="流水号"
        header-align="center"
      />
      <el-table-column
        label="到账地址"
        header-align="center"
      >
        <template slot-scope="{ row: { to_address, currency } }">
          <div v-if="to_address">
            <el-tooltip class="item" effect="dark" :content="to_address" placement="bottom-start">
              <div class="ellipsis">
                <el-link v-if="[...withdrawOptions[0].currency].includes(currency)" class="ellipsis" type="primary" target="_blank" :href="currency | paraphrase(withdrawOptions[1].to_address,'type','address') | intactmerge(to_address)" :underline="false">{{ to_address }}</el-link>
                <span v-else>{{ to_address }}</span>
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="HASH"
        header-align="center"
      >
        <template slot-scope="{ row: { hash, currency } }">
          <div v-if="hash">
            <el-tooltip class="item" effect="dark" :content="hash" placement="bottom-start">
              <div class="ellipsis">
                <el-link v-if="[...withdrawOptions[0].currency].includes(currency)" class="ellipsis" type="primary" target="_blank" :href="currency | paraphrase(withdrawOptions[2].hash,'type','hash') | intactmerge(hash)" :underline="false">{{ hash }}</el-link>
                <span v-else>{{ hash }}</span>
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="审核人"
        header-align="center"
      >
        <template slot-scope="{ row: { handler } }">
          <div v-if="handler">
            <div># {{ handler.id }}</div>
            <div>{{ handler.name }}</div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="70"
      >
        <template slot-scope="{ row: { status, reason } }">
          <div v-if="status === 2">
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
        label="时间"
        align="center"
        width="170"
      >
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建: {{ created_at }}</div>
          <div>更新: {{ updated_at }}</div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { withdrawaList } from '@/api/report'
import { getToken, DominKey } from '@/utils/auth'
import { BigNumber } from 'bignumber.js'
import { examineStatusOptions, currencyReportOptions, withdrawOptions } from '@/utils/explain'

export default {
  name: 'CoinList',
  components: { Pagination },
  props: {
    search: {
      type: Object,
      default: function () {
        return { 
          keywords: '',
          start_time: '',
          end_time: ''
        }
      }
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      statusOptions: examineStatusOptions,
      currencyOptions: currencyReportOptions,
      withdrawOptions,
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  filters: {
    intactmerge: function(url, val) {
      return `${url}${val}`
    }
  },
  created() {
  },
  methods: {
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      if (!this.search.keywords) {
        this.$reset('list', false)
        return false
      }
      let searchData =  Object.assign({}, this.search)
      searchData.status = 1
      withdrawaList({ page, ...searchData, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    toFixedNum(num, fee) {
      return new BigNumber(num).minus(fee)
    },
  }
}
</script>
<style lang="scss" scoped>
.statistics {
  display: inline-block;
  margin-right: 20px;
}
</style>