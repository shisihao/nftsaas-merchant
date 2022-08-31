<template>
  <div class="social-signup-container">
    <div class="sign-btn">
      <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
      {{ configInfo.contact.wechat }}
    </div>
    <div class="sign-btn">
      <span class="qq-svg-container"><svg-icon icon-class="qq" class="icon" /></span>
      {{ configInfo.contact.qq }}
    </div>
  </div>
</template>

<script>
// import openWindow from '@/utils/open-window'
import { mapGetters } from 'vuex'

export default {
  name: 'SocialSignin',
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  methods: {
    wechatHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const appid = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect'
      // openWindow(url, thirdpart, 540, 540)
    },
    tencentHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const client_id = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri
      // openWindow(url, thirdpart, 540, 540)
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-signup-container {
    margin: 20px 0;
    .sign-btn {
      display: inline-block;
      cursor: pointer;
    }
    .icon {
      color: #fff;
      font-size: 24px;
      margin-top: 8px;
    }
    .wx-svg-container,
    .qq-svg-container {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      padding-top: 1px;
      border-radius: 4px;
      margin-bottom: 20px;
      margin-right: 5px;
    }
    .wx-svg-container {
      .icon {
        color: #24da70;
      }
    }
    .qq-svg-container {
      margin-left: 50px;
      .icon {
        color: #6BA2D6;
      }
    }
  }
</style>
