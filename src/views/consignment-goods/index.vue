<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="平台名称" prop="issuer_name">
          <el-input v-model="search.issuer_name" placeholder="平台名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="藏品名称" prop="name">
          <el-input v-model="search.name" placeholder="藏品名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="上架市场">
          <el-select v-model="search.consignment_status" clearable @change="getList(1)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            :src="row.show_image"
            :preview-src-list="[row.show_image]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="藏品信息" min-width="180">
        <template slot-scope="{ row }">
          <div>类型：藏品</div>
          <div>编号：{{ row.serial }}</div>
          <span>藏品名称：{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="所属市场">
        <template slot-scope="{row}">
          {{ row.issuer_id ? row.issuer_info.name + '专区' : '寄售市场' }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="发行价">
        <template slot-scope="{ row }"> ￥{{ row.cny_price }} </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="circulate" label="流通量" />
      <el-table-column header-align="center" align="center" prop="total" label="发行量" />
      <el-table-column width="120" label="是否置顶" align="center">
        <template slot-scope="{ row }">
          <el-switch v-model="row.is_top" :active-value="1" :inactive-value="0" @change="onChangeStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column width="120" label="允许上架专区市场" align="center">
        <template slot-scope="{ row }">
          <el-switch v-model="row.consignment_status" :active-value="0" :inactive-value="1" @change="onChangeStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <add-or-update ref="addOrUpdate" @refreshList="getList()" />
  </div>
</template>

<script>
import { dataList, putData } from '@/api/consignment-goods'
import { statusOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'

export default {
  name: 'ConsignmentGoods',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      loading: false,
      search: {
        name: '',
        issuer_name: '',
        consignment_status: ''
      },
      list: [],
      statusOptions,
      addOrUpdateVisible: false,
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
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onChangeStatus(row) {
      putData(row.id, row).then(res => {
        this.$message.success(res.msg)
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
