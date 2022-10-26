<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
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
            size="small"
            @change="onChangeStatus"
          >
            <el-badge
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value === 1 && wait_count > 0 ? wait_count : ''"
              class="item"
            >
              <el-radio-button :label="item.value">{{
                item.label
              }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t("table.search") }}
        </el-button>
        <el-button
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="onHandleDownload"
        >
          {{ $t("table.export") }} Excel
        </el-button>
      </el-form>
    </div>

    <div v-loading="loading">
      <el-table v-loading="loading" border :data="list">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="order_no" label="订单号" align="center" />
        <el-table-column header-align="center" label="续费方式">
          <template slot-scope="{ row }">
            <div>
              支付方式: {{ row.pay_type == "bank" ? "银行卡" : row.pay_type }}
            </div>
            <div>
              <div v-if="row.coupon">
                应付金额：{{ row.pay_price + row.coupon.amount }}
              </div>
              <div v-else>应付金额：{{ row.pay_price }}</div>
              <div>实付金额：{{ row.pay_price }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="优惠券" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.coupon">
              {{ row.coupon.amount }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="续费类型" align="center">
          <template slot-scope="{ row }">
            {{ row.order_type === 0 ? "自购" : "导入" }}
          </template>
        </el-table-column>

        <el-table-column prop="days" label="延续天数" align="center" />
        <el-table-column width="120" label="凭证" align="center">
          <template slot-scope="{ row }">
            <el-image
              v-if="row.credential"
              style="width: 60px"
              trigger="hover"
              :src="row.credential ? domin + row.credential : ''"
              :preview-src-list="[row.credential ? domin + row.credential : '']"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column width="160" label="状态" align="center">
          <template slot-scope="{ row }">
            <template>
              <span v-if="row.status == 1">
                <span style="color: #ffba00">
                  {{ row.status | paraphrase(powerTypeOptions) }}
                </span>
              </span>
              <span v-else-if="row.status == 2">
                <span style="color: #13ce66">
                  {{ row.status | paraphrase(powerTypeOptions) }}
                </span>
              </span>
              <span v-else>
                <span style="color: red">
                  {{ row.status | paraphrase(powerTypeOptions) }}
                </span>
              </span>

              <el-popover
                v-if="row.status == 3"
                placement="bottom-start"
                max-width="300"
                trigger="hover"
              >
                <div>
                  <div>
                    {{ row.reason }}
                  </div>
                </div>
                <div slot="reference">
                  驳回原因<i class="el-icon-question" />
                </div>
              </el-popover>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="续费时间" align="center" />
      </el-table>
    </div>
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
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { serverOrder, serverOrderExport } from '@/api/tenant'
import {
  payOptions,
  pickerOptions,
  logOrderStatusOptions
} from '@/utils/explain'
export default {
  name: 'ServerRenewal',
  components: { Pagination },
  data() {
    return {
      // 0-待支付/1-已支付(待审核)/2-审核通过/3-驳回/4-取消
      powerTypeOptions: [
        { label: '待支付', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已确认', value: 2 },
        { label: '已驳回', value: 3 },
        { label: '取消', value: 4 }
      ],
      domin: getToken(DominKey),
      dateRangeValue: [],
      pickerOptions,
      list: [],
      wait_count: 0,
      search: {
        status: -1,
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: logOrderStatusOptions,
      tagTypeOptions: [
        'warning',
        'primary',
        'success',
        'danger',
        'danger',
        'info'
      ],
      payOptions,
      downloadLoading: false,
      loading: false,
      btnLoading: false
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
      if (page === 1) this.pages.current = page

      serverOrder({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          if (response.code !== 0) return
          this.list = response.data.data.map((v) => {
            return Object.assign(v)
          })
          this.pages.total = response.data.list.total
          this.wait_count = response.data.list.wait_count
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
      serverOrderExport(this.search)
        .then((response) => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {})
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onChangeStatus(value) {
      this.getList(1)
    }
  }
}
</script>
<style scoped>
.order-btn {
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
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
