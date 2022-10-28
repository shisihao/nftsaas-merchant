<template>
  <div v-loading="loading">
    <el-form-item
      label="商品分类"
      prop="c_id"
    >
      <el-cascader
        v-model="cateValue"
        :options="cateOptions"
        :props="options"
        @change="handleCateChange"
      />
    </el-form-item>

    <el-form-item label="商品名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入商品名称" clearable />
    </el-form-item>
    <el-form-item label="供应商" prop="supplier">
      <el-input v-model="form.supplier" placeholder="请输入供应商" clearable />
    </el-form-item>
    <el-form-item label="运费模板" prop="delivery_id">
      <el-select v-model="form.delivery_id" clearable placeholder="选择运费模板">
        <el-option v-for="item in deliveryOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="专区分类" prop="cate_id">
      <el-select v-model="form.cate_id" clearable placeholder="专区分类">
        <el-option
          v-for="(item, index) in shopCateOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.cate_id" label="商品类型" prop="type">
      <el-select v-model="form.type" clearable placeholder="商品类型" @change="changeShopType">
        <el-option
          v-for="(item, index) in shopTypeOptions"
          :key="index"
          :disabled="form.cate_id===3&&item.value==='voucher'||form.cate_id===1&&['voucher','commodity'].includes(item.value)||form.cate_id===2&&item.value==='commodity'"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="指定藏品" prop="condition_goods">
      <el-select v-model="form.condition_goods" style="width: 100%;" multiple filterable placeholder="请选择指定藏品" :filter-method="filterMethodSelect" no-data-text="请输入关键字搜索">
        <el-option
          v-for="(item, index) in newGoodsOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
          <span>#{{ item.value }}</span>
          <el-image
            class="good-img"
            fit="cover"
            :src="item.image && domin + item.image"
          />
          <span>
            {{ item.label }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <div class="notice">
      注意：专区分类为专属专区，必须选择指定藏品
    </div>
    <div v-if="form.type === 'common'">
      <el-form-item v-if="form.cate_id!==3" label="人民币价格" prop="cny_price">
        <el-input-number v-model="form.cny_price" controls-position="right" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="`${integral}价格`" prop="integral_price">
        <el-input-number v-model="form.integral_price" controls-position="right" :precision="2" :min="0" />
      </el-form-item>
    </div>
    <div v-else-if="form.type==='commodity'">
      <el-form-item label="商品劵数量" prop="commodity_price">
        <el-input-number v-model="form.commodity_price" controls-position="right" :precision="0" :min="0" />
      </el-form-item>
    </div>
    <div v-else-if="form.type === 'voucher'">
      <el-form-item label="兑换藏品数量" prop="goods_num">
        <el-input-number v-model="form.goods_num" controls-position="right" :precision="0" :min="0" />
      </el-form-item>
      <el-form-item label="是否销毁" prop="is_destroy">
        <el-radio-group v-model="form.is_destroy">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item v-if="form.type==='common'" label="等级折扣" prop="grade">
      <div v-for="(item,index) in form.grade" :key="index">
        等级：
        <el-tag type="warning">{{ item.grade_id | paraphrase(levelOptions,'id','name') }} </el-tag>
        <el-divider direction="vertical" />
        折扣：<el-tag type="warning"> {{ item.discount }}</el-tag>
        <i class="el-icon-delete" @click="onDeleteLevel(index)" />
      </div>
      <div v-if="gradeFlag">
        <el-button type="primary" plain @click="onAddElevelBtn">点击添加</el-button>
      </div>
      <div v-else style="margin-top:10px">
        等级：
        <el-select v-model="level.grade_id" placeholder="请选择等级">
          <el-option
            v-for="leveltem in levelOptions"
            :key="leveltem.id"
            :label="leveltem.name"
            :value="leveltem.id"
          />
        </el-select>
        折扣：
        <el-input-number v-model="level.discount" placeholder="请输入内容" controls-position="right" :precision="0" />
        <el-button type="primary" plain style="margin-left:10px" @click="onAddLeveItem()">确定</el-button>
        <el-button type="info" plain @click="onCancelLeveItem()">取消</el-button>
        <div class="discount-notice">
          注意：折扣范围 1-100 ，输入88代表8.8折
        </div>
      </div>
    </el-form-item>

    <el-form-item label="限购数量" prop="limit_num">
      <el-input-number v-model="form.limit_num" controls-position="right" :precision="0" :min="1" />
    </el-form-item>
    <el-form-item label="单次限购数量" prop="single_limit_num">
      <el-input-number v-model="form.single_limit_num" controls-position="right" :precision="0" :min="1" />
    </el-form-item>
    <el-form-item label="默认等级折扣" prop="default_rebate">
      <el-input-number v-model="form.default_rebate" controls-position="right" :precision="0" :min="0" :max="100" />
    </el-form-item>
    <el-form-item label="首页专区" prop="is_home">
      <el-radio-group v-model="form.is_home">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="开售时间" prop="start_time">
      <el-date-picker
        v-model="form.start_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="开售时间"
        :picker-options="pickerOptions0"
        clearable
      />
    </el-form-item>
    <el-form-item label="平台logo" prop="market_icon">
      <custom-upload
        class-name="avatar-uploader"
        @handleBeforeUpload="beforeAvatarUpload"
        @handleSuccess="handleAvatarSuccess"
      >
        <img v-if="form.market_icon" :src="domin + form.market_icon" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </custom-upload>
    </el-form-item>
    <div class="notice">注意：建议图片尺寸 64*64px</div>
    <el-form-item v-if="form.market_icon" label="划线价格" prop="market_price">
      <el-input-number v-model="form.market_price" placeholder="请输入" :precision="2" :min="0" controls-position="right" />
    </el-form-item>
    <div class="more">
      <el-form-item label="商品图片" prop="images">
        <div class="filter-list-box">
          <draggable
            v-model="form.images"
            v-bind="dragOptions"
            class="wrapper"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group>
              <div v-for="(item, index) in form.images" :key="item" class="upload-images">
                <div class="upload-image">
                  <el-image :src="item && domin + item" />
                </div>
                <div class="upload-actions">
                  <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                  <i class="el-icon-delete" @click="onPictureRemove(item, index)" />
                </div>
              </div>
            </transition-group>
          </draggable>
          <custom-upload
            class-name="avatar-uploader"
            accept="image/*"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccesses"
          >
            <i slot="default" class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
        </div>
      </el-form-item>
      <div class="notice">
        注意：商品主图尺寸建议为 750x750px ,你可以拖拽图片调整顺序
      </div>
    </div>
    <el-form-item label="商品简介" prop="desc">
      <el-input
        v-model="form.desc"
        type="textarea"
        show-word-limit
        clearable
        maxlength="100"
        placeholder="商品简介"
      />
    </el-form-item>

    <el-divider content-position="left">其他设置</el-divider>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="form.sort" controls-position="right" :precision="0" :min="0" />
    </el-form-item>
    <!-- <el-form-item label="是否包邮" prop="is_postage">
      <el-radio-group v-model="form.is_postage">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item> -->

    <el-image-viewer
      v-if="imageViewer.visible"
      :z-index="3000"
      :on-close="onCloseViewer"
      :url-list="imageViewer.list"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken, DominKey } from '@/utils/auth'
