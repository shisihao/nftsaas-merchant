<template>
  <el-dialog title="订单统计" width="800px" :visible.sync="visible" @closed="onClose()">
    <el-table
        v-loading="loading"
        border
        highlight-current-row
        :data="list"
    >
      <el-table-column
          prop="goods_id"
          label="ID"
          width="80"
          align="center"
      />
      <el-table-column
          prop="goods.name"
          label="商品名称"
          header-align="center"
      />
      <el-table-column
          prop="price"
          label="售出总价"
          align="center"
      />
      <el-table-column
          prop="deduct_num"
          label="总抵扣SD数量"
          align="center"
      />
      <el-table-column
          prop="buy_num"
          label="售出总量"
          align="center"
      />
      <el-table-column
          prop="specs"
          label="产品类型(T)"
          align="center"
      />
    </el-table>
  </el-dialog>
</template>

<script>
import { getOrderCount } from '@/api/order'

export default {
  name: 'OrderCount',
  data() {
    return {
      list: [],
      loading: false,
      visible: false
    };
  },
  methods: {
    init() {
      this.visible = true
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      getOrderCount()
        .then(({ data }) => {
          this.list = data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.list = []
    }
  }
};
</script>
