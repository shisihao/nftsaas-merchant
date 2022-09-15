<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="积分名称配置" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入积分名称"
          show-word-limit
          maxlength="10"
          clearable
        />
      </el-form-item>
      <el-form-item label="积分图片" prop="image">
        <custom-upload
          class-name="image-uploader"
          @handleBeforeUpload="beforeUpload"
          @handleSuccess="handleSuccess"
        >
          <img v-if="form.image" :src="domin + form.image" class="image">
          <i v-else class="el-icon-plus image-uploader-icon" />
        </custom-upload>
        <div class="notice">建议尺寸750px * 750px</div>
      </el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t("table.confirm") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getIntegralConfig, integralConfig } from '@/api/configs'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'
export default {
  name: 'IntegralName',
  components: { CustomUpload },
  data() {
    return {
      domin: getToken(DominKey),
      btnLoading: false,
      form: {
        name: '',
        image: ''
      },
      rules: {
        name: [
          { required: true, message: '积分名称不能为空', trigger: 'blur' }
        ]
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
    getList() {
      getIntegralConfig()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          integralConfig(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleSuccess(response, file) {
      this.form.image = response
    },
    beforeUpload(file, cb) {
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
.notice {
  color: #909399;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
.app-container {
  width: 400px;
}
.image-uploader >>> .el-upload {
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
.image-uploader .el-upload:hover {
  border-color: #409EFF;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.image {
  width: 100%;
  height: auto;
}
</style>
