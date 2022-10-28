<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="名称">
          <el-input
            v-model="search.name"
            placeholder="名称"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="search.cate_id" clearable placeholder="商品分类" @change="getList(1)">
            <el-option
              v-for="(item, index) in shopCateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="search.status" clearable placeholder="上架状态" @change="getList(1)">
            <el-option label="全部" value="" />
            <el-option label="否" :value="1" />
            <el-option label="是" :value="0" />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="loading" border highlight-current-row :data="list">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column
        prop="images"
        label="商品图片"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!loading" class="recommend-page">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item, index) in row.images" :key="index" class="images-list">
                <el-image
                  class="image-item"
                  fit="contain"
                  :src="item && domin + item"
                  @click="onPicturePreview(row.images, index)"
                />
              </swiper-slide>
            </swiper>
            <div v-if="row.images.length > 3" slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
            <div v-if="row.images.length > 3" slot="button-next" class="swiper-button-next" @click="next($index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        width="200"
        header-align="center"
      />
      <el-table-column label="商品信息" min-width="180" header-align="center">
        <template slot-scope="{ row }">
          <div>分类：<el-tag effect="plain" :type="row.cate_id | paraphrase(shopCateOptions, 'value', 'type')">{{ row.cate_id | paraphrase(shopCateOptions) }}</el-tag></div>
          <div>价格：￥{{ row.cny_price || 0 | moneyToFormat }}</div>
          <div>{{ integral }}：{{ row.integral_price || 0 | moneyToFormat }}</div>
          <div>库存：{{ row.total_stock || 0 }}</div>
          <div>销量：{{ row.sales_num || 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="其他设置" min-width="180" header-align="center">
        <template slot-scope="{ row }">
          <div>类型：{{ row.type | paraphrase(shopTypeOptions) }}</div>
          <div>限购：{{ row.limit_num }}</div>
          <div>类型：{{ (row.skus && row.skus.length > 0) ? '多规格' : '无规格' }}</div>
          <div>开售：{{ row.start_time || '-' }}</div>
          <div>运费模板：{{ row.delivery ? row.delivery.name : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="售罄" width="60" align="center">
        <template slot-scope="{ row }">
          <el-link :underline="false" :type="row.stock ? 'info' : 'primary'">{{ row.stock ? '否' : '是' }}</el-link>
        </template>
      </el-table-column>
      <el-table-column width="70" label="上架状态" align="center">
        <template slot-scope="{ row, $index }">
          <el-switch
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            @change="onChangeStatus(row, $index)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" width="70" label="排序" align="center" />
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete({ row, $index })">删除</el-button>
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

    <el-image-viewer
      v-if="imageViewer"
      :on-close="onCloseViewer"
      :url-list="imageViewerList"
    />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import { shopCateOptions, whetherOptions, shopTypeOptions } from '@/utils/explain'
import { dataList, deleteData, setStatus } from '@/api/shop'
import { DominKey, getToken } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'EntityGoods',
  components: { Pagination, AddOrUpdate, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      domin: getToken(DominKey),
      shopCateOptions,
      whetherOptions,
      shopTypeOptions,
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      list: [],
      search: {
        name: '',
        cate_id: '',
        status: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      imageViewer: false,
      imageViewerList: [],
      loading: false,
      addOrUpdateVisible: false
    }
  },
  computed: {
    ...mapGetters(['integral']),
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`].$swiper
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
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init({ id: data && data.id })
      })
    },
    onChangeStatus(row, index) {
      setStatus({ id: row.id, status: row.status })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row.status = row.status ? 0 : 1
          this.$message.error(msg)
        })
    },
    onDelete({ row, $index }) {
      this.$confirm(
        `确定对[(#${row.id})(${row.name})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onPicturePreview(imgArr, index) {
      const newImgArr = imgArr.concat()
      const currentItemArr = newImgArr.slice(index, index + 1)
      newImgArr.splice(index, 1)
      const currentArr = currentItemArr.concat(newImgArr).map((v) => {
        return this.domin + v
      })
      this.imageViewerList = currentArr
      this.imageViewer = true
    },
    onCloseViewer() {
      this.imageViewer = false
    },
    prev(index) {
      this.swiper(index).slidePrev()
    },
    next(index) {
      this.swiper(index).slideNext()
    }
  }
}
</script>
<style lang="scss" scoped>
.images-list {
  width: 80px;
  height: 80px;
}
.images-list .image-item {
  height: 100%;
  cursor: pointer;
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
::v-deep .images-list .image-item img {
  height: auto;
}
.recommend-page {
  width: 291px;
  margin: 0 auto;
  .swiper-container {
    user-select: none;
  }
  .swiper-button-prev,.swiper-button-next {
    display: none;
    pointer-events: auto;
    cursor: pointer;
  }
  .swiper-button-prev::after, .swiper-button-next::after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  &:hover .swiper-button-prev, &:hover .swiper-button-next {
    display: flex;
  }
  .images-list {
    width: 80px;
    height: 80px;
    .image-item {
      height: 100%;
      cursor: pointer;
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
      img {
        height: auto;
      }
    }
  }
}
.el-link {
  vertical-align: baseline;
  cursor: text;
  font-size: 12px;
}
</style>
