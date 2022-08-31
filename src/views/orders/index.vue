<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键字">
          <el-input v-model="search.keywords" style="width: 240px;" placeholder="用户ID/昵称/手机号/邮箱/订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="专区/期数">
          <el-cascader
            clearable
            :options="zoneOptions"
            :props="{ checkStrictly: true }"
            @change="onhandleChangeZone"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品属性">
          <el-select v-model="search.cate" clearable @change="getList(1)">
            <el-option v-for="item in catesOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select v-model="search.pay_type" clearable @change="getList(1)" @clear="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="状态">
          <el-select v-model="search.status" @change="getList(1)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="search.order_type" clearable @change="getList(1)">
            <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="市场业绩状态">
          <el-select v-model="search.market_status" clearable @change="getList(1)">
            <el-option label="全部" value="" />
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售奖励状态">
          <el-select v-model="search.sales_status" clearable @change="getList(1)">
            <el-option label="全部" value="" />
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
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
          <el-radio-group v-model="search.status" size="mini" @change="onChangeStatus">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 1 && wait_count > 0 ? wait_count : ''" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button v-if="false" type="primary" icon="el-icon-s-data" @click="onHandleCount">
          订单统计
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
        <el-button type="success" icon="el-icon-document-copy" @click="onHandleImport" plain>
          导入订单
        </el-button>
        <el-button type="warning" icon="el-icon-collection-tag" :disabled="checkedOrders.length === 0" @click="onFilLevel">
          批量设置期数
        </el-button>
      </el-form>
    </div>

    <el-table
      border
      :show-header="false"
      :cell-style="{background:'#DCDFE6'}"
      :data="[
        {
          orderInfo: '订单信息',
          voucher: '凭证',
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
          <el-checkbox v-model="checkedAll" :indeterminate="isIndeterminate" :disabled="orders.length === 0" @change="handleCheckAllChange" />
          <span style="display: inline-block;width: calc(100% - 14px);text-align: center;">
            {{ row.orderInfo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="voucher"
        label="凭证"
        width="82"
        align="center"
      />
      <el-table-column
        prop="handle"
        label="操作"
        width="102"
        fixed="right"
        align="center"
      />
    </el-table>

    <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据"></el-empty>

    <div v-else>
      <el-table
        v-for="(item, index) in list"
        :key="JSON.stringify({id: item.id, goods_order: item.goods_order})"
        class="order-table"
        :data="[ item ]"
        :cell-style="{background:'#fff'}"
        :header-cell-style="headNone"
      >
        <el-table-column>
          <template slot="header">
            <span># {{ item.id }}</span>
            <span style="margin-left: 10px;">订单号: {{ item ? item.order_no : '-' }}</span>
            <span style="margin-left: 10px;">下单时间：{{ item.created_at }}</span>
            <template v-if="item.goods_order.period">
              <span style="margin-left: 10px;">
                期数：
                <el-select v-if="[1,2,3,4].includes(item.status)" v-model="item.goods_order.period.id" size="mini" :disabled="levelOptions.length === 0" @change="onChangeLevel(item, index)">
                  <el-option v-for="items in levelOptions.filter(v => v.type === item.goods_order.zone )" :key="items.value" :label="items.label" :value="items.value" />
                </el-select>
                <span v-else>{{ item.goods_order.period.name }}</span>
              </span>
            </template>
            <span v-if="item.order_type" style="margin-left: 10px;">
              手动导入：{{ `${item.market_status ? '' : '不'}算业绩` }} {{ `${item.sales_status ? '' : '不'}算奖励` }}
            </span>
          </template>
          <el-table-column
            width="35"
          >
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.checked" :disabled="!([1,2,3,4].includes(row.status)) || row.disabled" @change="handleCheckedOrdersChange(row.goods_order.id, row)" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <el-image
                v-if="info.template_id !== 1"
                class="image-item"
                :src="row.goods_order ? domin + row.goods_order.image : ''"
                :preview-src-list="[row.goods_order ? domin + row.goods_order.image : '']"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div :style="info.template_id !== 1 ? 'margin-left: 70px;' : ''">
                <div style="line-height: 1.1;margin-bottom: 6px;min-height: 26px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;">
                  {{ row.goods_order.name }}
                </div>
                <div style="color: #9e9e9e;line-height: 1.1;text-transform:uppercase;">
                  专区：{{ row.goods_order.zone }}
                </div>
                <div v-if="false" style="color: #9e9e9e;line-height: 1.1">
                  类型：{{ row.goods_order.type | paraphrase(typeOptions) }}
                </div>
                <div style="color: #9e9e9e;line-height: 1.1">
                  算力值：{{ parseFloat(row.goods_order.spec) }}{{ row.goods_order.zone === 'eth' ? 'M' : 'T' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div>
                总金额：{{ parseFloat(row.total_price) }}
              </div>
              <div>
                实际支付：
                <template>
                  <b style="color: #3c3c3c;">
                    {{ parseFloat(row.pay_price) }}
                  </b>
                </template>
              </div>
              <div>
                支付方式：<svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
              </div>
              <div>
                税点：<span style="color: #F56C6C;">{{ row.tax | cutZero }}%</span>
              </div>
              <div>
                税费：<span style="color: #F56C6C;">{{ row.tax_fee | cutZero }}{{ row.pay_type === 'usdt' ? 'U' : '元' }}</span>
              </div>
              <div>
                购买数量：{{ row.num }}
              </div>
              <div>
                支付时间：{{ row.pay_time ? row.pay_time : '-' }}
              </div>
              <div>
                回本状态：{{ row.recovery ? '已回本' : '未回本' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="194"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <!--<div>
                电费包总天数：{{ row.electric_total_days }}
              </div>
              <div>
                电费包剩余天数：{{ row.electric_remnant_days }}
              </div>-->
              <div>
                工作总天数: {{ row.order_cate ? '永久' : row.dig_total_days }}
              </div>
              <div>
                工作剩余天数: {{ row.order_cate ? '永久' : row.dig_remnant_days }}
              </div>
              <div>
                开始工作：{{ row.dig_start_time ? row.dig_start_time : '-' }}
              </div>
              <div>
                结束工作：{{ row.dig_end_time ? row.dig_end_time : '-' }}
              </div>
              <div>
                总产出数量：{{ row.total_output }}
              </div>
              <div>
                昨日产出量：{{ row.yesterday_output }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div v-if="row.user">
                <el-avatar :key="row.user.id" icon="el-icon-user-solid" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
                <div style="display: inline-block;margin-left: 2px">
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
          <el-table-column
            header-align="center"
          >
            <template slot-scope="{ row }">
              <div v-if="row.pay_type === 'bank' && row.bank_info ">
                <div>
                  {{ row.bank_info.bank }}
                </div>
                <div>
                  {{ row.bank_info.account_number }}
                </div>
                <div>
                  {{ row.bank_info.account_name }}
                </div>
              </div>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="110"
            align="center"
          >
            <template slot-scope="{ row }">
              <div v-if="row.status === 5">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                  :content="row.reason ? row.reason : '-'"
                >
                  <el-tag slot="reference" :type="tagTypeOptions[row.status]">
                    {{ row.status | paraphrase(statusOptions) }} <i class="el-icon-info" />
                  </el-tag>
                </el-popover>
              </div>
              <div v-else>
                <el-tag :effect="row.status === 4 ? 'plain' : 'light'" :type="tagTypeOptions[row.status]">{{ row.status | paraphrase(statusOptions) }}</el-tag>
              </div>
              <div v-if="row.admin">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                >
                  <div>
                    <div>
                      # {{ row.admin.id }}
                    </div>
                    <div>
                      {{ row.admin.name }}
                    </div>
                  </div>
                  <div slot="reference">
                    审核人<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
              <div v-if="row.remark">
                <el-popover
                  placement="bottom-start"
                  max-width="300"
                  trigger="hover"
                >
                  <div>
                    {{ row.remark }}
                  </div>
                  <div slot="reference">
                    订单备注<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="82"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <el-image
                v-if="row.credential"
                style="width: 60px;"
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
        </el-table-column>
        <el-table-column
          width="102"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button v-if="[3, 4, 6].includes(row.status)" type="primary" @click="onGetEquipment(row)">设备详情</el-button>
            <el-button v-if="[3, 6].includes(row.status) && ['fil'].includes(row.goods_order.zone)" class="order-btn" type="primary" plain @click="onSetBorrow(row)">补发借贷</el-button>
            <el-button v-if="[1].includes(row.status)" class="order-btn" type="success" @click="onSubOrder(row)">通过</el-button>
            <el-button v-if="![5].includes(row.status)" class="order-btn" type="danger" :loading="row.closeLoading" @click="onCloseOrder(row)">关闭</el-button>
            <el-button v-if="[2].includes(row.status)" class="order-btn" type="danger" @click="onSetMining(row)">设置工作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <el-dialog title="批量设置期数" :visible.sync="filLevelVisible" @closed="onClose()">
      <el-form ref="filLevelForm" :model="filLevelForm" :rules="filLevelRules" label-width="80px">
        <el-form-item label="期数" prop="period_id">
          <el-select v-model="filLevelForm.period_id" placeholder="请选择">
            <el-option
              v-for="item in levelOptions.filter(v => v.type === checkedZone)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFilLevelFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="filLevelVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 查看电费订单 -->
    <scan-list
      v-if="scanVisible"
      ref="scanList"
    />

    <!-- 统计 -->
    <order-count
      v-if="countVisible"
      ref="orderCount"
    />

    <!-- 导入 -->
    <order-import
      v-if="importOrderVisible"
      ref="importOrder"
      @refreshList="getList()"
    />
    
    <equipment
      v-if="equipmentVisible"
      ref="equipment"
    />

    <!-- 借贷补发 -->
    <set-borrow
      v-if="borrowVisible"
      ref="borrow"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { dataList, exportOrder, subOrder, closeOrder, putFilLevel, putComplete, getOrdersCheck, setBorrow } from '@/api/order'
import { powerLevelList } from '@/api/fil-level'
import ScanList from './components/ScanList'
import OrderCount from './components/OrderCount'
import { zoneOptions, payOptions, pickerOptions, orderStatusOptions, catesOptions } from '@/utils/explain'
import OrderImport from './components/OrderImport'
import SetBorrow from './components/SetBorrow'
import Equipment from './components/Equipment'
import { mapGetters } from 'vuex'

export default {
  name: 'Orders',
  components: { Pagination, ScanList, OrderCount, OrderImport, Equipment, SetBorrow },
  data() {
    return {
      domin: getToken(DominKey),
      dateRangeValue: [],
      pickerOptions,
      catesOptions,
      zoneOptions,
      statusOptions: orderStatusOptions,
      payOptions,
      list: [],
      wait_count: 0,
      search: {
        keywords: '',
        status: '',
        pay_type: '',
        start_time: '',
        end_time: '',
        period_id: '',
        zone: '',
        cate: '',
        order_type: '',
        market_status: '',
        sales_status: ''
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
      tagTypeOptions: [
        'warning',
        'primary',
        'success',
        'danger',
        'danger',
        'info'
      ],
      typeOptions: [
        { label: '普通', value: 'common' },
        { label: '注册可领', value: 'register' },
        { label: '新手特供', value: 'novice' }
      ],
      orderTypeOptions: [
        { label: '全部', value: '' },
        { label: '自购', value: 0 },
        { label: '导入', value: 1 }
      ],
      checkedAll: false,
      checkedZone: '',
      checkedOrders: [],
      orders: [],
      isIndeterminate: false,
      downloadLoading: false,
      scanVisible: false,
      countVisible: false,
      importOrderVisible: false,
      borrowVisible: false,
      loading: false,
      filLevelVisible: false,
      equipmentVisible: false,
      btnLoading: false
    }
  },

  computed: {
    ...mapGetters([
      'info'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getFileLevelList()
        .then(() => {
          this.getList()
        })
        .catch(() => {})
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page

      this.clearChecked()
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.data.map(v => {
            return Object.assign(v, { checked: false, disabled: ![1, 2, 3, 4].includes(v.status), closeLoading: false, oldPeriodId: v.goods_order.period ? v.goods_order.period.id : 0 })
          })
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
          this.orders = response.data.data.data.filter(v => {
            return [1, 2, 3, 4].includes(v.status)
          }).map(x => {
            return x.goods_order.id
          })
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    async getFileLevelList() {
      await powerLevelList()
        .then(response => {
          this.levelOptions = response.data.map(v => {
            return {
              type: v.type,
              label: v.name,
              value: v.id,
              cate: v.cate
            }
          })
          this.zoneOptions.forEach((item, index) => {
            const level = []
            response.data.forEach(val => {
              if (item.value === val.type) {
                let title = val.name.substring(0, 16)
                if (val.name.length > 16) {
                  title = title + '...'
                }
                level.push({ label: title, value: val.id })
              }
            })
            if (level.length > 0) {
              this.$set(this.zoneOptions, index, Object.assign(item, { children: level }))
            }
          })
        })
        .catch(() => {
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
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onSubOrder(row) {
      const { id, order_no } = row
      this.$confirm(`确认订单 #${order_no}`, `确认订单`, {
        type: 'success'
      })
        .then(() => {
          subOrder(id)
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
      const { id } = row
      row.closeLoading = true
      this.$confirm(`<div>1.当订单尚未工作时（对应订单状态：待确认，部署中），关闭订单如果为USDT支付则会给用户退款USDT</div>
                    <div>2.当订单已经确认时（对应订单状态：部署中，工作中，欠电费），关闭订单不会扣用户支付金额，但是会扣除订单造成的市场业绩和奖励</div>`, '提示', {
        confirmButtonText: '继续关闭',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        getOrdersCheck(id)
          .then(response => {
            if (response.data.status) {
              this.onCloseOrderConfirm(row)
              return false
            }
            this.onCloseOrderConfirm(row, 1)
          })
          .catch(() => {})
          .finally(() => {
            row.closeLoading = false
          })
      })
      .catch(() => {
        row.closeLoading = false
      })
    },
    onCloseOrderConfirm(row, tips) {
      const { id, order_no, user } = row
      let text = `[#${id}] ${order_no} 请输入关闭理由, 1-20字内`
      if (tips === 1) {
        text = `该订单获得市场奖励扣除过程中，用户[${user.name} ｜ ${user.phone || user.email}]由于提现操作造成资产余额不够扣除市场奖励，继续操作` + text
      }
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
    onChangeLevel(row, index) {
      console.log(row.oldPeriodId)
      putFilLevel({ ids: [row.goods_order.id], pid: row.goods_order.period.id })
        .then(() => {
          this.$message.success('设置成功！')
        })
        .catch(() => {
          row.goods_order.period.id = row.oldPeriodId
        })
    },
    onFilLevel() {
      const selected = this.checkedOrders.map(v => {
        return this.list.find(x => {
          return v === x.goods_order.id
        }).goods_order.zone
      })
      const isEqual = selected.every((item, index, arr) => {
        return item === arr[0]
      })

      if (isEqual) {
        this.checkedZone = selected[0]
        this.filLevelVisible = true
      } else {
        this.$message.warning('请勾选相同专区的订单')
      }
    },
    onFilLevelFormSubmit() {
      if (this.checkedOrders.length <= 0) {
        this.$message.error('请勾选至少一个订单')
      }
      this.$refs['filLevelForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putFilLevel({ ids: this.checkedOrders, pid: this.filLevelForm.period_id })
            .then(() => {
              this.$message.success(`设置成功！`)
              this.filLevelVisible = false
              this.getList()
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$refs['filLevelForm'].resetFields()
    },
    clearChecked() {
      this.checkedAll = false
      this.isIndeterminate = false
      this.orders = []
      this.list = []
      this.checkedOrders = []
      this.checkedZone = ''
    },
    onSetMining(row) {
      const { id } = row
      this.$confirm(`确认设置订单 #${id} 为工作状态<div style="color: #f56c6c;">此操作不可逆，是否确认？</div>`, `设置工作`, {
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          putComplete(row.id)
            .then(() => {
              this.$message.success(`设置成功！`)
              this.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onGetElectrics(row) {
      this.scanVisible = true
      this.$nextTick(() => {
        this.$refs.scanList && this.$refs.scanList.init(row)
      })
    },
    onHandleCount(row) {
      this.countVisible = true
      this.$nextTick(() => {
        this.$refs.orderCount && this.$refs.orderCount.init(row)
      })
    },
    onHandleConfirm() {
      this.importOrderVisible = true
      this.$nextTick(() => {
        this.$refs.importOrder && this.$refs.importOrder.init()
      })
    },
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    },
    onHandleImport() {
      this.importOrderVisible = true
      this.$nextTick(() => {
        this.$refs.importOrder && this.$refs.importOrder.init()
      })
    },
    onGetEquipment(row) {
      this.equipmentVisible = true
      this.$nextTick(() => {
        this.$refs.equipment && this.$refs.equipment.init(row)
      })
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      this.checkedOrders = []
      this.list.forEach((v, index) => {
        if ([1, 2, 3, 4].includes(v.status) && v.disabled === false) {
          this.list[index].checked = val
        }
        if (val === false && [1, 2, 3, 4].includes(v.status)) {
          this.list[index].disabled = false
        }
        if (val && [1, 2, 3, 4].includes(v.status) && v.disabled === false) {
          this.checkedOrders.push(v.goods_order.id)
        }
      })
    },
    handleCheckedOrdersChange(id, row) {
      const orderIndex = this.checkedOrders.indexOf(id)
      if (orderIndex >= 0) {
        this.checkedOrders.splice(orderIndex, 1)
        if (this.checkedOrders.length === 0) {
          this.list.forEach((v, index) => {
            this.list[index].disabled = false
          })
        }
      } else {
        this.checkedOrders.push(id)
        // 判断专区，是否可选
        if (this.checkedOrders.length === 1) {
          this.list.forEach((v, index) => {
            if (v.goods_order.zone !== row.goods_order.zone) {
              this.list[index].disabled = true
            }
          })
        }
      }
      this.isIndeterminate = this.checkedOrders.length > 0 && this.checkedOrders.length < this.orders.length
      if (!this.isIndeterminate && this.checkedOrders.length === 0) {
        this.checkedAll = false
      } else {
        this.checkedAll = !this.isIndeterminate
      }
    },
    onChangeStatus(value) {
      this.getList(1)
    },
    onhandleChangeZone(val) {
      if (val[0]) {
        this.search.zone = val[0]
      } else {
        this.search.zone = ''
      }

      if (val[1]) {
        this.search.period_id = val[1]
      } else {
        this.search.period_id = ''
      }

      this.getList(1)
    },
    onSetBorrow(row) {
      this.borrowVisible = true
      this.$nextTick(() => {
        this.$refs.borrow && this.$refs.borrow.init(row)
      })
    }
  }
}
</script>
<style scoped>
.order-btn {
  margin-top: 10px;
}
::v-deep .image-item {
  width: 60px;
  height: 60px;
  float: left;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
::v-deep .image-item img {
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
::v-deep .item:first-child .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
}
::v-deep .item:last-child .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}
</style>
