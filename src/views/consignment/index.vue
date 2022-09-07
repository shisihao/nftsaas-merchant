<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="search.keywords" placeholder="搜索关键词" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="search.phone" placeholder="用户手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="用户地址" prop="address">
          <el-input v-model="search.address" placeholder="用户地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="所属市场">
          <el-select v-model="search.issuer_id" placeholder="请选择" clearable @change="getList(1)">
            <el-option v-for="(item,index) in issuerList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in consignmentOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="loading"
        border
        :data="list"
      >
        <el-table-column
          label="ID"
          prop="id"
          width="100"
          align="center"
        />
        <el-table-column
          label="图片"
          header-align="center"
          width="120"
        >
          <template slot-scope="{ row }">
            <el-image
              class="image-item"
              :src="row.goods && row.goods.images.length > 0 &&row.issuer_id?row.goods.images[0]: domin + row.goods.images[0]"
              :preview-src-list="[row.goods && row.goods.images.length > 0 && row.issuer_id?row.goods.images[0]:domin + row.goods.images[0]]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="信息"
          min-width="180"
          header-align="center"
        >
          <template slot-scope="{row}">
            <ul class="data-info" style="margin-left: 10px;">
              <li>
                <div>类型：</div>
                <el-tag :type="row.type | paraphrase(orderTypeOptions,'value','type')">{{ $options.filters.paraphrase(row.type,orderTypeOptions).substring(0,2) }}</el-tag>
              </li>
              <li>
                <div>编号：</div>
                <div>{{ row.goods.serial }}</div>
              </li>
              <li>
                <div>名称：</div>
                <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                  <div class="ellipsis">{{ row.goods.name }}</div>
                  <div slot="content">{{ row.goods.name }}</div>
                </el-tooltip>
              </li>
              <li>
                <div>价格：</div>
                <div><svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.price }}</div>
              </li>
              <li>
                <div>所属市场：{{ row.issuer_id?row.issuer.name+'专区':'寄售市场' }}</div>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" min-width="160" header-align="center">
          <template slot-scope="{ row }">
            <div v-if="row.user">
              <el-avatar
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
        <el-table-column
          header-align="center"
          align="center"
          label="寄售状态"
        >
          <template slot-scope="{row}">
            <div><el-link :underline="false" :type="row.status | paraphrase(consignmentOptions, 'value', 'type')">{{ row.status | paraphrase(consignmentOptions) }}</el-link></div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="created_at"
          label="寄售时间"
          width="180"
        />
      </el-table>
    </div>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { dataList, filterIssuer } from '@/api/consignment'
import { consignmentOptions, orderTypeOptions, payOptions } from '@/utils/explain'

export default {
  name: 'Consignment',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      consignmentOptions,
      payOptions,
      orderTypeOptions,
      list: [],
      issuerList: [
        { label: '寄售市场', value: 0 }
      ],
      search: {
        keywords: '',
        tags: '',
        address: '',
        issuer_id: '',
        phone: '',
        status: ''
      },
      pages: {
        current: 1,
        limit: 10,
        total: 0
      },
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getIssuerList()
      this.getList()
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
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
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

  .data-info {
    padding: 0;
    li {
      display: flex;
      div:nth-child(1) {
        flex-shrink: 0;
      }
    }
  }

  .icon-logo {
    width: 30px;
    height: 30px;
    margin-right: 3px;
    vertical-align: middle;
  }

  .img-item {
    width: 100px;
    height: 100px;
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
</style>
