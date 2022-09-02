<template>
  <div class="code-box">
    <div class="back">
      <el-page-header content="谷歌验证码" @back="goBack" />
      <el-divider />
    </div>
    <div class="code-form">
      <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px" @submit.native.prevent>
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="form.code" maxlength="6" placeholder="请输入谷歌验证码" clearable @keyup.enter.native="onhandleLogin" />
        </el-form-item>
        <div style="text-align: center;">
          <el-button type="primary" size="medium" :loading="btnLoading" @click.native="onhandleLogin">确 定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Cd',
  props: {
    loginForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      btnLoading: false,
      form: {
        code: ''
      },
      rules: {
        code: [
          { required: true, trigger: ['blur', 'change'], message: '不能为空' }
        ]
      }
    }
  },
  methods: {
    goBack() {
      this.$parent.onStep(0)
    },
    onhandleLogin() {
      this.btnLoading = true
      this.$store.dispatch('user/login', Object.assign(this.loginForm, this.form))
        .then((data) => {
          if (data.admin.is_first === 0) {
            this.$router.replace({ path: '/' })
          } else {
            this.$router.replace({ path: '/step' })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.code-box {
  width: 500px;
  max-width: 100%;
  min-height: 300px;
  padding: 0 66px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 3px 4px 8px rgb(42 130 228 / 12%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  ::v-deep .el-input {
    input {
      color: #000;
    }
  }
  .back {
    padding: 20px 0;
  }
  .code-form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
