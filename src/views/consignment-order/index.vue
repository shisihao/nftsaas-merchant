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
            placeholder="订单号"
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
        <el-form-item label="藏品名称">
          <el-input
            v-model="search.keywords"
            placeholder="藏品名称"
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
            @change="getList(1)"
          >
            <el-badge
              v-for="item in orderStatusOptions"
              :key="item.value"
              :value="item.value === 0 && wait_count > 0 ? wait_count : ''"
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
          status: '状态'
        }
      ]"
    >
      <el-table-column
        prop="orderInfo"
        label="订单信息"
        min-width="878"
        align="center"
      />
      <el-table-column prop="status" label="状态" width="120" align="center" />
    </el-table>

    <el-empty
      v-if="list.length === 0"
      v-loading="loading"
      description="暂无数据"
    />

    <template v-else>
      <el-table
        v-for="item in list"
        :key="item.id "
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
            <span>下单时间：{{ item.created_at || '' }}</span>
            <el-divider direction="vertical" />
            <span>所属市场：{{ item.issuer_id?item.issuer.name+'专区':'寄售市场' }}</span>
          </template>
          <el-table-column min-width="240" header-align="center">
            <template slot-scope="{ row }">
              <div class="info-wrapper">
                <el-image
                  class="image-item"
                  :src="row.goods && row.goods.images.length > 0 &&row.issuer_id?row.goods.images[0]: domin + row.goods.images[0]"
                  :preview-src-list="[row.goods && row.goods.images.length > 0 && row.issuer_id?row.goods.images[0]:domin + row.goods.images[0]]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div style="margin-left: 10px">
                  <div v-if="row.goods && row.goods.name">
                    名称：{{ row.goods.name || '' }}
                  </div>
                  <div>
                    藏品编号：
                    <template v-if="row.consignment.type === 'goods'">
                      {{ row.goods.serial + '/' + row.consignment.user_goods.num + '/' + row.goods.cast_goods_stock }}
                    </template>
                  </div>
                  <div>价格：￥{{ row.consignment.price || '' }}</div>
                  <div>编号：{{ row.consignment.user_goods.num || '' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="200" header-align="center">
            <template slot-scope="{ row }">
              <ul class="user-info">
                <li>
                  <div>卖方：</div>
                  <div v-if="row.consignment && row.consignment.user" style="display: flex;align-items: center;">
                    <el-avatar
                      icon="el-icon-user-solid"
                      style="flex-shrink: 0;"
                      :src="row.consignment.user.avatar ? domin + row.consignment.user.avatar : ''"
                    />
                    <div style="margin-left: 2px">
                      <div>
                        # {{ row.consignment.user.id }}
                        <el-divider direction="vertical" />
                        {{ row.consignment.user.name }}
                      </div>
                      <div>
                        {{ row.consignment.user.phone }}
                      </div>
                      <div v-if="row.consignment.user.partner_id">
                        服务商：{{ row.consignment.user.partner.name }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    用户已删除
                  </div>
                </li>
              </ul>
              <el-divider />
              <ul class="user-info">
                <li>
                  <div>买方：</div>
                  <div v-if="row.user" style="display: flex;align-items: center;">
                    <el-avatar
                      :key="row.user.id"
                      icon="el-icon-user-solid"
                      style="flex-shrink: 0;"
                      :src="row.user.avatar ? domin + row.user.avatar : ''"
                    />
                    <div style="margin-left: 2px">
                      <div>
                        # {{ row.user.id }}
                        <el-divider direction="vertical" />
                        {{ row.user.name }}
                      </div>
                      <div>
                        {{ row.user.phone || '' }}
                      </div>
                      <div v-if="row.user.partner_id">
                        服务商：{{ row.user.partner.name }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    用户已删除
                  </div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column width="180" header-align="center">
            <template slot-scope="{ row }">
              <div>支付价格：¥ {{ row.cny_price || 0.0 }}</div>
              <div>
                支付方式：
                <span v-if="row.cny_price > 0">
                  <svg-icon :icon-class="row.pay_type | paraphrase(payOptions, 'value', 'value')" /> {{ row.pay_type | paraphrase(payOptions) }}
                </span>
              </div>
              <div>手续费：¥ {{ row.consignment.extend?row.consignment.extend.charge_fee:row.reward_price }}</div>
              <div>
                实际手续费：￥
                <span v-if="row.consignment.extend">
                  {{ (row.consignment.extend.charge_fee - (row.consignment.extend.voucher_fee||row.consignment.extend.discount_fee ||0)) ||0 |moneyToFormat }}
                </span>
                <span v-else>{{ row.consignment.extend?row.consignment.extend.charge_fee:row.reward_price }}</span>
              </div>
              <div v-if="row.partner_price">{{ row.user.partner.name }}服务商：¥ {{ row.partner_price }}</div>
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
                  {{ row.consignment.goods && row.consignment.goods.address ? row.consignment.goods.address : '-' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="row.status | paraphrase(orderStatusOptions, 'value', 'type')">
                {{ row.status | paraphrase(orderStatusOptions) }}
              </el-tag>
              <div v-if="row.admin">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
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
              <div v-if="row.status === 2">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
                  <div>
                    {{ row.reason || '' }}
                  </div>
                  <div slot="reference">
                    关闭原因<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </template>

    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
  </div>
</template>

<script>
import { dataList, exportOrder, filterPartner, filterIssuer } from '@/api/consignmentOrder'
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, payOptions } from '@/utils/explain'

export default {
  name: 'ConsignmentOrder',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      dateRangeValue: [],
      issuerList: [
        { label: '寄售市场', value: 0 }
      ],
      partnerList: [],
      search: {
        phone: '',
        order_no: '',
        keywords: '',
        serial: '',
        hash: '',
        status: '',
        issuer_id: '',
        start_time: '',
        end_time: ''
      },
      list: [],
      payOptions,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      orderStatusOptions: [
        { label: '全部', value: '' },
        { label: '待支付', value: 0, type: '' },
        { label: '已完成', value: 1, type: 'success' },
        { label: '已关闭', value: 2, type: 'info' }
      ],
      loading: false,
      downloadLoading: false,
      pickerOptions,
      wait_count: 0
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
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
        })
        .finally(() => {
          this.loading = false
        })
    },
    getIssuerList() {
      filterIssuer().then(response => {
        response.data.forEach(v => {
          this.issuerList.push({
            value: v.id,
            label: v.name + '专区'
          })
        })
      })
    },
    getPartnerList() {
      filterPartner().then(response => {
        this.partnerList = response.data.map(v => {
          return {
            value: v.id,
            label: v.name
          }
        })
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
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    }
  }
}
</script>

<style  scoped lang="scss">
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
.user-info {
  padding: 0;
  line-height: 1.3;
  margin: 6px auto;
  +.el-divider {
    margin: 0 auto;
  }
  li {
    display: flex;
    align-items: center;
    div {
      line-height: 1.3;
    }
    div:nth-child(1) {
      flex-shrink: 0;
    }
  }
}
.order-table {
  margin-top: 20px;
}
.chain {
  display: flex;
  .chain-title {
    flex-shrink: 0;
  }
}
</style>
