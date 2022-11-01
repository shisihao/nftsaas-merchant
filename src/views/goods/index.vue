<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" style="width: 300px;" placeholder="藏品编号/藏品名称/发行方/分类名称/合约地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="藏品类型">
          <el-select v-model="search.type" clearable @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-select v-model="search.status" clearable @change="getList(1)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否售罄">
          <el-select v-model="search.sellout" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否同步奇藏果">
          <el-select v-model="search.sync_status" clearable @change="getList(1)">
            <el-option v-for="item in sync_status_options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否同步甘文交">
          <el-select v-model="search.sync_gwj_status" clearable @change="getList(1)">
            <el-option v-for="item in sync_status_options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`是否奖励${integral}`">
          <el-select v-model="search.is_integral_reward" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发表时间">
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
        <el-form-item label="藏品标签">
          <el-select v-model="search.tags" multiple clearable @change="getList(1)">
            <el-option
              v-for="item in tagsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
    >
      <el-table-column
        prop="id"
        label="ID"
        width="55"
        align="center"
      />
      <el-table-column
        prop="images"
        label="藏品图片"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!loading" class="recommend-page">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item,index) in row.images" :key="index" class="images-list">
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
        label="藏品信息"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            名称：{{ row.name }}
          </div>
          <div>
            类型：<el-tag :type="row.type | paraphrase(typeOptions, 'value', 'type')"> {{ row.type | paraphrase(typeOptions) }} </el-tag>
          </div>
          <div>
            价格：¥{{ row.cny_price || 0.00 }}
          </div>
          <div v-if="integral_use">
            {{ integral }}：{{ row.integral_price || 0.00 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="藏品信息"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            编号：{{ row.serial }}
          </div>
          <div>
            库存：{{ row.stock || 0 }}
          </div>
          <div>
            已售：{{ row.sales_num || 0 }}
          </div>
          <div>
            开售：{{ row.start_time }}
          </div>
          <div>
            转赠：{{ row.give_time }}
          </div>
          <div>
            类型：
            <el-link class="preview-btn" :underline="false" :type="goodShowType(row) | paraphrase(goodShowTypeOptions, 'value', 'type')">{{ goodShowType(row) | paraphrase(goodShowTypeOptions) }}</el-link>
          </div>
          <div>
            是否同步奇藏果：{{ row.sync_status?'否':'是' }}
          </div>
          <div>
            是否同步甘文交：{{ row.sync_gwj_status?'否':'是' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="创作者"
        min-width="130"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;align-items: center;">
            <el-avatar
              icon="el-icon-user-solid"
              style="flex-shrink: 0;"
              :src="row.author_avatar ? domin + row.author_avatar : ''"
            />
            <div style="margin-left: 4px;flex-grow: 1;">{{ row.author || '-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="链上HASH"
        min-width="130"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>{{ row.hash || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`奖励${integral}`"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>{{ row.integral_reward }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品标签"
        header-align="center"
      >
        <template slot-scope="{ row: { tags } }">
          <el-tag v-for="(item, index) in tags" :key="index" effect="plain">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="70" label="是否售罄" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-if="row.type === 0"
            v-model="row.sell_out"
            :active-value="1"
            :inactive-value="0"
            @change="onChangeSellOut(row, 'sell_out')"
          />
        </template>
      </el-table-column>
      <el-table-column width="70" label="是否展示售罄" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-if="row.type === 0"
            v-model="row.sell_out_show"
            :active-value="1"
            :inactive-value="0"
            @change="onChangeSellOut(row, 'sell_out_show')"
          />
        </template>
      </el-table-column>
      <el-table-column width="70" label="上架状态" align="center">
        <template slot-scope="{ row, $index }">
          <el-switch
            v-if="row.type === 0"
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            @change="onChangeStatus(row, $index)"
          />
        </template>
      </el-table-column>
      <el-table-column width="70" label="是否转赠" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.give_status"
            :active-value="0"
            :inactive-value="1"
            @change="onChangeSellOut(row, 'give_status')"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <el-button-group>
            <el-button v-if="[1].includes(row.is_more)" type="primary" plain @click="onMoreOrUpdate(row)">多次销售</el-button>
            <el-button v-if="row.sell_out === 1 && row.stock > 0" type="warning" @click="onRecycle(row)">库存回收</el-button>
            <el-button v-if="![4].includes(row.type)" type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row, $index)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
    <!-- 弹窗, 多次销售 / 修改 -->
    <add-more-list
      v-if="addMoreVisible"
      ref="AddMoreList"
      @refreshList="getList()"
    />

    <look-all-tag
      v-if="lookAllTagVisible"
      ref="lookAllTag"
      @refreshList="getList()"
    />

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteGoodsItem, setStatus, setSellOut, recycle } from '@/api/collection'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import AddMoreList from './components/AddMoreList'
import LookAllTag from './components/LookAllTag'
import { pickerOptions, statusOptions, whetherOptions, typeOptions, goodShowTypeOptions } from '@/utils/explain'
import { tagList } from '@/api/common'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { mapGetters } from 'vuex'

export default {
  name: 'Collection',
  components: { LookAllTag, AddOrUpdate, AddMoreList, Pagination, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      domin: getToken(DominKey),
      search: {
        type: '',
        keywords: '',
        status: '',
        sellout: '',
        sync_status: '',
        sync_gwj_status: '',
        start_time: '',
        end_time: '',
        tags: [],
        is_integral_reward: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      typeOptions,
      list: [],
      dateRangeValue: [],
      tagsOptions: [],
      addOrUpdateVisible: false,
      addMoreVisible: false,
      lookAllTagVisible: false,
      loading: false,
      imageViewerList: [],
      imageViewer: false,
      pickerOptions,
      whetherOptions,
      statusOptions,
      goodShowTypeOptions,
      sync_status_options: [
        { label: '全部', value: '' },
        { label: '否', value: 1 },
        { label: '是', value: 0 }
      ]
    }
  },
  computed: {
    ...mapGetters(['integral', 'integral_use']),
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`].$swiper
      }
    },
    goodShowType() {
      return (row) => {
        const index = [0, row.is_three, row.is_video].findIndex(v => !!v)
        return index > 0 ? index : 0
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.tagLists()
    },
    tagLists() {
      tagList().then(response => {
        this.tagsOptions = response.data.map(v => {
          return {
            label: v.name,
            value: v.id
          }
        })
      })
    },
    onChangeStatus(row) {
      setStatus(row.id, { status: row.status })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row.status = row.status ? 0 : 1
          this.$message.error(msg)
        })
    },
    onChangeSellOut(row, name) {
      setSellOut(row.id, { [name]: row[name] })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row[name] = row[name] ? 0 : 1
          this.$message.error(msg)
        })
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList({ page, ...this.search, limit: this.pages.limit, tags: `${this.search.tags}` })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
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
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onMoreOrUpdate(data) {
      this.addMoreVisible = true
      this.$nextTick(() => {
        this.$refs.AddMoreList && this.$refs.AddMoreList.init(data)
      })
    },
    lookAll(data) {
      this.lookAllTagVisible = true
      this.$nextTick(() => {
        this.$refs.lookAllTag && this.$refs.lookAllTag.init(data)
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
    closeViewer() {
      this.imageViewer = false
    },
    prev(index) {
      this.swiper(index).slidePrev()
    },
    next(index) {
      this.swiper(index).slideNext()
    },
    onRecycle(row) {
      this.$confirm(
        `确定进行[库存回收]操作?`,
        '库存回收',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          recycle(row.id)
            .then(({ msg = '库存回收成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onDelete(row) {
      this.$confirm(
        `确定进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteGoodsItem(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
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

.preview-btn {
  font-size: 12px;
  margin-right: 10px;
}

.recommend-page {
  width: 291px;
  margin: 0 auto;
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
.el-tag {
  margin-right: 4px;
}
</style>
