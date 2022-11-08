<template>
  <div>
    <el-dialog width="1000px" top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="盲盒图片" prop="images">
          <div class="filter-list-box">
            <draggable v-model="form.images" v-bind="dragOptions" class="wrapper" @start="drag = true" @end="drag = false">
              <transition-group>
                <div v-for="(item, index) in form.images" :key="item" class="upload-images">
                  <div class="upload-image">
                    <el-image :src="item && domin + item" />
                  </div>
                  <div class="upload-actions">
                    <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                    <i class="el-icon-delete" @click="onPictureRemove(item,index)" />
                  </div>
                </div>
              </transition-group>
            </draggable><custom-upload
              v-show="form.images.length < 5"
              ref-name="images"
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <i slot="default" class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="notice">
            注意：建议海报尺寸 750*750px
          </div>
        </el-form-item>
        <el-form-item label="分类" prop="cate_id">
          <el-select v-model="form.cate_id" clearable>
            <el-option v-for="item in cateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="盲盒类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="常规" :value="0" />
            <el-option label="活动" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="资格券">
          <el-select v-model="form.condition_goods_id" clearable placeholder="(非必选)">
            <el-option v-for="(item, index) in conditionOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" clearable />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="form.tags" style="width: 100%;" multiple clearable>
            <el-option v-for="item in tagsOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="form.tags.length >= 3" />
          </el-select>
        </el-form-item>
        <el-form-item label="创作者头像" prop="author_avatar">
          <custom-upload
            ref-name="author_avatar"
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.author_avatar" :src="form.author_avatar && domin + form.author_avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
        </el-form-item>
        <el-form-item label="创作者名称" prop="author">
          <el-select v-model="form.author" :disabled="authorStatus" @change="onChangeAuthor">
            <el-option v-for="item in authorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="盲盒内容" prop="goods">
          <div v-if="form.goods && form.goods.length > 0" class="box-scroll">
            <div v-for="(item, index) in form.goods" :key="index">
              <span v-show="item.goods_id > 0">
                <el-tag type="primary">藏品</el-tag> <el-tag v-if="item.goodType" :type="item.goodType | paraphrase(typeOptions, 'value', 'type')">{{ item.goodType | paraphrase(typeOptions) }}</el-tag> <span class="box-name ellipsis">名称：{{ item.name }}</span> <span class="box-stock">库存：{{ item.stock }}</span><span class="box-stock">剩余：{{ item.stock - (item.sales_num || 0) }}</span>
              </span>
              <span v-show="item.goods_id === 0">
                <el-tag type="warning">{{ integral }}</el-tag> <span class="box-name ellipsis">数量：{{ item.integral_num }}</span><span class="box-stock">库存：{{ item.stock }}</span>
              </span>
              <i v-show="!form.id" class="el-icon-delete del-good" @click="onDelGood(index)" />
            </div>
          </div>
          <div v-if="[0, 1].includes(good.type)">
            <div v-if="good.type === 0" class="add-box">
              藏品：
              <el-select v-model="good.name" clearable @change="onChangeGood">
                <el-option v-for="v in goodsOptions" :key="v.value" :label="v.label" :value="v.value" :disabled="v.disabled || v.stock === 0">
                  <span style="float: left;max-width: 300px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ v.label }}</span>
                  <el-tag :type="v.type | paraphrase(typeOptions, 'value', 'type')"> {{ v.type | paraphrase(typeOptions) }} </el-tag>
                  <span style="float: right;margin-left: 10px;color: #8492a6;font-size: 13px">{{ v.stock }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-if="good.type === 1" class="add-box">
              {{ integral }}：
              <el-input-number v-model="good.integral_num" :min="0" :precision="2" :placeholder="`${integral}`" />
            </div>
            <div class="add-box">
              库存：
              <el-input-number v-model="good.stock" :min="0" :precision="0" placeholder="库存" />
            </div>
            <div class="add-box">
              <el-button type="primary" plain @click="onAddBoxItem">确定</el-button>
              <el-button @click="onCancelBoxItem">取消</el-button>
            </div>
          </div>
          <div v-else>
            <el-button v-show="!form.id" type="primary" plain @click="onAddBoxType(0)">+ 藏品</el-button>
            <el-button v-show="!form.id" type="warning" plain @click="onAddBoxType(1)">+{{ integral }}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" disabled :min="0" :precision="0" placeholder="库存" />
        </el-form-item>
        <el-form-item label="预留库存" prop="reserve_stock">
          <el-input-number v-model="form.reserve_stock" :disabled="!!form.id" :max="form.id?form.reserve_stock:form.stock" :precision="0" :min="0" :step="1" placeholder="请输入预留库存" />
        </el-form-item>
        <el-form-item label="开售时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="开售时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions0"
            clearable
          />
        </el-form-item>
        <el-form-item label="能否转赠" prop="give_status">
          <el-radio-group v-model="form.give_status">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转赠时间" prop="give_time">
          <el-date-picker v-model="form.give_time" type="datetime" placeholder="转赠时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" clearable />
        </el-form-item>
        <el-form-item label="是否同步奇藏果" prop="sync_status">
          <el-radio-group v-model="form.sync_status">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0" :disabled="form.sync_gwj_status===0">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否同步甘文交" prop="sync_gwj_status">
          <el-radio-group v-model="form.sync_gwj_status">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0" :disabled="form.sync_status===0">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="!form.id">
          <el-form-item label="发行方" prop="issuer">
            <el-input v-model="form.issuer" placeholder="发行方" clearable />
          </el-form-item>
          <el-form-item label="发行方头像" prop="issuer_avatar">
            <custom-upload
              ref-name="issuer_avatar"
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <img v-if="form.issuer_avatar" :src="form.issuer_avatar && domin + form.issuer_avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
          </el-form-item>
        </div>
        <el-form-item label="权益说明" prop="desc">
          <el-input v-model="form.desc" clearable type="textarea" placeholder="权益说明" :rows="3" />
        </el-form-item>
        <el-form-item label="人民币价格" prop="cny_price">
          <el-input-number v-model="form.cny_price" :min="0" :precision="2" placeholder="人民币价格" />
        </el-form-item>
        <el-form-item :label="`${integral}价格`" prop="integral_price">
          <el-input-number v-model="form.integral_price" :min="0" :precision="2" :placeholder="`${integral}价格`" />
        </el-form-item>
        <el-form-item label="限购数量" prop="limit_num">
          <el-input-number v-model="form.limit_num" :min="1" :precision="0" placeholder="限购数量" />
        </el-form-item>
        <el-form-item label="优先购库存" prop="prior_stock">
          <el-input-number v-model="form.prior_stock" :disabled="!!form.id" :precision="0" :min="0" :step="1" placeholder="请输入优先购库存" />
        </el-form-item>
        <el-form-item label="是否预告" prop="is_pre">
          <el-radio-group v-model="form.is_pre">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖" prop="is_hot">
          <el-radio-group v-model="form.is_hot">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="详情说明" prop="detail">
          <el-link type="primary" :underline="false" @click="onTinymce(form)">点击编辑</el-link>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />
    <edit-tinymce
      v-if="editTinymceVisible"
      ref="editTinymce"
      @info="onInfo"
    />
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate, authorList, goodsList, details } from '@/api/box'
import { tagList, boxCategoryList } from '@/api/common'
import CustomUpload from '@/components/Upload/CustomUpload'
import draggable from 'vuedraggable'
import EditTinymce from './EditTinymce'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { typeOptions, pickerOptions } from '@/utils/explain'
import { conditionList } from '@/api/collection'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, EditTinymce, draggable, ElImageViewer },
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions,
      visible: false,
      btnLoading: false,
      drag: false,
      domin: getToken(DominKey),
      authorOptions: [],
      tagsOptions: [],
      goodsOptions: [],
      cateOptions: [],
      typeOptions: typeOptions.slice(1),
      imageViewer: false,
      imageViewerList: [],
      conditionOptions: [],
      authorStatus: false,
      editTinymceVisible: false,
      currentName: '',
      good: {
        name: '',
        type: '',
        goodType: '',
        integral_num: 0,
        goods_id: 0,
        stock: 0,
        max_stock: 0
      },
      form: {
        id: 0,
        cate_id: '',
        name: '',
        author: '',
        author_avatar: '',
        issuer_avatar: '',
        type: '',
        issuer: '',
        desc: '',
        detail: '',
        start_time: new Date(),
        condition_goods_id: '',
        images: [],
        cny_price: 0,
        limit_num: '',
        stock: 0,
        reserve_stock: 0,
        prior_stock: 0,
        goods: [],
        sales_num: 0,
        tags: [],
        is_pre: 0,
        is_hot: 0,
        status: 0,
        sync_status: 1,
        sync_gwj_status: 1,
        sort: 0,
        give_status: 0,
        give_time: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        author_avatar: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        issuer: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cate_id: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        images: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cny_price: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        limit_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        stock: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        goods: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        tags: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        is_pre: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        reserve_stock: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        prior_stock: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        issuer_avatar: [
          { required: true, message: '请选择发行方头像', trigger: ['blur', 'change'] }
        ],
        give_status: [{ required: true, message: '请选择能否转赠', trigger: ['blur', 'change'] }],
        sync_status: [{ required: true, message: '请选择是否同步', trigger: ['blur', 'change'] }],
        sync_gwj_status: [{ required: true, message: '请选择是否同步', trigger: ['blur', 'change'] }]
      }
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
    'form.goods'(newData) {
      this.goodsOptions.forEach((v, i) => {
        const isGood = newData.some(x => v.value === x.goods_id && x.goods_id > 0)
        if (isGood) {
          this.goodsOptions[i].disabled = true
        } else {
          this.goodsOptions[i].disabled = false
        }
      })
      this.authorStatus = newData.some(v => v.goods_id > 0)
      if (newData.length > 0) {
        const _field = this.$refs['form'].fields
        _field.map(i => {
          if (i.prop === 'goods') {
            i.clearValidate()
            return false
          }
        })
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getAuthorList()
      this.boxCategory()
      this.getTagList()
      this.conditionLists()
      if (data) {
        this.form.id = data.id
        this.form.sales_num = data.sales_num
        Promise.all([this.getDetails()])
          .then(() => {
            this.getGoodsList()
              .then(() => {
                this.form.goods.forEach((v, i) => {
                  const data = this.goodsOptions.find(x => v.goods_id === x.value)
                  const index = this.goodsOptions.findIndex(x => v.goods_id === x.value)
                  if (data && index > -1) {
                    this.goodsOptions[index].disabled = true
                    this.$set(this.form.goods[i], 'name', data.label)
                  }
                })
              })
          })
      }
    },
    async getDetails() {
      await details(this.form.id)
        .then(response => {
          this.form = Object.assign(response.data, { tags: response.data.tags.map(v => v.id) })
        })
        .catch(() => {})
    },
    getAuthorList() {
      authorList()
        .then(response => {
          this.authorOptions = response.data.map(v => {
            return {
              label: v,
              value: v
            }
          })
        })
        .catch(() => {})
    },
    conditionLists() {
      conditionList().then(response => {
        this.conditionOptions = response.data.map(v => {
          return {
            label: v.name,
            value: v.id
          }
        })
      })
    },
    boxCategory() {
      boxCategoryList()
        .then(response => {
          this.cateOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          })
        })
        .catch(() => {})
    },
    async getGoodsList() {
      await goodsList({ author: this.form.author })
        .then(response => {
          this.goodsOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id,
              stock: v.stock,
              type: v.type,
              disabled: false
            }
          })
        })
        .catch(() => {})
    },
    getTagList() {
      tagList()
        .then(response => {
          this.tagsOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          })
        })
        .catch(() => {})
    },
    onChangeAuthor() {
      this.getGoodsList()
      this.onCancelBoxItem()
    },
    onChangeGood(id) {
      const item = this.goodsOptions.find(v => {
        return v.value === id
      })
      this.good.name = item.label
      this.good.goods_id = item.value
      this.good.stock = item.stock
      this.good.max_stock = item.stock
      this.good.goodType = item.type
    },
    addStock() {
      this.form.stock = 0
      this.form.goods.forEach(v => {
        this.form.stock += v.stock
      })
    },
    onAddBoxType(type) {
      this.good.type = type
    },
    onAddBoxItem() {
      if (this.good.type === 0) {
        if (this.good.stock > this.good.max_stock) {
          this.$message.warning('库存不能大于藏品库存')
          return false
        }
      }
      if (this.good.type === 1) {
        if (this.form.goods.some(v => parseFloat(this.good.integral_num) === parseFloat(v.integral_num))) {
          this.$message.warning('不能重复添加')
          return false
        }
        if (this.good.integral_num <= 0) {
          this.$message.warning(`${this.integral}数量必须大于 0`)
          return false
        }
      }
      /* if (this.good.stock <= 0) {
        this.$message.warning('库存必须大于 0')
        return false
      } */
      this.form.goods.push(this.good)
      this.addStock()
      this.onCancelBoxItem()
    },
    onCancelBoxItem() {
      this.good = Object.assign({}, this.$options.data.call(this).good)
    },
    onDelGood(index) {
      this.form.goods.splice(index, 1)
      this.addStock()
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    onPictureRemove(img, index) {
      this.form.images.splice(index, 1)
    },
    closeViewer() {
      this.imageViewer = false
    },
    onClose() {
      this.$reset()
    },
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    onInfo(value) {
      this.form.detail = value
    },
    handleAvatarSuccess(response, file) {
      console.log(response)
      if (this.currentName === 'images') {
        this.form[this.currentName].push(response)
      } else {
        this.form[this.currentName] = response
      }
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  display: inline-block;
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
::v-deep .filter-list-box {
  .wrapper {
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
    .upload-image {
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
      & > img {
        width: 100%;
      }
    }
    .upload-actions {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0,0,0,0.5);
      text-align: center;
      display: none;
      i {
        margin-left: 6px;
        margin-top: 6px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    &:hover .upload-actions {
      display: block;
    }
    .upload-actions i {
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    .err-image {
      width: 100px;
      height: 100px;
      border: 1px solid #c0ccda;
      background: #f5f7fa;
      border-radius: 6px;
      .el-image{
        margin-left: 35px;
        margin-top: 35px;
      }
      img {
        height: auto;
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
    }
  }
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.del-good {
  margin-left: 10px;
  color: #f56c6c;
  cursor: pointer;
}
.add-box {
  display: inline-block;
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
}
.box-name {
  display: inline-block;
  vertical-align: middle;
  width: 300px;
}
.box-stock {
  display: inline-block;
  min-width: 100px;
}
.el-input-number {
  width: 200px;
}
.el-textarea ::v-deep .el-input__count {
  background-color: transparent;
}
.box-scroll {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px 10px;
}
</style>
