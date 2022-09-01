<template>
  <div>
    <el-dialog top="30px" width="1000px" :title="form.title" :visible.sync="visible" @closed="onClose()">
      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="状态">
            <el-select v-model="search.status" clearable @change="getList(1)">
              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
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
          width="60"
          align="center"
        />
        <el-table-column
          label="凭证"
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
                    :src="item.filename && domin + item.filename"
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
          prop="activity.title"
          label="活动名称"
          header-align="center"
        />
        <el-table-column
          label="用户信息"
          min-width="120"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.user">
              <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
              <div style="display: inline-block;margin-left: 2px">
                <div>
                  #{{ row.user.id }}
                  <el-divider direction="vertical" />
                  {{ row.user.name }}
                </div>
                <div>
                  {{ row.user.phone || row.user.email }}
                </div>
                <div />
              </div>
            </div>
            <div v-else>
              用户已删除
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template slot-scope="{ row: { status, reason } }">
            <div v-if="status === 2">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                :content="reason"
              >
                <el-tag slot="reference" :type="status | paraphrase(verifyStatusOptions, 'value', 'type')"> {{ status | paraphrase(verifyStatusOptions) }} <i class="el-icon-info" /></el-tag>
              </el-popover>
            </div>
            <div v-else>
              <el-tag :type="status | paraphrase(verifyStatusOptions, 'value', 'type')"> {{ status | paraphrase(verifyStatusOptions) }} </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <div v-if="row.status === 0">
              <el-button type="success" @click="onPassOrReject(row, 1)">通过</el-button>
              <el-button type="danger" @click="onPassOrReject(row, 0)">驳回</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    </el-dialog>

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
import { DominKey, getToken } from '@/utils/auth'
import { recordShareList, recordShareStatus } from '@/api/activity'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { verifyStatusOptions } from '@/utils/explain'
import 'swiper/swiper-bundle.css'

export default {
  name: 'RecordShareList',
  components: { Pagination, ElImageViewer, Swiper, SwiperSlide },
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
      verifyStatusOptions,
      visible: false,
      loading: false,
      imageViewer: false,
      imageViewerList: [],
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        activity_id: '',
        status: ''
      },
      form: {
        id: 0,
        title: ''
      }
    }
  },
  computed: {
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`].$swiper
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.search.activity_id = data.id
      this.form.id = data.id
      this.form.title = data.title
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      recordShareList({ page, limit: this.pages.limit, ...this.search })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total || 0
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject(row, type) {
      const title = type === 1 ? '通过' : '驳回'
      const status = type === 1 ? 1 : 2
      const confirmType = type === 1 ? this.$confirm : this.$prompt

      confirmType(`${title}该条记录`, `${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 1 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api = recordShareStatus({ id: row.id, status: status, reason: value })
          api
            .then(() => {
              this.$message.success(`${type === 1 ? '已通过' : '已驳回'}`)
              this.getList()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    },
    onPicturePreview(imgArr, index) {
      const newImgArr = imgArr.map(v => {
        return v.filename
      })
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
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
