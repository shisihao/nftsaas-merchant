<template>
  <el-dialog
    title="谷歌验证"
    width="800px"
    top="30px"
    center
    :close-on-click-modal="data.type !== 1"
    :close-on-press-escape="data.type !== 1"
    :show-close="data.type !== 1 || (data.type === 1 && !data.url)"
    :visible.sync="authenticatorVisible"
  >

    <div>
      <h3>如何使用谷歌验证器？</h3>
      <p>
        <b>第一步</b>，下载并安装谷歌身份验证器（Google Authenticator）。苹果手机App Store下载即可，国内安卓手机没有 Google Play，有条件的朋友尽量安装 Google Play 后下载，若实在没有办法，则在本手机自带品牌应用商店（如小米应用商店）或者其它知名第三方应用商店（如腾讯的应用宝、360手机助手等）下载，安全性较高。涉及加密资产账号安全的工具切勿在来路不明的地方下载使用。
      </p>
      <p>
        <b>第二步</b>，添加该平台提供的谷歌身份验证密钥。打开谷歌身份验证器 App，安卓手机点击“添加新账户”，苹果手机点击“+”，扫描二维码添加；如果无法扫描二维码，可以手动输入密钥。
      </p>
      <p>
        <b>第三步</b>，<span style="color: #F56C6C;">备份！特别重要。下面按钮点击后显示的这个二维码和密钥，功能是一样的，只要有其中的任何一个，都可以知道你的谷歌验证码。所以，要像重视加密货币的钱包私钥一样，重视你的谷歌验证器私钥，最好是备份到离线的设备。</span>
      </p>
      <p>
        <b>第四步</b>，填写谷歌身份验证码，完成谷歌身份验证绑定。
      </p>
      <p style="text-align: center;">
        <img src="../../assets/images/google_authenticator.jpg">
      </p>
      <div>
        在第四步中，如果你输入的谷歌验证码不对，有以下几种解决措施：
      </div>
      <div>
        1. 首先，检查手机的系统时间和绑定谷歌验证的页面所在的设备（比如你是在电脑上操作的）系统时间是否一致。谷歌验证码和时间是密切相关的，系统时间不一致，会对验证码产生影响。如果确定不一致，需要先将时间校准。
      </div>
      <div>
        2. 确保你输入的是有效的谷歌验证码。验证码默认每 30 秒更新一次，少部分人操作速度慢，等输入完，谷歌验证码已经更新为另外一个了。
      </div>
      <div>
        3. 是否退出过绑定页面，如果退出过，需要从第二步重新开始做起。因为在没完成绑定之前，退出并重新进入，交易平台会给你不同的谷歌验证密钥。
      </div>
      <p>
        如果不小心误删了谷歌验证器 App，或者是装有谷歌验证器 App 的手机设备坏了，或换了新手机，只要重新下载 App，输入步骤三中备份的二维码或是明文密钥即可。这也是为什么一直强调要备份的原因了。
      </p>
      <p v-if="data.type === 1" style="color: #F56C6C;">
        该谷歌验证码为提资产谷歌验证码，与登录绑定的谷歌验证码，相对独立，建议在谷歌身份验证器绑定之后及时做好备注！
        <b style="font-size: 16px;color: #F56C6C;display: block;font-weight: normal;">
          该谷歌验证码只能获取一次，如果未绑定成功，请联系管理员
        </b>
      </p>
      <p>
        <el-link type="primary" href="https://google-authenticator.en.softonic.com/android" target="_blank">安卓下载地址</el-link>
      </p>
      <p v-if="!secretVisible" style="text-align: center;">
        <el-button type="primary" size="medium" :loading="addLoading" @click="onaddAuthenticator">获取谷歌密钥</el-button>
      </p>
      <div v-if="secretVisible">
        <div style="text-align: center;">
          <div>密钥：<b>{{ data.secret }}</b></div>
          <el-image :src="data.url" />
        </div>

        <el-form ref="form" :model="form" :rules="rules" label-width="100px" @submit.native.prevent>
          <el-form-item label="谷歌验证码" prop="code">
            <el-input v-model="form.code" maxlength="6" placeholder="请输入谷歌验证码" clearable @keyup.enter.native="onDelAuthenticator" />
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" size="medium" :loading="btnLoading" @click="onDelAuthenticator">确 定</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { setBind } from '@/api/common'
import { addAuthenticator, delAuthenticator } from '@/api/configs'
import QRCode from 'qrcode'
import { setToken } from '@/utils/auth'

export default {
  name: 'AuthenticatorDialog',
  data() {
    return {
      authenticatorVisible: false,
      secretVisible: false,
      addLoading: false,
      btnLoading: false,
      data: {
        secret: '',
        url: '',
        type: 0 // 0 登录，1 资产
      },
      form: {
        account: '',
        password: '',
        verification_code: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.authenticatorVisible = true
      if (data.type === 1) {
        this.data.type = data.type
      } else {
        this.data.secret = data.secret
        this.form.account = data.account
        this.form.password = data.password
        this.form.verification_code = data.verification_code
      }
    },
    onaddAuthenticator() {
      var _this = this
      var opts = {
        margin: 1
      }
      if (_this.data.type === 1) {
        if (!this.addLoading) {
          this.addLoading = true
          addAuthenticator()
            .then(response => {
              this.data.secret = response.data.secret
              QRCode.toDataURL(`otpauth://totp/退款：${location.origin}?secret=${this.data.secret}`, opts, function(err, url) {
                if (err) throw new Error(err)
                _this.data.url = ''
                _this.data.url = url
              })
              this.secretVisible = true
            })
            .catch(() => {
              this.addLoading = false
              this.$message.error('请联系管理员')
            })
        }
      } else {
        QRCode.toDataURL(`otpauth://totp/登录：${location.origin}?secret=${this.data.secret}`, opts, function(err, url) {
          if (err) throw new Error(err)
          _this.data.url = ''
          _this.data.url = url
        })
        this.secretVisible = true
      }
    },
    onDelAuthenticator() {
      this.btnLoading = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`请确保已正确备份二维码和密钥！系统不会存储该密钥，遗失无法找回！`, `验证`, {
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          })
            .then(() => {
              if (this.data.type === 1) {
                delAuthenticator(this.form)
                  .then(({ msg }) => {
                    setToken('1', 'security')
                    this.form.code = ''
                    this.$message.success(msg)
                    this.authenticatorVisible = false
                  })
                  .catch(() => {})
                  .finally(() => {
                    this.btnLoading = false
                  })
              } else {
                setBind(this.form)
                  .then(({ msg }) => {
                    this.form.code = ''
                    this.$message.success(msg)
                    this.authenticatorVisible = false
                  })
                  .catch(() => {})
                  .finally(() => {
                    this.btnLoading = false
                  })
              }
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

$bg:#283443;

p,div {
  line-height: 1.5;
}
p img {
  width: 80%;
}
::v-deep .el-form {
  margin: 20px auto 0 auto;
  width: 300px;
  .el-form-item__label {
    line-height: 46px;
  }
  .el-input {
    input {
      background: transparent;
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      height: 46px;
      color: $bg;
      caret-color: $bg;
    }
  }
}
</style>
