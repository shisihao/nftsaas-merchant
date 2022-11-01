<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="手机号">
          <el-input
            v-model="search.phone"
            placeholder="手机号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input
            v-model="search.order_no"
            style="width: 220px"
            placeholder="订单号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select
            v-model="search.pay_type"
            clearable
            @change="getList(1)"
            @clear="getList(1)"
          >
            <el-option
              v-for="item in payOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select
            v-model="search.target_type"
            clearable
            @change="getList(1)"
          >
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="藏品编号">
          <el-input
            v-model="search.serial"
            style="width: 200px"
            placeholder="藏品编号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="交易HASH">
          <el-input
            v-model="search.hash"
            placeholder="交易HASH"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="下单时间">
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group
            v-model="search.status"
            size="mini"
            @change="onChangeStatus"
          >
            <el-badge
              v-for="item in orderStatusOptions"
              :key="item.value"
              :value="item.value === 0 && wait_count > 0 ? wait_count : item.value === 5 && exception_count > 0 ? exception_count : ''"
              class="item"
            >
              <el-radio-button :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-if="false"
          type="primary"
          icon="el-icon-s-data"
          @click="onHandleCount"
        >
          订单统计
        </el-button>
        <el-button
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="onHandleDownload"
        >
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-table
      border
      :show-header="false"
      :cell-style="{ background: '#DCDFE6' }"
      :data="[
        {
          orderInfo: '订单信息',
          status: '状态',
          handle: '操作'
        }
      ]"
    >
      <el-table-column
        prop="orderInfo"
        label="订单信息"
        min-width="878"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span
            style="
              display: inline-block;
              width: calc(100% - 14px);
              text-align: center;
            "
          >
            {{ row.orderInfo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="110" align="center" />
      <el-table-column
        prop="handle"
        label="操作"
        width="240"
        fixed="right"
        align="center"
      />
    </el-table>

    <el-empty
      v-if="list.length === 0"
      v-loading="loading"
      description="暂无数据"
    />

    <div v-else>
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
            <span>
              订单类型:
              <el-tag :type="item.target_type | paraphrase(orderTypeOptions, 'value', 'type')">{{ item.target_type | paraphrase(orderTypeOptions) }}</el-tag>
            </span>
            <el-divider direction="vertical" />
            <span>下单时间：{{ item.created_at }}</span>
            <el-divider direction="vertical" />
            <span>商户订单号：</span>
            <el-tooltip v-if="item.sub_nos && item.sub_nos.length > 0" placement="top" effect="light">
              <div slot="content">
                <div v-for="(item, index) in item.sub_nos" :key="index" style="margin-top:5px;">
                  <span>{{ index + 1 }}.</span>
                  <span style="margin-left: 5px;">{{ item.sub_no }}</span>
                  <el-tag effect="plain" :type="item.status | paraphrase(payStatusOptions, 'value', 'type')" style="margin-left: 5px;">{{ item.status | paraphrase(payStatusOptions) }}</el-tag>
                </div>
              </div>
              <el-tag effect="dark" type="warning">+{{ item.sub_nos.length }}</el-tag>
            </el-tooltip>
            <span v-else>-</span>
          </template>
          <el-table-column min-width="240" header-align="center">
            <template slot-scope="{ row }">
              <div class="info-wrapper">
                <el-image
                  class="image-item"
                  :src="
                    row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]
                  "
                  :preview-src-list="[
                    row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]
                  ]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div style="margin-left: 10px">
                  <div v-if="row.goods && row.goods.name">
                    名称：{{ row.goods.name || '' }}
                  </div>
                  <div>价格：¥ {{ row.cny_price || 0.0 }}</div>
                  <div v-if="integral_use">{{ integral }}：{{ row.integral_price || 0.0 }}</div>
                  <div>数量：x{{ row.num }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="160" header-align="center">
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
            </template>
          </el-table-column>
          <el-table-column width="180" header-align="center">
            <template slot-scope="{ row }">
              <div>支付价格：¥ {{ row.cny_price || 0.0 }}</div>
              <div v-if="integral_use">支付{{ integral }}：{{ row.integral_price || 0.0 }}</div>
              <div>
                支付方式：
                <span v-if="row.cny_price > 0">
                  <svg-icon :icon-class="row.pay_type | paraphrase(payOptions, 'value', 'value')" /> {{ row.pay_type | paraphrase(payOptions) }}
                </span>
                <span v-if="row.integral_price > 0 && integral_use">
                  <svg-icon icon-class="hd" /> {{ integral }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="180" header-align="center">
            <template slot-scope="{ row }">
              <div class="chain">
                <div class="chain-title">交易HASH：</div>
                <div>{{ row.hash || '-' }}</div>
              </div>
              <div class="chain">
                <div class="chain-title">合约地址：</div>
                <div>
                  {{ row.goods && row.goods.address ? row.goods.address : '-' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="110" align="center">
            <template slot-scope="{ row }">
              <div v-if="row.status === 5">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                  :content="row.reason ? row.reason : '-'"
                >
                  <el-tag
                    slot="reference"
                    :type="
                      row.status
                        | paraphrase(orderStatusOptions, 'value', 'type')
                    "
                  >
                    {{ row.status | paraphrase(orderStatusOptions) }}
                    <i class="el-icon-info" />
                  </el-tag>
                </el-popover>
              </div>
              <div v-else>
                <el-tag
                  :effect="row.status === 4 ? 'plain' : 'light'"
                  :type="
                    row.status | paraphrase(orderStatusOptions, 'value', 'type')
                  "
                >{{ row.status | paraphrase(orderStatusOptions) }}</el-tag>
              </div>
              <div v-if="row.admin">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                >
                  <div>
                    <div># {{ row.admin.id }}</div>
                    <div>
                      {{ row.admin.name }}
                    </div>
                  </div>
                  <div slot="reference">
                    审核人<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
              <div v-if="row.status === 3">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                >
                  <div>
                    {{ row.reason || '' }}
                  </div>
                  <div slot="reference">
                    关闭原因<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
              <div v-if="[2].includes(row.status)">
                <el-popover
                  v-if="![0].includes(row.trade_status)"
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                >
                  <div>
                    <template v-if="integral_use">
                      {{
                        [1].includes(row.trade_status)
                          ? `${integral}链上交易失败`
                          : [2].includes(row.trade_status)
                            ? '藏品链上交易失败'
                            : `${integral}、藏品链上交易失败`
                      }}
                    </template>
                    <template v-else>
                      {{
                        [1].includes(row.trade_status)
                          ? `链上交易失败`
                          : [2].includes(row.trade_status)
                            ? '藏品链上交易失败'
                            : `藏品链上交易失败`
                      }}
                    </template>

                  </div>
                  <div slot="reference">
                    异常原因<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="240" fixed="right" align="center">
          <template slot-scope="{ row }">
            <div>
              <el-button-group>
                <el-button type="primary" @click="onDetail(row)">订单详情</el-button>
                <el-button
                  v-if="[1].includes(row.status) && row.isClose"
                  type="primary"
                  plain
                  @click="onIssued(row)"
                >发放</el-button>
                <el-button
                  v-if="![2, 3].includes(row.status) && row.isClose"
                  class="order-btn"
                  type="danger"
                  :loading="row.closeLoading"
                  @click="onCloseOrder(row)"
                >关闭</el-button>
              </el-button-group>
            </div>
            <div
              v-if="![0].includes(row.trade_status) && [2].includes(row.status)"
              style="margin-top: 6px"
            >
              <el-button-group>

                <el-button
                  v-if="[2, 3].includes(row.trade_status)"
                  plain
                  type="primary"
                  @click="onSafe(row)"
                >藏品交易</el-button>
                <el-button
                  v-if="[2, 3].includes(row.trade_status)"
                  plain
                  type="primary"
                  @click="onRefund(row)"
                >退款</el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <on-detail v-if="onDetailVisible" ref="onDetail" @refreshList="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OnDetail from './components/onDetail'
import { getToken, DominKey } from '@/utils/auth'
import {
  dataList,
  exportOrder,
  closeOrder,
  getOrdersRefund,
  getOrdersSafe,
  getOrdersIssued
} from '@/api/order'
import { orderTypeOptions, payOptions, pickerOptions, orderStatusOptions, payStatusOptions } from '@/utils/explain'
import { mapGetters } from 'vuex'

export default {
  name: 'Orders',
  components: { Pagination, OnDetail },
  data() {
    return {
      domin: getToken(DominKey),
      dateRangeValue: [],
      pickerOptions,
      payOptions,
      orderStatusOptions,
      payStatusOptions,
      list: [],
      wait_count: 0,
      exception_count: 0,
      search: {
        phone: '',
        order_no: '',
        serial: '',
        status: '',
        pay_type: '',
        start_time: '',
        end_time: '',
        period_id: '',
        hash: '',
        cate: '',
        target_type: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      levelOptions: [],
      filLevelForm: {
        period_id: ''
      },
      filLevelRules: {
        period_id: [{ required: true, message: '请选择期数', trigger: 'blur' }]
      },
      balance: 0,
      orderTypeOptions,
      // checkedAll: false,
      onDetailVisible: false,
      checkedZone: '',
      checkedOrders: [],
      orders: [],
      isIndeterminate: false,
      downloadLoading: false,
      countVisible: false,
      loading: false,
      btnLoading: false
    }
  },

  computed: {
    ...mapGetters(['info', 'integral', 'integral_use'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      this.list = []
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          if (response.code !== 0) return
          this.list = response.data.data.data.map((v) => {
            return Object.assign(v, {
              isClose: +new Date() > +new Date(v.created_at) + 1800 * 1000
            })
          })
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
          this.exception_count = response.data.exception_count
        })
        .catch(() => {})
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
        .then((response) => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {})
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onIssued(row) {
      this.$confirm(`确定对订单[(#${row.id})]进行[发放]操作?`, '待发放', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          getOrdersIssued(row.id)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList(1)
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onRefund(row) {
      this.$confirm(`确定对订单[(#${row.id})]进行[退款]操作?`, '退款', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          getOrdersRefund(row.id)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList(1)
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onSafe(row) {
      this.$confirm(
        `确定对订单[(#${row.id})][藏品交易异常]进行操作?`,
        '藏品交易异常',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          getOrdersSafe(row.id)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList(1)
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onChangeStatus(value) {
      this.getList(1)
    },
    onDetail(data) {
      this.onDetailVisible = true
      this.$nextTick(() => {
        this.$refs.onDetail && this.$refs.onDetail.init(data)
      })
    },
    onCloseOrder(row) {
      const { id, order_no } = row
      const text = `[#${id}] ${order_no} 请输入关闭理由, 1-20字内`
      this.$prompt(text, '订单关闭', {
        inputType: 'textarea',
        inputPattern: /\S/,
        inputErrorMessage: '关闭订单理由不能为空！',
        type: 'warning'
      })
        .then(({ value }) => {
          closeOrder({ id: id, reason: value })
            .then(() => {
              this.$message.success(`关闭订单成功！`)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {})
        })
        .catch(() => {
          row.closeLoading = false
        })
    },
    onClose() {
      this.$refs['filLevelForm'].resetFields()
    },

    onHandleCount(row) {
      this.countVisible = true
      this.$nextTick(() => {
        this.$refs.orderCount && this.$refs.orderCount.init(row)
      })
    },

    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

.chain {
  display: flex;
  .chain-title {
    flex-shrink: 0;
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
</style>
