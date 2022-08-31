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
        label="提现相关"
        header-align="center"
        min-width="140"
      >
        <template slot-scope="{ row }">
          <div>
            支付类型：<svg-icon :icon-class="row.account_type" /> {{ row.account_type | paraphrase(payOptions) }}
          </div>
          <div>
            金额：￥ {{ row.amount }}
          </div>
          <div>
            服务费：￥ {{ row.service_charge }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="账号信息"
        header-align="center"
      >
        <template slot-scope="{ row: { account_info } }">
          <div>账号：{{ account_info.number }}</div>
          <div>用户名：{{ account_info.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户信息"
        header-align="center"
      >
        <template slot-scope="{ row: { user: { name, tel, id, email } } }">
          <div># {{ id }}</div>
          <div>用户名：{{ name }}</div>
          <div>账号：{{ tel ? tel : email }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
        align="center"
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
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="审核员"
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
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { cnyList } from '@/api/report'
import { examineStatusOptions, payOptions } from '@/utils/explain'

export default {
  name: 'CnyList',
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
      loading: false,
      payOptions,
      statusOptions: examineStatusOptions,
      list: [],
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
      cnyList({ page, ...searchData, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
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