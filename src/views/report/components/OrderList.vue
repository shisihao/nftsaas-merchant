<template>
  <div>
    <div>
      <el-row>
        <el-col :span="12">
          <p>
            <svg-icon icon-class="radius-cny" style="color: #CC9B51;width: 24px;height: 24px;" /> <span style="margin-right: 12px">现</span>金：
          </p>
          <div class="statistics">
            <span>订单总金额：</span>
            <b>{{ (order_total_amount.cny_total_amount || 0) | cutZero | moneyToFormat }}</b>
          </div>
          <div class="statistics">
            <span>提现总金额：</span>
            <b>{{ (withdrawal_total_amount.cny_total_amount || 0) | cutZero | moneyToFormat }}</b>
          </div>
          <div class="statistics">
            <span>销售总金额：</span>
            <b>{{ (sales_total_amount.cny_total_amount || 0) | cutZero | moneyToFormat }}</b>
          </div>
        </el-col>
        <el-col :span="12">
          <p>
            <svg-icon icon-class="radius-usdt" style="color: #269A77;width: 24px;height: 24px;" /> USDT：
          </p>
          <div class="statistics">
            <span>订单总金额：</span>
            <b>{{ (order_total_amount.usdt_total_amount || 0) | cutZero }}</b>
          </div>
          <div class="statistics">
            <span>提现总金额：</span>
            <b>{{ (withdrawal_total_amount.usdt_total_amount || 0) | cutZero }}</b>
          </div>
          <div class="statistics">
            <span>销售总金额：</span>
            <b>{{ (sales_total_amount.usdt_total_amount || 0) | cutZero }}</b>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-divider />

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
        label="订单信息"
        width="240"
        header-align="center"
      >
        <template slot-scope="{ row: { order_no,total_price, pay_price, deduct_num, num, specs, goods_order } }">
          <div v-if="order_no">
            <div>订单号: {{ order_no }}</div>
            <div>购买数量: {{ num }}</div>
            <div>订单总金额: {{ total_price | cutZero | moneyToFormat }}</div>
            <div>实际支付: {{ pay_price | cutZero | moneyToFormat }}</div>
            <div>产品名称: {{ goods_order ? goods_order.name : '-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="购买用户"
        header-align="center"
      >
        <template slot-scope="{ row: { user, certification } }">
          <div v-if="user">
            <div># {{ user.id }}</div>
            <div>昵称：{{ user.name }}</div>
            <div>账号：{{ user.tel ? user.tel : user.email }}</div>
            <div v-if="certification">实名：{{ certification ? certification.name :'-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="分佣信息"
        header-align="center"
      >
        <template slot-scope="{ row: { sub_commission } }">
          <div v-if="sub_commission">
            <div>title：{{ sub_commission.title }}</div>
            <div>
              资产类型：<svg-icon :icon-class="sub_commission.currency" /> {{ sub_commission.currency | paraphrase(currencyOptions) }}
            </div>
            <div>金额：{{ sub_commission.amount }}</div>
            <div>比例：{{ sub_commission.extend ? `${sub_commission.extend.sale_commission}%` : '-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="分佣用户"
        header-align="center"
      >
        <template slot-scope="{ row: { sub_commission } }">
          <div v-if="sub_commission">
            <div v-if="sub_commission.user">
              <div># {{ sub_commission.user.id }}</div>
              <div>昵称：{{ sub_commission.user.name }}</div>
              <div>账号：{{ sub_commission.user.tel ? sub_commission.user.tel : sub_commission.user.email }}</div>
              <div>实名：{{ sub_commission.certification ? sub_commission.certification.name :'-' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="120"
        align="center"
      >
        <template slot-scope="{ row: { status, close_reason } }">
          <div v-if="status === 5">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="close_reason"
            >
              <el-tag slot="reference" :type="tagTypeOptions[status]">
                {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" />
              </el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="tagTypeOptions[status]">
              {{ status | paraphrase(statusOptions) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>支付：{{ row.pay_time }}</div>
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="审核员"
        header-align="center"
      >
        <template slot-scope="{ row: { admin } }">
          <div v-if="admin">
            <div># {{ admin.id }}</div>
            <div>{{ admin.name }}</div>
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
import { dataList } from '@/api/report'
import { orderStatusOptions, currencyReportOptions } from '@/utils/explain'

export default {
  name: 'OrderList',
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
      statusOptions: orderStatusOptions,
      currencyOptions: currencyReportOptions,
      tagTypeOptions: [
        'warning',
        '',
        'success',
        'danger',
        'info'
      ],
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      order_total_amount: {
        cny_total_amount: 0,
        usdt_total_amount: 0
      },
      withdrawal_total_amount: {
        cny_total_amount: 0,
        usdt_total_amount: 0
      },
      sales_total_amount: {
        cny_total_amount: 0,
        usdt_total_amount: 0
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.items.data
          const { total } = response.data.items
          this.pages.total = total
          this.order_total_amount = response.data.order_total_amount
          this.sales_total_amount = response.data.sales_total_amount
          this.withdrawal_total_amount = response.data.withdrawal_total_amount
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