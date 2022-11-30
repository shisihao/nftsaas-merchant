<template>
  <el-dialog title="详情" :visible.sync="visible" width="80%" @closed="onClose()">
    <div>
      <el-table
        v-loading="loading"
        border
        :data="list"
      >
        <el-table-column
          label="ID"
          width="80"
          align="center"
          prop="id"
        />
        <el-table-column
          label="基准价"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            ￥{{ row.cny_price }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          header-align="center"
          align="center"
          prop="num"
        />
        <el-table-column
          label="信息"
          header-align="center"
          min-width="170"
        >
          <template slot-scope="{ row: { extend } }">
            <div>取值最高价:￥{{ extend.max_price }}</div>
            <div>取值最低价:￥{{ extend.min_price }}</div>
            <div>高于取值最高价数量:{{ extend.max_all_num }}</div>
            <div>低于取值最低价数量:{{ extend.min_all_num }}</div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          label="取值范围"
          min-width="220"
        >
          <template slot-scope="{ row: { extend } }">
            <div>取值开始时间:{{ extend.start_time }}</div>
            <div>取值结束时间:{{ extend.end_time }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="是否选中"
          width="160"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            <div :class="row.status === 1 ? 'is-status' : 'no-status'">{{ row.status | paraphrase(whetherOptions) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="基准价时间"
          align="center"
          width="180"
          prop="time"
        />
        <el-table-column
          label="创建时间"
          align="center"
          width="180"
          prop="created_at"
        />
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="120"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="primary" plain @click="onSeeDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </div>
    <price-more-detail ref="PriceMore" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { consignmentPriceList } from '@/api/consignment-price'
import { whetherOptions } from '@/utils/explain'
import PriceMoreDetail from './PriceMoreDetail'

export default {
  name: 'PriceDetailLog',
  components: { Pagination, PriceMoreDetail },
  data() {
    return {
      visible: false,
      loading: false,
      PriceMoreVisible: false,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        goods_id: '',
        status: 1,
        type: ''
      },
      whetherOptions,
      list: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(data) {
      if (data) {
        this.visible = true
        this.search.goods_id = data.data.id
        this.search.type = data.type
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      consignmentPriceList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onSeeDetail(data) {
      this.PriceMoreVisible = true
      this.$nextTick(() => {
        this.$refs.PriceMore && this.$refs.PriceMore.init(data)
      })
    },
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.is-status{
color:#2ed573;
font-weight: 700;
}
.no-status{
  color: #909399;
  font-weight: 700;
}
</style>
