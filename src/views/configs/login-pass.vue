<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="登录开关">
        <el-switch
          v-model="form.login_pass"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginPass, putLoginPass } from '@/api/configs'

export default {
  name: 'Give',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        login_pass: 'on' // on-开启 off-关闭
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      loginPass()
        .then(response => {
          if (response.code !== 0) return
          this.form.login_pass = response.data.value
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putLoginPass({ ...this.form })
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
    }
  }
}
</script>

<style scoped>
</style>
