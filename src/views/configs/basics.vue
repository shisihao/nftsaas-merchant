<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户等级默认图标" name="icon">
        <el-form ref="iconForm" :model="form" :rules="rules" label-width="10px">
          <el-form-item prop="icon.default_icon">
            <custom-upload
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <img v-if="form.icon.default_icon" :src="domin + form.icon.default_icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
            <div class="notice">
              建议尺寸 180px * 44px
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t('table.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="密钥配置" name="ant">
        <el-form ref="antForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="API key" prop="ant.key">
            <el-input v-model="form.ant.key" placeholder="API key" clearable />
          </el-form-item>
          <el-form-item label="密钥" prop="ant.secret">
            <el-input v-model="form.ant.secret" placeholder="密钥" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t('table.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="签名配置" name="sign">
        <el-form ref="signForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="签名" prop="sign.sign">
            <el-input v-model="form.sign.sign" :disabled="signDisabled" placeholder="签名" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t('table.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { icon, putIcon, ant, putAnt, sign, putSign } from '@/api/configs'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Basics',
  components: { CustomUpload },
  data() {
    return {
      btnLoading: false,
      domin: getToken(DominKey),
      activeName: 'icon',
      signDisabled: false,
      form: {
        icon: {
          default_icon: ''
        },
        ant: {
          key: '',
          secret: ''
        },
        sign: {
          sign: ''
        }
      },
      rules: {
        'icon.default_icon': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'ant.key': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'ant.secret': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'sign.sign': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
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
    handleClick(tab, event) {
      this.getList()
    },
    getList() {
      if (this.activeName === 'icon') {
        icon()
          .then(response => {
            this.form.icon.default_icon = response.data.value
          })
          .catch(() => {})
      } else if (this.activeName === 'ant') {
        ant()
          .then(response => {
            this.form.ant = response.data.value
          })
          .catch(() => {})
      } else if (this.activeName === 'sign') {
        sign()
          .then(response => {
            this.form.sign.sign = response.data.value
            if (response.data.value) {
              this.signDisabled = true
            }
          })
          .catch(() => {})
      }
    },
    onFormSubmit() {
      if (this.activeName === 'icon') {
        this.$refs['iconForm'].validate(valid => {
          if (valid) {
            this.btnLoading = true
            putIcon(this.form.icon)
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
      } else if (this.activeName === 'ant') {
        this.$refs['antForm'].validate(valid => {
          if (valid) {
            this.btnLoading = true
            putAnt(this.form.ant)
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
      } else if (this.activeName === 'sign') {
        this.$refs['signForm'].validate(valid => {
          if (valid) {
            this.btnLoading = true
            this.$confirm('确认后将不可更改, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              putSign(this.form.sign)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.getList()
                })
                .catch(() => {
                })
                .finally(() => {
                  this.btnLoading = false
                })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      }
    },
    handleAvatarSuccess(response, file) {
      this.form.icon.default_icon = response
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
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.app-container {
  width: 800px;
}
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
</style>
