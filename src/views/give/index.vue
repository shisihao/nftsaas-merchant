<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="赠送人">
          <el-input v-model="search.user_keywords" placeholder="ID/手机号/钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="search.target_keywords" placeholder="ID/手机号/钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="藏品信息"
        min-width="240"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user_goods && row.user_goods.goods" class="info-wrapper">
            <el-image
              class="image-item"
              lazy
              :src="Array.isArray(row.user_goods.goods.images) && row.user_goods.goods.images[0] && row.platform_info.oss_url + row.user_goods.goods.images[0]"
              :preview-src-list="[Array.isArray(row.user_goods.goods.images) && row.user_goods.goods.images[0] && row.platform_info.oss_url + row.user_goods.goods.images[0]]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <ul class="data-info">
              <li>
                <div>编号：</div>
                <div>{{ row.user_goods.goods.serial }}</div>
              </li>
              <li>
                <div>名称：</div>
                <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                  <div slot="content">{{ row.user_goods.goods.name }}</div>
                  <div class="more-ellipsis-3">{{ row.user_goods.goods.name }}</div>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="赠送人"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
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
        label="接收人"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.target_user">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.target_user.avatar ? (domin + row.target_user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.target_user.name }}
                <span v-if="row.target_user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.target_user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.target_user.phone || row.target_user.email }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="hash"
        label="交易HASH"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.hash || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="赠送时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { dataList } from '@/api/give'
import { pickerOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
export default {
  name: 'Give',
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      dateRangeValue: [],
      pickerOptions,
      domin: getToken(DominKey),
      wait_count: 0,
      search: {
        user_keywords: '',
        target_keywords: '',
        start_time: '',
        end_time: '',
        status: ''
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '处理中', value: 0 },
        { label: '已完成', value: 1 },
        { label: '失败', value: 2 }
      ],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
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
  .data-info {
    padding: 0;
    margin-left: 4px;
    li {
      display: flex;
      div:nth-child(1) {
        flex-shrink: 0;
      }
    }
  }
  ::v-deep .badge-item {
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
