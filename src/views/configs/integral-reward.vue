<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule">
      <el-form-item label="有效期（天）" prop="integral_reward">
        <el-input-number v-model="form.integral_reward" :min="0" />
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
import { integralReward, putIntegralReward } from '@/api/configs'

export default {
  name: 'IntegralReward',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        integral_reward: 0
      },
      rule: {
        integral_reward: [{ required: true, message: '请输入有效期天数', trigger: 'blur' }]
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
      integralReward({ ...this.form })
        .then(response => {
          if (response.code !== 0) return
          this.form = Object.assign({}, response.data.value)
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
          putIntegralReward({ ...this.form })
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
  .el-input-number {
    width: 200px;
  }
</style>
