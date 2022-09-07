<template>
  <div>
    <el-dialog
      width="800px"
      top="30px"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="封面图" prop="cover.filename">
          <custom-upload
            v-if="!form.id"
            class-name="avatar-uploader"
            ref-name="cover"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleCoverSuccess"
          >
            <img
              v-show="form.cover.filename"
              :src="form.cover.filename && domin + form.cover.filename"
              class="avatar"
            >
            <i
              v-show="!form.cover.filename"
              class="el-icon-plus avatar-uploader-icon"
            />
          </custom-upload>
          <div v-else>
            <img
              v-show="form.cover.filename"
              :src="form.cover.filename && domin + form.cover.filename"
              class="avatar"
            >
          </div>
          <div class="notice">
            注意：建议藏品图片尺寸 750*750px
          </div>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" :disabled="!!form.id" placeholder="活动名称" />
        </el-form-item>
        <el-form-item label="活动类型" prop="target_type">
          <el-select v-model="form.target_type" clearable :disabled="!!form.id" @change="changeTargetType">
            <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <div v-if="form.target_type">
          <el-form-item label="目标商品" prop="target_id">
            <el-select
              v-model="form.target_id"
              filterable
              clearable
              :disabled="!!form.id"
            >
              <el-option
                v-for="item in activitiesOptions"
                :key="item.value"
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
        </div>
        <el-form-item label="活动时间" prop="dateRangeValue">
          <el-date-picker
            v-model="form.dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :disabled="!!form.id"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-form-item label="开奖时间" prop="open_time">
          <el-date-picker
            v-model="form.open_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开奖时间"
            :picker-options="pickerOptions0"
            :disabled="!!form.id"
            clearable
          />
        </el-form-item>
        <el-form-item label="中奖人数" prop="num">
          <el-input-number v-model="form.num" :precision="0" :min="0" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="报名价格" prop="integral_price">
          <el-input-number v-model="form.integral_price" :precision="2" :min="0" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio-group v-model="form.show_status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="10" placeholder="规则说明" style="width: 600px" clearable />
        </el-form-item>
        <el-form-item label="活动详情" prop="detail">
          <el-link
            type="primary"
            :underline="false"
            @click="onTinymce(form)"
          >
            点击编辑
          </el-link>
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
    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate, activitiesList } from '@/api/draw'
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { pickerOptions } from '@/utils/explain'
import { parseDate } from '@/utils'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, EditTinymce },
  data() {
    const validateTime = (rule, value, callback) => {
      if (Date.parse(this.form.end_time) - Date.parse(this.form.open_time) > 0) {
        callback(new Error('开奖时间必须在活动结束时间之后'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey),
      pickerOptions,
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      typeOptions: [
        { label: '盲盒', value: 'box' },
        { label: '藏品', value: 'goods' }
      ],
      currentName: '',
      activitiesOptions: [],
      form: {
        id: 0,
        name: '',
        cover: {
          filename: '',
          height: 0,
          width: 0,
          mime: ''
        },
        sort: 0,
        show_status: 0,
        dateRangeValue: [],
        target_id: '',
        start_time: '',
        end_time: '',
        open_time: '',
        target_type: '',
        num: 0,
        integral_price: 0,
        desc: '',
        detail: ''
      },
      rules: {
        'cover.filename': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        target_type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        dateRangeValue: [
          { required: true, message: '请选择时间', trigger: ['blur', 'change'] }
        ],
        open_time: [
          { required: true, message: '请选择开奖时间', trigger: ['blur', 'change'] },
          { validator: validateTime, trigger: ['blur', 'change'] }
        ],
        num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        integral_price: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        target_id: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.activitiesOptions = [{
          label: data.goods.name,
          value: data.goods.id,
          image: data.goods.images && data.goods.images[0]
        }]
        this.form = Object.assign(JSON.parse(JSON.stringify(data)), {
          dateRangeValue: [
            parseDate(data.start_time),
            parseDate(data.end_time)
          ]
        })
      }
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.start_time = value[0]
        this.form.end_time = value[1]
      } else {
        this.form.start_time = this.form.end_time = ''
      }
    },
    changeTargetType() {
      this.form.target_id = ''
      activitiesList({ target_type: this.form.target_type })
        .then((response) => {
          this.activitiesOptions = response.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
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
    handleCoverSuccess(response, file) {
      this.form[this.currentName].filename = response
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

      new Promise(function(resolve, reject) {
        const _URL = window.URL || window.webkitURL
        const image = new Image()
        image.onload = function() {
          resolve({
            width: image.width,
            height: image.height
          })
        }
        image.onerror = function() {
          reject()
        }
        image.src = _URL.createObjectURL(file)
      })
        .then((response) => {
          this.form.cover.width = response.width
          this.form.cover.height = response.height
        })
        .catch(() => {})

      this.form.cover.mime = file.type
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
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: contain;
}
.good-img {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  vertical-align: middle;
  flex-shrink: 0;
}
.select-input {
  margin-right: 10px;
  width: 490px;
}
.add-box {
  display: inline-block;
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
}
.timeline-box {
  line-height: 1.5;
  .el-timeline {
    padding-left: 0px;
    ::v-deep .el-card__body {
      padding: 10px;
      position: relative;
      .close {
        position: absolute;
        right: 5px;
        top: 5px;
        font-size: 16px;
        cursor: pointer;
      }
      .good-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
        span {
          padding: 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          span {
            vertical-align: middle;
          }
        }
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
.el-input-number {
  width: 200px;
}
</style>
