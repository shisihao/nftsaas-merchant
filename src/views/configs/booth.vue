<template>
  <div class="app-container">
    <el-form ref="imageForm" :model="form" :rules="rules" label-width="10px">
      <p>展台配置</p>
      <el-form-item prop="image">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img
            v-if="form.image"
            :src="domin + form.image"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">建议尺寸 750px * 1050px</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t("table.confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="preview">
      <p>效果预览</p>
      <div class="preview-content">
        <img class="preview_bg" src="@/assets/images/preview.png" alt="">
        <img v-if="form.image" class="preview_image" :src="domin + form.image" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import { getBackImage, setBackImage } from '@/api/configs'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Booth',
  components: { CustomUpload },
  data() {
    return {
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        image: ''
      },
      rules: {
        'image': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.init()
    console.log(this.domin)
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      getBackImage().then(({ data }) => {
        this.form.image = data.value
      })
    },
    onFormSubmit() {
      this.$refs['imageForm'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          setBackImage(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
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
    }
  }
}
</script>

  <style scoped>
  .el-input-number {
    width: 200px;
  }
  .notice {
    color: #909399;
    font-size: 12px;
  }
  .app-container {
    width: 800px;
    display: flex;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 287px;
    min-height: 369px;

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
  .preview {
    margin-left: 50px;
    position: relative;
  }
  .preview-content {
    position: relative;
    width: 350px;
    height: 700px;
    overflow: hidden;
  }
  .preview-content .preview_image {
    width: 346px;
    margin-left: 2px;
    border-radius: 65px;
  }
  .preview_bg {
    position: absolute;
    width: 350px;
    height: 700px;
  }
  </style>
