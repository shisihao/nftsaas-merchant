<template>
  <div id="login-container" class="login-container">
    <div class="login-content">
      <div v-show="step === 0" class="content">
        <el-form ref="form" :model="form" :rules="rules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">
              <img v-if="info.icon && configInfo.oss" :src="`${configInfo.oss ? configInfo.oss.domain : ''}` + info.icon" class="sidebar-logo">{{ info.name }}{{ $t('login.title') }}
            </h3>
            <lang-select v-if="false" class="set-language" />
          </div>

          <el-tabs v-model="activeName" @tab-click="onChangeTabs">
            <el-tab-pane label="密码登录" name="pw">
              <div v-if="activeName === 'pw'">
                <el-form-item prop="account">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="account"
                    v-model="form.account"
                    placeholder="手机号/邮箱"
                    name="account"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    clearable
                  />
                </el-form-item>

                <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                  <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="form.password"
                      :type="passwordType"
                      :placeholder="$t('login.password')"
                      name="password"
                      tabindex="2"
                      autocomplete="on"
                      @keyup.native="checkCapslock"
                      @keyup.enter.native="handleLogin"
                      @blur="capsTooltip = false"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>
              </div>
            </el-tab-pane>

            <el-tab-pane label="验证码登录" name="cd">
              <div v-if="activeName === 'cd'">
                <el-form-item prop="account">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="account"
                    v-model="form.account"
                    placeholder="手机号/邮箱"
                    name="account"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                  />
                </el-form-item>

                <div class="code-box">
                  <el-form-item prop="verification_code">
                    <span class="svg-container">
                      <svg-icon icon-class="verifications" />
                    </span>
                    <el-input
                      ref="verification_code"
                      v-model="form.verification_code"
                      placeholder="验证码"
                      name="verification_code"
                      type="text"
                      tabindex="1"
                      maxlength="6"
                      @keyup.enter.native="handleLogin"
                    />
                  </el-form-item>

                  <el-button type="primary" size="auto" :disabled="codeStatus" :loading="codeStatusLoading" @click="onSendCode">
                    {{ codeText }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="login-options">
            <!-- <el-checkbox v-model="autoLogin">自动登录</el-checkbox> -->
            <el-link type="primary" :underline="false" @click="showDialog = true">联系客服</el-link>
          </div>

          <el-button :loading="loading" type="primary" size="auto" style="width:100%;margin-bottom:40px;" @click="handleLogin">
            {{ $t('login.logIn') }}
          </el-button>

          <div v-if="false" style="position:relative">
            <div class="tips">
              <span>{{ $t('login.username') }} : admin</span>
              <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
            </div>
            <div class="tips">
              <span style="margin-right:18px;">
                {{ $t('login.username') }} : editor
              </span>
              <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
            </div>

            <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
              {{ $t('login.thirdparty') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <div v-show="step === 1" class="content">
        <google-code :login-form="form" />
      </div>
      <copyright />
    </div>

    <authenticator-dialog
      v-if="googleCodeVisible"
      ref="googleCode"
    />

    <el-dialog title="联系客服" :visible.sync="showDialog">
      <social-sign />
    </el-dialog>

    <remote-js src="js/ribbon.js" />
  </div>
</template>

<script>
import { validEmail, validPhone } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import Copyright from '@/components/Copyright'
import SocialSign from './components/SocialSignin'
import GoogleCode from './components/GoogleCode'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import { checkBind, getCode } from '@/api/common'

export default {
  name: 'Login',
  components: {
    LangSelect,
    SocialSign,
    Copyright,
    GoogleCode,
    'remote-js': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src }})
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validEmail(value) && !validPhone(value)) {
        callback(new Error('请输入正确的手机号/邮箱'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      form: {
        account: '',
        password: '',
        verification_code: ''
      },
      rules: {
        account: [{ required: true, trigger: ['blur', 'change'], validator: validateUsername }],
        password: [{ required: true, trigger: ['blur', 'change'], validator: validatePassword }],
        verification_code: [{ required: true, trigger: ['blur', 'change'], message: '不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      logo: 'favicon.png',
      count: 60,
      curCount: '',
      interValObj: '',
      codeText: '获取验证码',
      activeName: 'pw',
      codeStatus: false,
      codeStatusLoading: false,
      autoLogin: true,
      googleCodeVisible: false,
      step: 0
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    if (parseInt(Cookies.get('residueTime') || 0) > 0 && parseInt(Cookies.get('residueTime')) - (+new Date()) > 0) {
      this.curCount = parseInt((parseInt(Cookies.get('residueTime')) - (+new Date())) / 1000)
      this.codeStatus = true
      this.codeText = `${this.curCount}s 后重发`
      this.interValObj = setInterval(this.setRemainTime, 1000)
    }
  },
  mounted() {
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    onChangeTabs() {
      this.form = {
        account: '',
        password: '',
        verification_code: ''
      }
    },
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          checkBind(this.form)
            .then(response => {
              if ([1, '1'].includes(response.data.is_bind)) {
                this.step = 1
              } else {
                this.onGoogleCode(Object.assign(response.data, this.form))
              }
            })
            .finally(() => {
              this.loading = false
            })

          /* this.$store.dispatch('user/login', this.form)
            .then((data) => {
              this.loading = false
              if (true) {
                this.$router.push({ path: '/step' })
              } else {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              }
            })
            .catch(() => {
            }) */
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    setRemainTime() {
      if (this.curCount <= 1) {
        clearInterval(this.interValObj)
        this.codeText = '重新发送'
        this.codeStatus = false
      } else {
        this.curCount--
        this.codeText = `${this.curCount}s 后重发`
      }
    },
    onSendCode() {
      const _this = this
      this.$refs.form.validateField('account', errMsg => {
        if (errMsg) {
          // console.log('账号校验未通过')
        } else {
          const options = {
            'needFeedBack': false
          }
          const appid = '193152420'
          const captcha = new window.TencentCaptcha(appid, function(res) {
            if (res.ret === 0) {
              _this.getSms(res.ticket, res.randstr)
            } else if (res.errorMessage) {
              console.log(res.errorMessage)
            }
          }, options)
          captcha.show()
        }
      })
    },
    getSms(randstr, ticket) {
      console.log(1111111)
      this.codeStatus = true
      this.codeStatusLoading = true
      getCode({ randstr, ticket, scene: 'login', account: this.form.account })
        .then((data) => {
          this.curCount = this.count
          this.codeText = `${this.curCount}s 后重发`
          Cookies.set('residueTime', +new Date() + this.count * 1000, { expires: new Date(+new Date() + this.count * 1000) })
          this.interValObj = setInterval(this.setRemainTime, 1000)
        })
        .catch(() => {
          this.codeStatus = false
        })
        .finally(() => {
          this.codeStatusLoading = false
        })
    },
    onGoogleCode(data) {
      this.googleCodeVisible = true
      this.$nextTick(() => {
        this.$refs.googleCode && this.$refs.googleCode.init(data)
      })
    },
    onStep(val) {
      this.step = val
    }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }
  .content .login-form .el-input {
    display: inline-block;
    height: 46px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 46px;
      color: $bg;
      caret-color: $bg;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $light_gray inset !important;
        -webkit-text-fill-color: $bg !important;
      }
    }
  }
  .content .login-form .el-form-item {
    border: 1px solid rgba(229, 229, 229, 1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  // background-color: $bg;
  .login-content {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    padding: 0 66px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 3px 4px 8px rgba(42, 130, 228, 0.12);
    border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 5px 5px 15px;
    color: #1890FF;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000;
      margin: 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .el-button {
    height: 46px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .code-box {
    position: relative;
  }
  .code-box .el-form-item {
    width: 220px;
    display: inline-block;
  }
  .code-box .el-button {
    position: absolute;
    right: 0;
    top: 0;
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 30px;
  }
  .el-form-item {
    margin-bottom: 34px;
  }
  .login-options {
    display: flex;
    margin-bottom: 34px;
    margin-top: 14px;
    justify-content: space-between;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
