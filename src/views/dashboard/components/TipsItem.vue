<template>
  <div v-if="info.identify_status === 3" class="tips">
    <el-alert
      type="warning"
      :closable="false"
    >
      <div slot="title">
        <i class="el-icon-message-solid message-solid" />
        尊敬的品牌商，实名认证功能已经上线，请尽快点击
        <el-link type="primary" :underline="false" @click="onGoto('/identification')">个人中心-实名认证</el-link>
        完成品牌商实名认证
      </div>
    </el-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tipsitem',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  created() {

  },
  methods: {
    onGoto(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  margin-bottom: 20px;
  .message-solid {
    font-size: 18px;
    animation: shake 2.5s ease infinite;
  }
  .el-alert--warning.is-light {
    background-color: #fdf6ec;
    color: #e6a23c;
  }
  .el-link.el-link--primary {
    font-size: 13px;
    vertical-align: initial;
    user-select: none;
  }
}

@keyframes shake {
  0%, 50%, 100% {
    transform: rotate(0);
  }
  5%, 10%, 15%, 20%, 25%, 30%, 35%, 40% {
    transform: rotate(6deg);
  }
  45% {
    transform: rotate(4deg);
  }
  7.5%, 12.5%, 17.5%, 22.5%, 27.5%, 32.5%, 37.5%, 42.5% {
    transform: rotate(-6deg);
  }
  47.5% {
    transform: rotate(-2deg);
  }
}

</style>
