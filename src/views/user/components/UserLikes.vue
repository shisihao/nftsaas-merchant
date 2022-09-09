<template>
  <el-dialog top="30px" :title="`用户${form.name}喜欢的`" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" label-width="70px">
      <el-form-item label="商品类型">
        <el-select v-model="form.target_type" clearable @change="getList(1)">
          <el-option v-for="item in listOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <h4>商品总数: {{ pages.total }}</h4>
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
        width="300"
        label="商品信息"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            class="img-box"
            style="width: 100px; min-height: 100px;display: inline-block;vertical-align: text-top;"
            fit="contain"
            :src="row.goods.images[0] && domin + row.goods.images[0]"
            :preview-src-list="[`${domin}${row.goods.images}`]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div class="goods-info">
            <div class="goods-name">
              <span>
                商品编号：{{ row.target_type === 'goods'? row.goods.serial : '-' }}
              </span>
            </div>
            <div>
              <div>名称：{{ row.goods.name }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="serial"
        label="金额"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>人民币价格:{{ row.goods.cny_price || 0.00 }}</div>
          <div>{{ integral }}价格:{{ row.goods.integral_price || 0.00 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.goods.start_time || '-' }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { userLikes } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'UserLikes',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      list: [],
      domin: getToken(DominKey),
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      listOptions: [
        { label: '全部', value: '' },
        { label: '藏品', value: 'goods' },
        { label: '盲盒', value: 'blind_box' }
      ],
      form: {
        target_type: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  methods: {
    init(data) {
      this.visible = true
      this.form.id = data.id
      this.form.name = data.name
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      userLikes(this.form.id, { page, ...this.form, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total || 0
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.visible = false
      this.$reset()
    }
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .el-dialog {
   width: 1000px;
 }
 .goods-box {
   display: flex;
   .img-box {
     flex-shrink: 0;
   }
   .goods-info {
     display: inline-block;
     margin-left: 10px;
     vertical-align: top;
     .goods-name {
       height: 80px;
       span {
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
       }
     }
     div:nth-child(2) {
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
     }
   }
 }
 .goods-info {
   display: inline-block;
   margin-left: 10px;
   vertical-align: top;

   .goods-name {
     width: 169px;
     height: 80px;

     span {
       overflow: hidden;
       text-overflow: ellipsis;
       display: -webkit-box;
       -webkit-line-clamp: 3;
       -webkit-box-orient: vertical;
     }
   }

   div:nth-child(2) {
     width: 169px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
   }
 }
</style>
