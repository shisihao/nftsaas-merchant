<template>
  <div>
    <el-dialog top="30px" width="1000px" title="多次发售列表" :visible.sync="visible" @closed="onClose()">
      <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
        {{ $t('table.add') }}
      </el-button>
      <el-table v-loading="loading" border highlight-current-row :data="list" style="margin-top: 10px">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        />
        <el-table-column
          prop="num"
          label="期数"
          align="center"
        />
        <el-table-column
          prop="total_stock"
          label="发售总量"
          align="center"
        />
        <el-table-column
          prop="stock"
          label="库存"
          align="center"
        />
        <el-table-column
          prop="sales_num"
          label="销售量"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="时间"
          width="170"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>创建：{{ row.created_at }}</div>
            <div>开售：{{ row.start_time }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button v-if="row.stock > 0" type="primary" @click="onPutFormSubmit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pages.total > 0"
        :total="pages.total"
        :page.sync="pages.current"
        :limit.sync="pages.limit"
        @pagination="getList()"
      />
    </el-dialog>
    <change-more-update
      v-if="changeVisible"
      ref="changeUpdate"
      @refreshList="getList()"
    />
    <add-more-or-update
      v-if="moreVisible"
      ref="addmoreUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import ChangeMoreUpdate from './ChangeMoreUpdate'
import AddMoreOrUpdate from './AddMoreOrUpdate'
import { moreList } from '@/api/collection'

export default {
  name: 'MoreOrUpdate',
  components: { Pagination, ChangeMoreUpdate, AddMoreOrUpdate },
  data() {
    return {
      visible: false,
      loading: false,
      changeVisible: false,
      moreVisible: false,
      goods_id: 0,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: []
    }
  },
  methods: {
    init(data) {
      this.goods_id = data.id
      this.visible = true
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      moreList({ goods_id: this.goods_id }).then((response) => {
        if (response.code !== 0) return
        this.list = response.data.data
        this.pages.total = response.data.total
      })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.visible = false
    },
    onPutFormSubmit(data) {
      this.changeVisible = true
      this.$nextTick(() => {
        this.$refs.changeUpdate && this.$refs.changeUpdate.init(data)
      })
    },
    onAddOrUpdate() {
      const id = this.goods_id
      this.moreVisible = true
      this.$nextTick(() => {
        this.$refs.addmoreUpdate && this.$refs.addmoreUpdate.init(id)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input-number {
    width: 200px;
  }
</style>
