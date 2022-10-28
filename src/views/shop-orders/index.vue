<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="订单号">
          <el-input
            v-model="search.order_no"
            placeholder="请输入订单号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="search.goods_name"
            placeholder="请输入商品名称"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="search.account"
            placeholder="请输入账号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="search.supplier"
            placeholder="请输入供应商"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group
            v-model="search.status"
            size="small"
            @change="onChangeStatus"
          >
            <el-badge
              v-for="item in shopStatusOptions"
              :key="item.value"
              :value="[0,1].includes(item.value) && statusCount[item.count] > 0 ? statusCount[item.count] : ''"
              class="item"
            >
              <el-radio-button :label="item.value">{{
                item.label
              }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="onHandleDownload"
        >
          导出 Excel
        </el-button>
        <el-button type="primary" icon="el-icon-truck" @click="onbatchDeliver">批量发货</el-button>
      </el-form>
    </div>
    <el-table
      border
      :show-header="false"
      :cell-style="{ background: '#DCDFE6' }"
      :data="[
        {
          shopInfo: '订单信息',
          handle: '操作'
        }
      ]"
    >
      <el-table-column prop="shopInfo" label="订单信息" min-width="1100" />
      <el-table-column
        prop="handle"
        label="操作"
        width="180"
        fixed="right"
        align="center"
      />
    </el-table>
    <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
    <el-table
      v-for="item in list"
      :key="JSON.stringify({ id: item.id })"
      class="order-table"
      :data="[item]"
      :cell-style="{ background: '#fff' }"
      :header-cell-style="headNone"
    >
      <el-table-column>
        <template slot="header">
          <span># {{ item.id }}</span>
          <el-divider direction="vertical" />
          <span>订单号: {{ item ? item.order_no : '-' }}</span>
          <el-divider direction="vertical" />
          <span>下单时间：{{ item.created_at }}</span>
          <el-divider direction="vertical" />
          <span>
            订单状态：
            <el-link
              style="vertical-align: baseline;"
              :underline="false"
              :type="item.refund_status?item.refund_status===1?'warning':'danger':$options.filters.paraphrase(item.status,shopStatusOptions,'value','type')"
            >
              {{ item.refund_status?item.refund_status===1?'售后中':'已退货':$options.filters.paraphrase(item.status,shopStatusOptions) }}
            </el-link>
          </span>
        </template>
        <el-table-column width="300" header-align="center">
          <template slot-scope="{ row }">
            <div class="info-wrapper">
              <el-image
                class="image-item"
                :src="`${domin}${row.goods_order.sku&&row.goods_order.sku.image? row.goods_order.sku.image : row.goods_order.goods_image}`"
                :preview-src-list="[`${domin}${row.goods_order.sku&&row.goods_order.sku.image? row.goods_order.sku.image : row.goods_order.goods_image}`]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div style="margin-left: 10px">
                <div class="goods-name">
                  名称：{{ row.goods_order.goods_name }}
                </div>
                <div class="goods-properties">
                  规格：{{ row.goods_order.sku ? row.goods_order.sku.properties.join('/') : '无规格' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="170" header-align="center">
          <template slot-scope="{ row }">
            <div v-if="row.user">
              <el-avatar
                :key="row.user.id"
                icon="el-icon-user-solid"
                :src="row.user.avatar ? domin + row.user.avatar : ''"
              />
              <div style="display: inline-block; margin-left: 2px">
                <div>
                  # {{ row.user.id }}
                  <el-divider direction="vertical" />
                  {{ row.user.name }}
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
        <el-table-column min-width="170">
          <template slot-scope="{ row }">
            <div>
              价格：¥{{ row.cny_price || 0 | moneyToFormat }}
            </div>
            <div>
              {{ integral }}：{{ row.integral_price || 0 }}
            </div>
            <div>购买量：{{ row.num }}</div>
            <div>
              <span v-if="row.pay_type === 'free'">
                订单类型：<svg-icon icon-class="free" />
                {{ 1 | paraphrase(typeOptions) }}
              </span>
              <span v-else>
                支付方式：<svg-icon :icon-class="row.pay_type | paraphrase(payOptions, 'value', 'value')" />{{ row.pay_type | paraphrase(payOptions) }}</span>
            </div>
            <div>运费：¥{{ row.postage_price }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="170">
          <template slot-scope="{row}">
            <div>收货人：{{ row.consignee ? row.consignee.name : "---" }}</div>
            <div>手机号：{{ row.consignee ? row.consignee.phone : "---" }}</div>
            <div class="address">地址：{{ row.consignee ? (row.consignee.region_id?row.consignee.region.merger_name.split(',').join('')+row.consignee.address: row.consignee.province + row.consignee.city + row.consignee.area+row.consignee.address) : "---" }}</div>
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div v-if="row.logistic">
                <div>物流公司：{{ row.logistic.logistics_name }}</div>
                <div>快递单号：{{ row.logistic.logistics_no }}</div>
              </div>
              <div v-if="[2,3,4,5].includes(row.status) && row.logistic" slot="reference">
                物流<i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template slot-scope="{ row }">
            <div>付款时间：{{ row.pay_time || '---' }}</div>
            <div>
              发货时间：{{ row.logistic ? row.logistic.delivery_time : '---' }}
            </div>
            <div>
              收货时间：{{ row.logistic ? row.logistic.receipt_time : '---' }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" width="180" fixed="right">
        <template slot-scope="{ row }">
          <el-button v-show="row.status === 0" type="warning" @click="handleColseOrder(row.id)">关闭订单</el-button>
          <el-button v-show="row.refund_status===1" type="warning" @click="handleGoRefund(row.order_no)">去售后</el-button>
          <el-button v-show="row.refund_status===0&&row.status === 1" type="primary" @click="handleDelivery(row)">去发货</el-button>
          <el-button v-show="row.refund_status===0&&[2, 3, 4].includes(row.status)" type="primary" plain @click="onLogistics(row)">查看物流</el-button>
          <el-popover
            placement="bottom-start"
            max-width="300"
            trigger="hover"
          >
            <div>
              {{ row.reason || '' }}
            </div>
            <div v-if="row.status === 5" slot="reference">
              关闭原因<i class="el-icon-question" />
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
    <!-- 物流弹窗 -->
    <delivery-dialog
      v-if="deliveryDialogVisible"
      ref="deliveryDialog"
      @refreshList="getList()"
    />
    <!-- 批量导出弹框 -->
    <batch-deliver
      v-if="batchDeliverVisible"
      ref="batchDeliver"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  pickerOptions,
  payOptions,
  payTypeOptions,
  typeOptions,
  shopStatusOptions
} from '@/utils/explain'
import { dataList, closeDelivery, exportExcel } from '@/api/shop-management'
import { getToken, DominKey } from '@/utils/auth'
import DeliveryDialog from './component/DeliveryDialog'
import Pagination from '@/components/Pagination'
import batchDeliver from './component/batchDeliver'
export default {
  name: 'EntityOrders',
  components: { DeliveryDialog, Pagination, batchDeliver },
  data() {
    return {
      domin: getToken(DominKey),
      search: {
        status: '',
        order_no: '',
        start_time: '',
        end_time: '',
        supplier: '',
        account: '',
        goods_name: ''
      },
      statusCount: {
        wait_count: 0,
        paid_count: 0,
        delivery_count: 0,
        receipt_count: 0,
        success_count: 0,
        close_count: 0
      },
      dateRangeValue: [],
      pickerOptions,
      payOptions: payOptions.concat(payTypeOptions),
      shopStatusOptions,
      typeOptions,
      loading: false,
      list: [],
      deliveryDialogVisible: false,
      downloadLoading: false,
      batchDeliverVisible: false,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      this.list = []
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          Object.keys(this.statusCount).forEach((v) => {
            this.statusCount[v] = response.data[v] || 0
          })
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
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    },
    handleDelivery(row) {
      this.deliveryDialogVisible = true
      this.$nextTick(() => {
        this.$refs.deliveryDialog && this.$refs.deliveryDialog.init(row)
      })
    },
    onLogistics(row) {
      if (!row.logistic) {
        return this.$message.warning('无法查询')
      }
      if (row.logistic.logistics_code && row.logistic.logistics_no) {
        window.open(`http://www.kuaidi.com/all/${row.logistic.logistics_code}/${row.logistic.logistics_no}.html`, '_blank')
      }
    },
    handleColseOrder(id) {
      this.$prompt('请输入关闭订单原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\s]*.+$/,
        closeOnClickModal: false,
        inputErrorMessage: '内容不可为空！',
        inputValidator: (value) => { // 点击按钮时，对文本框里面的值进行验证
          if (value.length > 60) {
            return '输入不能超过60字符'
          }
        }
      })
        .then(async({ value }) => {
          const data = await closeDelivery({ id, reason: value })
          this.$message.success(data.msg)
          this.getList()
        })
        .catch(() => {})
    },
    onChangeStatus() {
      this.getList(1)
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportExcel(this.search)
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch((_) => {})
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onbatchDeliver() {
      this.batchDeliverVisible = true
      this.$nextTick(() => {
        this.$refs.batchDeliver && this.$refs.batchDeliver.init()
      })
    },
    // 跳转售后页面
    handleGoRefund(id) {
      this.$router.push({ name: 'orderRefund', params: { id }})
    }
  }
}
</script>

<style lang='scss' scoped>
.info-wrapper {
  display: flex;
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
    ::v-deep .image-slot {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
}
::v-deep .el-table th {
  user-select: auto;
}
.order-table {
  margin-top: 20px;
}
.order-table .el-button + .el-button {
  margin-left: 0;
}
::v-deep .grid-content {
  color: #606266;
  font-size: 14px;
}
::v-deep .item .el-badge__content {
  transform: translateY(-50%) translateX(50%);
  z-index: 1;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
  border-left: 0;
}
::v-deep
  .item:first-child
  .el-radio-button:first-child
  .el-radio-button__inner {
  border-left: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
}
::v-deep .item:last-child .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}
::v-deep .item {
  .el-badge__content {
    transform: translateY(-50%) translateX(50%);
    z-index: 1;
  }
  &:first-child .el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
  }
  &:last-child .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0 4px 4px 0;
  }
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
  border-left: 0;
}
.goods-name{
    width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>
