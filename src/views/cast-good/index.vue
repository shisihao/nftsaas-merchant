<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" style="width: 240px;" placeholder="藏品编号/藏品名称/发行方/创作者" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
            编号：{{ row.serial }}
          </div>
          <div>
            名称：{{ row.name }}
          </div>
          <div>
            发行方：{{ row.issuer || '' }}
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
            总库存：{{ row.total_stock || 0 }}
          </div>
          <div>
            剩余库存：{{ row.stock || 0 }}
          </div>
          <div>
            类型：
            <el-link class="preview-btn" :underline="false" :type="goodShowType(row) | paraphrase(goodShowTypeOptions, 'value', 'type')">{{ goodShowType(row) | paraphrase(goodShowTypeOptions) }}</el-link>
            <el-link v-if="goodShowType(row)" class="preview-btn" type="primary" :underline="false" @click="onPreview3d(row)">预览<i class="el-icon-view el-icon--right" /></el-link>
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
        min-width="230"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>{{ row.hash || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="140"
        prop="created_at"
        align="center"
      />
      <el-table-column
        label="操作"
        width="180"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row, $index)">删除</el-button>
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

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <preview3d
      ref="preview3d"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData } from '@/api/cast'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Preview3d from './components/Preview3d'
import { pickerOptions, statusOptions, whetherOptions, typeOptions, goodShowTypeOptions } from '@/utils/explain'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Collection',
  components: { AddOrUpdate, Pagination, ElImageViewer, Swiper, SwiperSlide, Preview3d },
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
        keywords: ''
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
      goodShowTypeOptions
    }
  },
  computed: {
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
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList({ page, ...this.search, limit: this.pages.limit })
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
    onPreview3d(data) {
      this.$nextTick(() => {
        this.$refs.preview3d && this.$refs.preview3d.init(data)
      })
    },
    onDelete(row, index) {
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
          deleteData(row.id)
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
.preview-btn {
  font-size: 12px;
  margin-right: 10px;
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
