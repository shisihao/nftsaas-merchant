<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键字">
          <el-input v-model="search.keywords" placeholder="名称/创作者/发行方" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="search.tags" clearable multiple @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in tagsOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否售罄">
          <el-select v-model="search.sellout" clearable @clear="getList(1)" @change="getList(1)">
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
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="images"
        label="图片"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="row.is_hot" class="hot-tag">
            <svg-icon icon-class="hot-tag" />
          </div>
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
        prop="name"
        label="名称"
        header-align="center"
      />
      <el-table-column
        prop="name"
        label="价格"
        width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            价格：¥ {{ row.cny_price }}
          </div>
          <div>
            {{ integral }}：{{ row.integral_price }}
          </div>
          <div>
            库存：{{ row.stock }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            创作者：<el-avatar size="small" style="vertical-align: bottom;margin-right: 5px" :src="row.author_avatar && domin + row.author_avatar" /> {{ row.author }}
          </div>
          <div>
            发行方：{{ row.issuer }}
          </div>
          <div>
            限购: {{ row.limit_num }}
          </div>
          <div>
            排序: {{ row.sort }}
          </div>
          <div>
            转赠：{{ row.give_time }}
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
        label="标签"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-tag v-for="(item, index) in row.tags" :key="index" effect="plain">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            创建：{{ row.created_at }}
          </div>
          <div>
            开售：{{ row.start_time }}
          </div>
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
      <el-table-column width="70" label="是否售罄" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.sell_out"
            :active-value="1"
            :inactive-value="0"
            @change="onChangeSellOut(row, 'sell_out')"
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
        width="160"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
          <el-button-group style="margin-top:10px">
            <el-button v-if="row.reserve_surplus_stock" plain type="primary" @click="onAirUpdate(row)">空投</el-button>
            <el-button v-if="row.reserve_stock > 0" plain type="primary" @click="onBoxLogs(row)">空投记录</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

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

    <!-- 弹窗, 操作空投 -->
    <airdrop-update
      v-if="airUpdateVisible"
      ref="airUpdate"
    />

    <!-- 弹窗, 预览图片 -->
    <box-airdrop-logs
      v-if="boxLogsVisible"
      ref="boxLogs"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dataList, deleteData, setStatus, addOrUpdate } from '@/api/box'
import { tagList } from '@/api/common'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'
import AirdropUpdate from './components/AirdropUpdate'
import { pickerOptions, whetherOptions } from '@/utils/explain'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import boxAirdropLogs from './components/boxAirdropLogs'

export default {
  name: 'Task',
  components: { AddOrUpdate, Pagination, Swiper, SwiperSlide, ElImageViewer, AirdropUpdate, boxAirdropLogs },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      pickerOptions,
      whetherOptions,
      tagsOptions: [],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      search: {
        keywords: '',
        start_time: '',
        end_time: '',
        tags: [],
        sellout: '',
        sync_status: '',
        sync_gwj_status: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      imageViewer: false,
      imageViewerList: [],
      dateRangeValue: [],
      list: [],
      addOrUpdateVisible: false,
      airUpdateVisible: false,
      boxLogsVisible: false,
      sync_status_options: [
        { label: '全部', value: '' },
        { label: '否', value: 1 },
        { label: '是', value: 0 }
      ]
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
      this.getTagList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit, tags: `${this.search.tags}` })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    getTagList() {
      tagList()
        .then(response => {
          this.tagsOptions.push(...response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          }))
        })
        .catch(() => {})
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
      addOrUpdate({ id: row.id, [name]: row[name] })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row[name] = row[name] ? 0 : 1
          this.$message.error(msg)
        })
    },
    prev(index) {
      this.swiper(index).slidePrev()
    },
    next(index) {
      this.swiper(index).slideNext()
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
    onDelete(row) {
      this.$confirm(`确定对[(#${row.id})(${row.name})]进行[删除]操作?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
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
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onAirUpdate(data) {
      this.airUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.airUpdate && this.$refs.airUpdate.init(data)
      })
    },
    onBoxLogs(data) {
      this.boxLogsVisible = true
      this.$nextTick(() => {
        this.$refs.boxLogs && this.$refs.boxLogs.init(data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.hot-tag {
  position: absolute;
  font-size: 36px;
  left: 0;
  top: 0;
}
</style>
