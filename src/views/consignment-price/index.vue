<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input v-model="search.goods_name" placeholder="藏品名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="专区名称">
          <el-input v-model="search.issuer_name" placeholder="专区名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="search.type" @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label.substring(0,2)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="loading" border :data="list">
      <el-table-column label="ID" prop="id" width="100" align="center" />
      <el-table-column label="图片" header-align="center" width="120">
        <template slot-scope="{ row }">
          <el-image
            class="image-item"
            :src="row.issuer_id?row.show_image:domin+row.images[0]"
            :preview-src-list="[row.issuer_id?row.show_image:domin+row.images[0]]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="藏品信息" min-width="180">
        <template slot-scope="{ row }">
          <div>类型：{{ search.type==='goods'?'藏品':'盲盒' }}</div>
          <div v-if="search.type==='goods'">编号：{{ row.serial }}</div>
          <span>藏品名称：{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="所属市场">
        <template slot-scope="{row}">
          {{ row.issuer_id ? row.issuer_info.name: '寄售市场' }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="发行价">
        <template slot-scope="{ row }"> ￥{{ row.cny_price }} </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="基准价">
        <template slot-scope="{ row }"> ￥{{ row.newest_price }} </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="primary" plain @click="onPriceDetail(row)">基准价记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <add-or-update ref="addOrUpdate" @refreshList="getList()" />

    <price-detail-log ref="priceDetail" />
  </div>
</template>

<script>
import { dataList } from '@/api/consignment-price'
import { orderTypeOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import PriceDetailLog from './components/PriceDetailLog'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'ConsignmentPrice',
  components: { Pagination, AddOrUpdate, PriceDetailLog },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      search: {
        goods_name: '',
        issuer_name: '',
        type: 'goods'
      },
      list: [],
      typeOptions: orderTypeOptions.slice(1, 3),
      addOrUpdateVisible: false,
      priceDetailVisible: false,
      pages: {
        current: 1,
        limit: 20,
        total: 0
      }
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
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init({ data, type: this.search.type })
      })
    },
    onPriceDetail(data) {
      this.priceDetailVisible = true
      this.$nextTick(() => {
        this.$refs.priceDetail && this.$refs.priceDetail.init({ data, type: this.search.type })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
