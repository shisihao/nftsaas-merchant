<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="广告标识" prop="pos_id">
        <el-select v-model="form.pos_id" placeholder="请选择">
          <el-option
            v-for="item in posList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="广告类型" prop="url_type">
        <el-radio-group v-model="form.url_type">
          <el-radio :label="0">静态展示</el-radio>
          <el-radio :label="1">外链广告</el-radio>
          <el-radio :label="2">内联广告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.url_type !== 0 " label="广告链接" prop="url">
        <el-input v-model="form.url" :placeholder="'请输入广告链接, 如：'+ (form.url_type === 1 ? 'http://www.baidu.com' : 'goods|商品ID')" clearable />
      </el-form-item>
      <div v-if="form.url_type === 2" class="notice">
        注意：选择内联广告时，请用以下方式输入
        <div>1.跳转商品：goods|goods_id</div>
        <!--<div>2.申请代理：agency|0</div>
        <div>3.新手福利：novice|0</div>-->
      </div>
      <el-form-item label="广告海报" prop="image">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.image" :src="domin + form.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <p v-if="form.pos_id">
          建议尺寸{{ form.pos_id | paraphrase(posList, 'value', 'size') }}，点击图片可替换
        </p>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
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
</template>

<script>
import { addOrUpdate } from '@/api/ad'
import { DominKey, getToken } from '@/utils/auth'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    const validateUrl = (rule, value, callback) => {
      if (!value && [1, 2].includes(this.form.url_type)) {
        callback(new Error('请输入广告连接'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      posList: [],
      form: {
        id: 0,
        pos_id: '',
        image: '',
        url: '',
        url_type: 0,
        sort: 0
      },
      rules: {
        url: [
          { validator: validateUrl, trigger: ['blur', 'change'] }
        ],
        pos_id: [
          { required: true, message: '请选择广告标识', trigger: ['blur', 'change'] }
        ],
        image: [
          { required: true, message: '请上传广告海报', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data, options) {
      this.visible = true
      this.posList = options.slice(1)
      if (data) {
        if (data.stock) {
          this.form.id = 0
          this.form.image = data.image
          return false
        }
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          if ([0].includes(this.form.url_type)) {
            data.url = ''
          }

          addOrUpdate(data)
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
    handleAvatarSuccess(response, file) {
      this.form.image = response
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    },
    handleAvatarError(error) {
      if (JSON.parse(error.message).error.indexOf('token') !== -1) {
        this.$message.error('上传功能已失效，请重新登录')
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  min-height: 100px;

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
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  width: 100%;
  height: auto;
}
.notice {
  margin-left: 80px;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
}
</style>
