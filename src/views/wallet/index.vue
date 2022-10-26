<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="search.currency" clearable @change="getList(1)">
            <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

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
        label="账号"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.user.id }}
                <el-divider direction="vertical" />
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
              <div />
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        header-align="center"
      />
      <el-table-column
        label="充值数量"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.currency" /> {{ row.amount | cutZero }}
        </template>
      </el-table-column>
      <el-table-column
        label="交易HASH"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.extend.transHash" placement="bottom-start">
            <div class="ellipsis">
              <el-link class="ellipsis" type="primary" :underline="false">{{ row.extend.transHash }}</el-link>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="到账时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, exportOrder } from '@/api/wallet'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, currencyOptions } from '@/utils/explain'

export default {
  name: 'Wallet',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      downloadLoading: false,
      list: [],
      search: {
        keywords: '',
        currency: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      currencyOptions,
      dateRangeValue: [],
      pickerOptions,
      loading: false
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
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit, type: 'recharge' })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
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
    onChangeStatus(value) {
      this.getList(1)
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
::v-deep .grid-content {
  color: #606266;
  font-size: 14px;
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
