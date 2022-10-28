<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="订单号:">
          <el-input v-model="search.order_no" placeholder="请输入订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="收货人:">
          <el-input v-model="search.consignee_name" placeholder="昵称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="时间:">
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
        <el-form-item label="申请状态:" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="small" @change="onChangeStatus">
            <el-badge v-for="item in handleOptions" :key="item.value" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
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
        label="商品信息"
        width="300"
        header-align="center"
      >
        <template slot-scope="{ row:{entity_goods_order:{goods_order}}}">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              fit="cover"
              :src="(goods_order.sku ? goods_order.sku.image : goods_order.goods_image) && domin + (goods_order.sku ? goods_order.sku.image : goods_order.goods_image)"
              :preview-src-list="[`${domin}${goods_order.sku ? goods_order.sku.image : goods_order.goods_image}`]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="info-box" style="margin-left:10px">
              <div class="goods-name">
                <span>
                  {{ goods_order.goods_name }}
                </span>
              </div>
              <div class="goods-properties">
                规格：{{ goods_order.sku ? goods_order.sku.properties.join('/') : '无规格' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户信息"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-avatar icon="el-icon-user-solid" :src="row.user ? (row.user.avatar ? domin + row.user.avatar : '') : ''" />
          <div v-if="row.user" style="display: inline-block;margin-left: 10px;vertical-align: top;">
            <div>#{{ row.user.id || '-' }}</div>
            <div>{{ row.user.name || '-' }}</div>
            <div>{{ row.user.phone | cancelPhone }}</div>
          </div>
          <div v-else style="text-align: center"> - </div>
        </template>
      </el-table-column>

      <el-table-column
        label="收货人信息"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>收货人：{{ row.consignee_name || '-' }}</div>
          <div>电话：{{ row.consignee_phone || '-' }}</div>
          <div>地址：{{ row.consignee_address || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="退货原因"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>{{ row.reason }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="images"
        label="退货凭证"
        width="291"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div class="recommendPage">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item, index) in row.images" :key="index" class="images-list">
                <template v-if="item">
                  <el-image
                    class="image-item"
                    fit="contain"
                    :src="item.filename && domin + item.filename"
                    @click="onPicturePreview(row.images, index)"
                  />
                </template>
              </swiper-slide>
              <div v-if="Array.isArray(row.images) && row.images.length > 3" slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
              <div v-if="Array.isArray(row.images) && row.images.length > 3" slot="button-next" class="swiper-button-next" @click="next($index)" />
            </swiper>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="退款金额(元)"
        width="100"
        align="center"
        prop="cny_price"
      />
      <el-table-column
        label="商品劵"
        width="100"
        align="center"
        prop="commodity_price"
      />
      <el-table-column
        :label="integral"
        width="100"
        align="center"
        prop="integral_price"
      />
      <el-table-column
        prop="sort"
        label="申请状态"
        width="100"
        align="center"
      >
        <template slot-scope="{ row: { status, reason } }">
          <div v-if="status === 3" style="cursor:pointer">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(handleOptions, 'value', 'type')"> {{ status | paraphrase(handleOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(handleOptions, 'value', 'type')"> {{ status | paraphrase(handleOptions) }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button v-if="row.status === 1 && row.logistics_status === 1" type="danger" @click="onSure(row)">确认收货</el-button>
          <div v-if="[0].includes(row.status)">
            <el-button type="success" @click="onAddOrUpdate(row)">通过</el-button>
            <el-button type="danger" @click="onFormSubmit(row,3)">驳回</el-button>
          </div>
          <el-button v-else @click="onReturn(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <pending-update
      v-if="pendingVisible"
      ref="pendingUpdate"
      @refreshList="getList(1)"
    />
    <el-image-viewer
      v-if="imageViewer"
      :on-close="onCloseViewer"
      :url-list="imageViewerList"
    />
    <!-- 弹窗, 同意 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList(1)"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { pickerOptions, handleOptions } from '@/utils/explain'
import { dataList, refundSuccess, refundAudit } from '@/api/orderRefund'
import Pagination from '@/components/Pagination/index'
import PendingUpdate from './components/PendingUpdate'
import { DominKey, getToken } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import AddOrUpdate from './components/AddOrUpdate'

export default {
  name: 'OrderRefund',
  components: { AddOrUpdate, Pagination, PendingUpdate, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      domin: getToken(DominKey),
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      pendingVisible: false,
      dateRangeValue: [],
      list: [],
      search: {
        order_no: '',
        keywords: '',
        status: '',
        start_time: '',
        end_time: '',
        consignee_name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      imageViewer: false,
      imageViewerList: [],
      handleOptions: [{ label: '全部', value: '', type: '' }].concat(handleOptions),
      pickerOptions,
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
  watch: {
    '$route.params': {
      handler(val, oldval) {
        this.search.order_no = val.id || ''
      },
      immediate: true
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
    onFormSubmit(row, status) {
      this.$prompt(`用户「${row.user.name}」退货`, '拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: 'error',
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const data = Object.assign({ order_refund_id: row.id, explain: row.explain, status })
          refundAudit(Object.assign({ reject: value }, data))
            .then(() => {
              this.$message.success('已拒绝退货')
              this.visible = false
              this.getList(1)
            })
            .catch(error => {
              this.$message.error(error.msg)
            }).finally(() => {
              this.btnLoading = true
              this.onClose()
            })
        })
        .catch(() => {})
    },
    onChangeStatus(value) {
      this.getList(1)
    },
    onSure(row) {
      this.$confirm(
        `退回的商品订单「${row.entity_goods_order.order_no}」确认收货？`, '确认收货',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          refundSuccess({ order_refund_id: row.id })
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.getList(1)
            })
        })
        .catch(() => {})
    },
    onReturn(data) {
      this.pendingVisible = true
      this.$nextTick(() => {
        this.$refs.pendingUpdate && this.$refs.pendingUpdate.init(data)
      })
    },
    onAddOrUpdate(data) {
      if ([1].includes(data.entity_goods_order.status)) {
        this.$confirm(
          `同意退回商品订单「${data.entity_goods_order.order_no}」？`, '同意',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel'
          }
        )
          .then(() => {
            refundAudit({ order_refund_id: data.id, status: 1, consignee_name: data.consignee_name, consignee_phone: data.consignee_phone, consignee_address: data.consignee_address, explain: data.explain })
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.getList(1)
              })
          })
          .catch(() => {})
      } else {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
        })
      }
    },
    onPicturePreview(imgArr, index) {
      const newImgArr = imgArr.concat()
      const currentItemArr = newImgArr.slice(index, index + 1)
      newImgArr.splice(index, 1)
      const currentArr = currentItemArr.concat(newImgArr).map(v => {
        return this.domin + v.filename
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
.info-wrapper {
  display: flex;
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    // img {
    //   height: unset;
    // }
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
  }
  .info-box{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
}
::v-deep .image-item {
  width: 60px;
  height: 60px;
  float: left;

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
::v-deep .el-table th {
  user-select: auto;
}
.order-table {
  margin-top: 20px;
}
.order-table .el-button + .el-button {
  margin-left: 0;
}
::v-deep .grid-content {
  color: #606266;
  font-size: 14px;
}
::v-deep .item .el-badge__content {
  transform: translateY(-50%) translateX(50%);
  z-index: 1;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
  border-left: 0;
}
::v-deep .item:first-child .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
}
::v-deep .item:last-child .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
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
.recommendPage .swiper-button-prev,
.recommendPage .swiper-button-next {
  display: none;
  pointer-events: auto;
}
.recommendPage .swiper-button-prev {
  left: 0;
}
.recommendPage .swiper-button-next {
  right: 0;
}
.recommendPage .swiper-button-prev::after,
.recommendPage .swiper-button-next::after {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.recommendPage:hover .swiper-button-prev,
.recommendPage:hover .swiper-button-next {
  display: block;
}
</style>
