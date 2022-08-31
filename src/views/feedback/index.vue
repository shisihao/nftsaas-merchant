<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="search.tag" placeholder="标签" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="search.status" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
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
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
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
        width="80"
        align="center"
      />
      <el-table-column
        label="账号"
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="反馈内容"
        header-align="center"
      />
      <el-table-column
        prop="images"
        label="反馈图片"
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
        prop="tag"
        label="标签"
        header-align="center"
      >
        <template slot-scope="{ row: { tag } }">
          <el-tag>{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="from"
        label="来源"
        width="80"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status } }">
          <el-tag v-if="status === 0" type="warning">未解决</el-tag>
          <el-tag v-else type="success">已解决</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        width="140"
        label="反馈时间"
        align="center"
      />
      <el-table-column
        width="150"
        label="操作"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onJwChatTalk(row)">回复</el-button>
          <el-button v-if="row.status === 0" type="success" @click="onSolve(row)">解决</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <jw-chat-talk
      v-if="talkVisible"
      ref="talk"
      @refreshList="getList()"
    />
    <el-image-viewer
      v-if="imageViewer"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, setSolve } from '@/api/feedback'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import JwChatTalk from './components/JwChatTalk'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Feedback',
  components: { Pagination, JwChatTalk, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        keywords: '',
        status: '',
        tag: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '未解决', value: 0 },
        { label: '已解决', value: 1 }
      ],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      imageViewer: false,
      imageViewerList: [],
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      talkVisible: false
    }
  },
  computed: {
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
      this.search.status = this.$route.query.status === undefined ? '' : parseInt(this.$route.query.status)
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
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
    onJwChatTalk(data) {
      this.talkVisible = true
      this.$nextTick(() => {
        this.$refs.talk && this.$refs.talk.init(data)
      })
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
    onSolve(data) {
      this.$confirm(`确定进行设置解决操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          setSolve(data.id)
            .then(({ msg }) => {
              this.getList()
              this.$message.success(msg)
            })
            .catch(() => {})
        })
        .catch(() => {})
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
  visibility: hidden;
}
.swiper-button-prev::after,.swiper-button-next::after {
  font-size: 30px;
}
.recommendPage:hover .swiper-button-prev,.recommendPage:hover .swiper-button-next {
  /* visibility: visible; */
}
</style>