import draggable from 'vuedraggable'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import CustomUpload from '@/components/Upload/CustomUpload'
import { filterDelivery, goodsCategoryList } from '@/api/common'
import { conditionGoodsList } from '@/api/shop'
import { shopCateOptions, shopTypeOptions } from '@/utils/explain'
import { gradeList } from '@/api/interest'
export default {
  name: 'ShopStep1',
  components: { CustomUpload, draggable, ElImageViewer },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          name: '',
          cate_id: '',
          type: '',
          supplier: '',
          commodity_price: 0,
          goods_num: 1,
          single_limit_num: 1,
          is_destroy: 0,
          condition_goods: [],
          desc: '',
          start_time: '',
          cny_price: 0,
          integral_price: 0,
          limit_num: 0,
          images: [],
          sort: 0,
          is_postage: 1,
          grade: []
        }
      }
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey),
      shopCateOptions: shopCateOptions.slice(1),
      shopTypeOptions: shopTypeOptions.slice(1),
      cateOptions: [],
      goodsOptions: [],
      newGoodsOptions: [],
      deliveryOptions: [],
      imageViewer: {
        visible: false,
        list: []
      },
      options: {
        children: 'next_cate',
        value: 'id',
        label: 'name',
        checkStrictly: true
      },
      cateValue: [],
      levelOptions: [],
      loading: false,
      level: {
        grade_id: '',
        discount: 1
      },
      gradeFlag: true
    }
  },
  computed: {
    ...mapGetters(['integral']),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    form(newVal) {
      this.cateValue = [this.form.c_id, this.form.sub_id]
    }
  },
  created() {
    this.init()
  },

  methods: {
    init() {
      this.getPowerCategory()
      this.getPowerGood()
      this.getLevelList()
      this.getDelivery()
    },
    getDelivery() {
      filterDelivery().then(response => {
        this.deliveryOptions = response.data.map(v => {
          return { label: v.name, value: v.id }
        })
      }).catch(() => {})
    },
    getPowerCategory() {
      goodsCategoryList()
        .then(response => {
          this.cateOptions = response.data
        })
        .catch(() => {})
    },
    getPowerGood() {
      conditionGoodsList()
        .then(response => {
          this.goodsOptions = response.data?.condition_goods.map(v => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })
        })
        .catch(() => { })
    },
    getLevelList() {
      gradeList()
        .then(response => {
          this.levelOptions = response.data
        }
        ).catch(() => { })
    },
    filterMethodSelect(val) {
      if (val) {
        this.newGoodsOptions = this.goodsOptions.filter(v => v.label.indexOf(val) !== -1)
      } else {
        this.newGoodsOptions = []
      }
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return false
      }
      cb(true)
    },
    handleAvatarSuccesses(response, file) {
      this.form.images.push(response.name)
    },
    handleAvatarSuccess(response, file) {
      this.form.market_icon = response.name
    },
    onPicturePreview(img) {
      this.imageViewer.list = [this.domin + img]
      this.imageViewer.visible = true
    },
    onCloseViewer() {
      this.imageViewer.visible = false
    },
    onPictureRemove(img, index) {
      this.form.images.splice(index, 1)
    },
    onAddElevelBtn() {
      if (this.form.grade === null) {
        this.form.grade = []
      }
      this.gradeFlag = !this.gradeFlag
    },
    onAddLeveItem() {
      if (!this.level.grade_id) {
        this.$message.warning('请选择等级')
        return false
      }
      if (this.form.grade && this.form.grade.some(v => v.grade_id === this.level.grade_id)) {
        this.$message.warning('不能重复添加')
        return false
      }
      this.form.grade.push(this.level)
      this.onCancelLeveItem()
      this.gradeFlag = !this.gradeFlag
    },
    onCancelLeveItem() {
      this.level = Object.assign({}, this.$options.data.call(this).level)
      this.gradeFlag = !this.gradeFlag
    },
    onDeleteLevel(index) {
      this.form.grade.splice(index, 1)
    },
    changeShopType() {
      this.form.skus.forEach(v => {
        v.commodity_price = 0
        v.cny_price = 0
        v.integral_price = 0
        v.goods_num = 0
      })
    },
    handleCateChange(val) {
      this.form.c_id = val[0]
      this.form.sub_id = val[1] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .good-img {
    width: 30px;
    margin-left: 5px;
    height: 30px;
    vertical-align: middle;
    flex-shrink: 0;
  }

.discountNotice {
  color: #ff0000;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
.avatar-uploader {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
    .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
.goodsPoster .avatar-uploader {
  height: auto;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
::v-deep .el-dialog {
  width: 1000px;
}

::v-deep .filter-list-box .wrapper {
  display: inline;
  vertical-align: top;
}

.upload-images {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  margin: 0 8px 8px 0;
  display: inline-block;
  position: relative;
  cursor: grabbing;
}
#avatar {
  width: 100px;
  height: auto;
}
.more .upload-images .upload-image {
  width: 100%;
  height: 100%;
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
.upload-images .upload-image > img {
  width: 100%;
}
.upload-images .upload-actions {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  display: none;
  i {
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.upload-images:hover .upload-actions {
  display: block;
}
.upload-images .upload-actions i {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 110px;
}
.notice span {
  color: #e6a23c;
}
.discount-notice{
    color: #909399;
  font-size: 12px;
    margin-top: 10px;
  margin-left: 230px;
}
.el-icon-delete{
  cursor: pointer;
  margin-left: 15px;
font-size: 16px;
color: red;
}
</style>
