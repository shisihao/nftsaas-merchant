<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-divider content-position="left"><svg-icon icon-class="bank" /> 银行卡</el-divider>
      <el-form-item label="开户名" prop="account_name">
        <el-input v-model="form.account_name" placeholder="开户名" clearable />
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-input v-model="form.bank" placeholder="开户行" clearable />
      </el-form-item>
      <el-form-item label="开户号" prop="account_number">
        <el-input v-model="form.account_number" oninput="value=value.replace(/[^\d]/g,'')" show-word-limit maxlength="30" placeholder="开户号" @blur="salaryChange" />
      </el-form-item>
      <el-form-item v-if="false" label="附言码说明" prop="code_desc">
        <el-input v-model="form.code_desc" type="textarea" :rows="10" placeholder="附言码说明" clearable />
      </el-form-item>
      <!--      <el-divider content-position="left"><svg-icon icon-class="alipay" /> 支付宝</el-divider>
      <el-form-item label="支付宝账号" prop="alipay_account">
        <el-input v-model="form.alipay_account" placeholder="支付宝账号" clearable />
      </el-form-item>
      <el-form-item label="支付宝账号名称" prop="alipay_name">
        <el-input v-model="form.alipay_name" placeholder="支付宝账号名称" clearable />
      </el-form-item>
      <el-form-item label="支付宝收款码" prop="alipay_qrcode">
        <div @click="onHandleQrcode('alipay_qrcode')">
          <custom-upload
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.alipay_qrcode" :src="domin + form.alipay_qrcode" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
        </div>
      </el-form-item>
      <el-divider content-position="left"><svg-icon icon-class="wechat" /> 微信</el-divider>
      <el-form-item label="微信收款码" prop="wechat_qrcode">
        <div @click="onHandleQrcode('wechat_qrcode')">
          <custom-upload
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.wechat_qrcode" :src="domin + form.wechat_qrcode" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
        </div>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { receivable, putReceivable } from '@/api/configs'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Invite',
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value.length < 1 || value.length > 30) {
        callback(new Error('请输入1-30位开户号'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      domin: getToken(DominKey),
      currentType: 'alipay_qrcode',
      form: {
        account_name: '',
        bank: '',
        account_number: '',
        code_desc: '',
        alipay_account: '',
        alipay_name: '',
        alipay_qrcode: '',
        wechat_qrcode: ''
      },
      rules: {
        account_name: [
          { required: true, message: '开户名不能为空', trigger: ['blur', 'change'] }
        ],
        bank: [
          { required: true, message: '开户行不能为空', trigger: ['blur', 'change'] }
        ],
        account_number: [
          { required: true, message: '开户号不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: ['blur', 'change'] }
        ],
        code_desc: [
          { required: true, message: '附言码说明不能为空', trigger: ['blur', 'change'] }
        ]
        /* alipay_account: [
          { required: true, message: '支付宝账号不能为空', trigger: ['blur', 'change'] }
        ],
        alipay_name: [
          { required: true, message: '支付宝账号名称不能为空', trigger: ['blur', 'change'] }
        ],
        alipay_qrcode: [
          { required: true, message: '支付宝收款码图片地址不能为空', trigger: ['blur', 'change'] }
        ],
        wechat_qrcode: [
          { required: true, message: '微信收款码图片地址不能为空', trigger: ['blur', 'change'] }
        ]*/
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
      receivable()
        .then(response => {
          const data = {}
          this.form = Object.values(response.data).map(v => {
            Object.assign(data, v)
          })
          this.form = data
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putReceivable(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onHandleQrcode(type) {
      this.currentType = type
    },
    handleAvatarSuccess(response, file) {
      this.form[this.currentType] = response
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
    },
    salaryChange(e) {
      this.form.account_number = e.target.value
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
  width: 800px;
}
.avatar-uploader {
  width: 100px;
  min-height: 100px;
}
::v-deep .avatar-uploader .el-upload {
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
