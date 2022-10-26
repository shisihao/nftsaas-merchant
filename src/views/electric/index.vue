<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <!-- <el-form-item label="订单号">
          <el-input v-model="search.order_no" placeholder="订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item> -->
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" placeholder="昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="search.pay_type" clearable @change="getList(1)" @clear="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="search.order_type" clearable @change="getList(1)" @clear="getList(1)">
            <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
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
        <el-form-item label="订单状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 1 && wait_count > 0 ? wait_count : ''" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

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
          <span style="margin-left: 10px;">订单号: {{ item.order_no }}</span>
          <span style="margin-left: 10px;">下单时间：{{ item.created_at }}</span>
        </template>
        <el-table-column
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.user">
              <el-avatar :key="row.user.id" icon="el-icon-user-solid" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
              <div style="display: inline-block;margin-left: 2px">
                <div>
                  # {{ row.user.id }}
                </div>
                <div>
                  {{ row.user.name }}
                </div>
                <div>
                  {{ row.user.phone }}
                </div>
              </div>
            </div>
            <div v-else>
              用户已删除
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              充值金额：{{ row.amount }}
            </div>
            <div>
              <b style="color: #3c3c3c;">支付金额：{{ row.pay_price }}</b>
            </div>
            <div>
              支付方式：<svg-icon :icon-class="row.pay_type" />{{ row.pay_type | paraphrase(payOptions) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.pay_type === 'bank' && row.bank_info ">
              <div>
                {{ row.bank_info.bank.bank }}
              </div>
              <div>
                {{ row.bank_info.bank.account_number }}
              </div>
              <div>
                {{ row.bank_info.bank.account_name }}
              </div>
            </div>
            <div v-else>
              -
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
        <el-table-column
          width="76"
          align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.status === 3">
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
              <el-tag :type="tagTypeOptions[row.status]">
                {{ row.status | paraphrase(statusOptions) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          width="120"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.admin">
              <div>
                # {{ row.admin.id }}
              </div>
              <div>
                {{ row.admin.name }}
              </div>
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="[1].includes(row.status)">
            <el-button type="success" @click="onPassOrReject(row,2)">通过</el-button>
            <el-button type="danger" @click="onPassOrReject(row,3)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, statusReject, exportOrder } from '@/api/electric'
import { getToken, DominKey } from '@/utils/auth'
import { payOptions, orderTypeOptions, pickerOptions } from '@/utils/explain'

export default {
  name: 'Certification',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      downloadLoading: false,
      list: [],
      wait_count: 0,
      dateRangeValue: [],
      search: {
        order_no: '',
        pay_type: '',
        keywords: '',
        order_type: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '待支付', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已确认', value: 2 },
        { label: '已驳回', value: 3 },
        { label: '已取消', value: 4 }
      ],
      payOptions,
      orderTypeOptions,
      pickerOptions,
      tagTypeOptions: [
        'warning',
        '',
        'success',
        'danger',
        'info'
      ],
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
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
      this.list = []

      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, user: { name }}, type) {
      const title = type === 2 ? '通过' : '驳回'
      const confirmType = type === 2 ? this.$confirm : this.$prompt

      confirmType(`用户「${name}」的订单`, `订单${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 2 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api =
            type === 2
              ? statusPass(id)
              : statusReject({ id: id, reason: value })
          api
            .then(() => {
              this.$message.success(`${type === 2 ? '已通过' : '已驳回'}`)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
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
          location.href = this.domin + response.data.filename
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
<style lang="scss" scoped>
::v-deep .el-table th {
  user-select: auto;
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
.order-table {
  margin-top: 20px;
}
.order-table:first-child {
  margin-top: 0;
}

::v-deep .el-radio-group .item {
  .el-badge__content {
    transform: translateY(-50%) translateX(50%);
    z-index: 1;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
    border-left: 0;
  }
  &:first-child .el-radio-button:first-child .el-radio-button__inner {
    border-left: 1px solid #DCDFE6;
    border-radius: 4px 0 0 4px;
  }
  &:last-child .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0 4px 4px 0;
  }
}
</style>
