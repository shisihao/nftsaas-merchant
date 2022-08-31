<template>
  <el-dialog title="电费订单" :visible.sync="visible" @closed="onClose()">
    <el-table v-if="list.length === 0" v-loading="loading" />
    <el-table
      v-for="item in list"
      :key="JSON.stringify(item)"
      class="order-table"
      :data="[ item ]"
      :header-cell-style="headNone"
    >
      <el-table-column>
        <template slot="header">
          <span># {{ item.id }}</span>
          <span style="margin-left: 10px;">{{ item.created_at }}</span>
          <span style="margin-left: 10px;">订单号: {{ item.order_no }}</span>
        </template>
        <el-table-column
          width="160"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.node_order_no }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              数量：{{ row.num }}
            </div>
            <div>
              首单: {{ row.first ? '是' : '否' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="130"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              电费包天数：{{ row.days }}
            </div>
            <div>
              已使用天数：{{ row.days_used }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              总金额：￥{{ row.total_price }}
            </div>
            <div>
              实际支付：
              <template v-if="row.pay_type === 'usdt'">
                <b style="color: #3c3c3c;">{{
                  row.usdt_price > 0 ? Math.ceil(parseFloat(row.pay_price > 0 ? row.pay_price : row.total_price) / row.usdt_price) : 0
                }}</b>
              </template>
              <template v-else>
                <b style="color: #3c3c3c;">{{ row.pay_price > 0 ? row.pay_price : row.total_price }}</b>
              </template>
            </div>
            <div>
              支付方式：<svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          min-width="200"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              优惠卷抵扣金额：￥{{ row.coupon_amount }}
            </div>
            <div>
              电费包抵扣金额：￥{{ row.electric_amount }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="凭证"
        width="82"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            v-if="row.credential"
            style="width: 60px;min-height: 60px;"
            :src="row.credential ? domin + row.credential : ''"
            :preview-src-list="[row.credential ? domin + row.credential : '']"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="76"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :effect="row.status === 4 ? 'plain' : 'light'" :type="tagTypeOptions[row.status]">
            {{ row.status | paraphrase(statusOptions) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <template v-if="row.status === 1 && row.first !== 1">
            <el-button class="order-btn" type="success" @click="onSubOrder(row)">通过</el-button>
            <el-button class="order-btn" type="danger" @click="onCloseOrder(row)">关闭</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>

<script>
import { electricsList, subElectric, closeElectric } from '@/api/order'
import Pagination from '@/components/Pagination'
// import OrderCount from "@/views/orders/components/OrderCount"
import { DominKey, getToken } from '@/utils/auth'
import { payOptions, electricsStatusOptions } from '@/utils/explain'

export default {
  name: 'ScanList',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      statusOptions: electricsStatusOptions,
      payOptions,
      tagTypeOptions: [
        'warning',
        'primary',
        'success',
        'danger',
        'danger',
        'info'
      ],
      search: {
        id: 0
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: [],
      loading: false,
      visible: false
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.search.id = row.id
      this.getList()
    },
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      electricsList(this.search.id, { page, ...this.search, limit: this.pages.limit })
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
    onSubOrder(row) {
      const { id, order_no } = row
      this.$confirm(`确认订单 #${order_no}`, `确认订单`, {
        type: 'success'
      })
        .then(() => {
          subElectric(id)
            .then(() => {
              this.$message.success(`确认订单成功！`)
              this.getList()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    },
    onCloseOrder(row) {
      const { id, order_no } = row
      this.$prompt(`${order_no} 请输入关闭理由, 1-20字内`, '订单关闭', {
        inputType: 'textarea',
        inputPattern: /\S/,
        inputErrorMessage: '关闭订单理由不能为空！',
        type: 'warning'
      })
        .then(({ value }) => {
          this.$confirm(`确认关闭订单${order_no}？`, `确认关闭订单`, {
            cancelButtonClass: 'btn-custom-cancel'
          })
            .then(() => {
              closeElectric({ id: id, reason: value })
                .then(() => {
                  this.$message.success(`关闭订单成功！`)
                  this.getList()
                })
                .catch(() => {
                })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onClose() {
      this.list = []
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog {
  width: 1240px;
}
.order-table:first-child {
  margin-top: 0;
}
.order-table {
  margin-top: 20px;
}
</style>
