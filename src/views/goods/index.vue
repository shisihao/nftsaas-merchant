<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="名称">
          <el-input v-model="search.keywords" placeholder="商品名称(支持模糊查询)" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="商品属性">
          <el-select v-model="search.type" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in catesOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="专区/期数">
          <el-cascader
            clearable
            :options="zoneSearchOptions"
            :props="{ checkStrictly: true }"
            @change="onhandleChangeZone"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="search.cate_id" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in cateOptions" :key="item.value" :label="item.label" :value="item.value" />
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
    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
      :header-cell-style="headNone"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        v-if="info.template_id !== 1"
        prop="images"
        label="商品图片"
        width="291"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!loading" class="recommendPage">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item,index) in row.images" :key="index" class="images-list">
                <el-image
                  class="image-item"
                  :src="domin + item"
                  @click="onPicturePreview(item)"
                />
              </swiper-slide>
              <div slot="pagination" class="swiper-pagination" />
              <div slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
              <div slot="button-next" class="swiper-button-next" @click="next($index)" />
            </swiper>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        header-align="center"
      />
      <el-table-column
        label="已售"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            数量：{{ row.sales_num }}
          </div>
          <div>
            USDT销售额：{{ row.sales_usdt | cutZero }}
          </div>
          <div>
            现金销售额  ：{{ row.sales_cny | moneyToFormat }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
      >
        <template slot="header">
          商品信息
        </template>
        <el-table-column
          width="180"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.extend.market_price_status">
              市场价格：￥<span style="text-decoration: line-through;">{{ row.extend.market_price | moneyToFormat }}</span>
            </div>
            <div>
              商品单价：￥{{ row.price | moneyToFormat }}
            </div>
            <div>
              {{ ['eth'].includes(row.zone) ? '算力(M)' : '算力(T)' }}：{{ row.spec | cutZero }}
            </div>
            <div>
              年限数量(天)：{{ row.years }}
            </div>
            <div>
              库存：{{ row.stock }}
            </div>
            <div>
              限购数量：{{ row.limit_status ? row.limit_num : '不限购' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div>
              所属专区：{{ row.zone.toUpperCase() }}
            </div>
            <div>
              商品分类：{{ row.cate_id | paraphrase(categoryOptions) }}
            </div>
            <div v-if="row.power_status">
              {{ ['eth'].includes(row.zone) ? '设备算力(MH/S)' : '设备算力(T/S)' }}：{{ row.extend.power }}
            </div>
            <div v-if="row.cycle_status">
              预计回本周期(天)：{{ row.cycle }}
            </div>
            <div>
              期数：{{ row.period.id | paraphrase(levelOptions) }}
            </div>
            <div>
              参与市场：{{ row.market_status ? '是' : '否' }}
            </div>
            <div>
              设备功耗(KW)：{{ row.power_waste || 0 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.daily_output_status">
              {{ `预计日产出(${row.zone.toUpperCase()}/天)` }}：{{ row.daily_output }}
            </div>
            <div v-if="row.operate_status">
              运营维护费状态：{{ row.operate }}
            </div>
            <div v-if="['eth', 'btc'].includes(row.zone)">
              电费类型：{{ row.power_type | paraphrase(powerTypeOptions) }}
            </div>
            <div v-if="[0, 1, 2].includes(row.cate)">
              商品类型：{{ row.cate | paraphrase(catesOptions) }}
            </div>
            <template v-if="row.zone === 'fil'&& row.cate === 1">
              <div>
                GAS费：{{ row.gass_fee | cutZero }}
              </div>
              <div>
                抵押：{{ row.mortgage | cutZero }}
              </div>
            </template>
            <div v-if="row.is_hide">
              APP隐藏商品：<el-link type="primary" :underline="false">已隐藏</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="限时优惠时间"
        width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.discount_status">
            <div>{{ row.discount_start_time }}</div>
            <div>-</div>
            <div>{{ row.discount_end_time }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <template v-if="row.sortEdit">
            <el-input-number v-model="row.sort" controls-position="right" class="edit-input" size="small" :min="0" :max="255" :precision="0" />
            <el-button
              class="cancel-btn"
              type="warning"
              @click="onCancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <el-link v-else type="primary" :underline="false" @click="row.sortEdit = true">{{ row.sort }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <template v-if="row.sortEdit">
            <el-button type="success" @click="onConfirmSortEdit(row)">确定</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete({ row, $index })">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <el-image-viewer
      v-if="imageViewer"
      :on-close="closeViewer"
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
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import { dataList, deleteData, sortGoods } from '@/api/goods'
import { DominKey, getToken } from '@/utils/auth'
import { zoneSearchOptions, powerTypeOptions, catesOptions } from '@/utils/explain'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { powerLevelList as filLevel } from '@/api/fil-level'
import { powerCategoryList } from '@/api/category'
import { mapGetters } from 'vuex'

export default {
  name: 'Goods',
  components: { Pagination, AddOrUpdate, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      domin: getToken(DominKey),
      zoneSearchOptions,
      powerTypeOptions,
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
        keywords: '',
        period_id: '',
        type: '',
        cate_id: '',
        zone: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      imageViewerList: [],
      cateOptions: [],
      catesOptions: catesOptions,
      categoryOptions: [],
      imageViewer: false,
      levelOptions: [],
      typeOptions: [
        { label: '全部', value: '' },
        { label: '普通', value: 'common' },
        { label: '注册可领', value: 'register' },
        { label: '新手特供', value: 'novice' }
      ],
      loading: false,
      addOrUpdateVisible: false
    }
  },
  computed: {
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`].$swiper
      }
    },
    ...mapGetters([
      'info'
    ])
  },
  watch: {
    'search.zone'(val) {
      this.cateOptions = this.categoryOptions.filter(v => {
        return v.zone === val
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.getFileLevelList(), this.getCategoryList()])
        .then(() => {
          this.getList()
        })
    },
    async getFileLevelList() {
      await filLevel()
        .then(response => {
          this.levelOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          })
          this.zoneSearchOptions.forEach((item, index) => {
            const level = []
            response.data.forEach(val => {
              if (item.value === val.type) {
                level.push({ label: val.name, value: val.id })
              }
            })
            if (level.length > 0) {
              this.$set(this.zoneSearchOptions, index, Object.assign(item, { children: level }))
            }
          })
        })
        .catch(() => {
        })
    },
    async getCategoryList() {
      await powerCategoryList()
        .then(response => {
          this.categoryOptions = response.data.map(v => {
            return {
              zone: v.zone,
              label: v.name,
              value: v.id
            }
          })
        })
        .catch(() => {
        })
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            return Object.assign(v, { sortEdit: false, sortOld: v.sort })
          })
          this.pages.total = response.data.total
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      if (this.levelOptions.length === 0) {
        this.$message.warning('请先添加期数')
        return false
      }

      if (this.categoryOptions.length === 0) {
        this.$message.warning('请先添加商品分类')
        return false
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
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
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    closeViewer() {
      this.imageViewer = false
    },
    prev(index) {
      this.swiper(index).slidePrev()
    },
    next(index) {
      this.swiper(index).slideNext()
    },
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    },
    onCancelEdit(row) {
      row.sortEdit = false
      row.sort = row.sortOld
    },
    onConfirmSortEdit(row) {
      sortGoods({ id: row.id, data: { sort: row.sort }})
        .then(({ msg = '修改成功' }) => {
          this.$message.success(msg)
          row.sortEdit = false
        })
        .catch(() => {
        })
    },
    onChangeZone(val) {
      this.search.cate_id = ''
      this.getList(1)
    },
    onhandleChangeZone(val) {
      if (val[0]) {
        this.search.zone = val[0]
      } else {
        this.search.zone = ''
      }

      if (val[1]) {
        this.search.period_id = val[1]
      } else {
        this.search.period_id = ''
      }

      this.getList(1)
    }
  }
}
</script>
<style scoped>
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
.swiper-button-prev,.swiper-button-next {
  display: none;
}
.recommendPage:hover .swiper-button-prev,.recommendPage:hover .swiper-button-next {
  /*display: block;*/
}
::v-deep .detail-content  img {
  width: 100%;
  height: auto;
}
::v-deep .el-image-viewer__canvas {
  width: 80%;
  margin: 0 auto;
}
::v-deep .edit-input {
  padding-right: 50px;
}
::v-deep .cancel-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  margin-top: -14px;
}
::v-deep .edit-input .el-input-number__decrease,::v-deep .edit-input .el-input-number__increase{
  display: none;
}
::v-deep .edit-input.is-controls-right .el-input__inner {
  padding: 0;
}
</style>
