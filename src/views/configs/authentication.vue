<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="实名要素设置：" prop="key">
        <el-input v-model="form.key" :rows="10" placeholder="请输入实名要素" style="width: 600px" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCert, setCert } from '@/api/configs'
export default {
  data() {
    return {
      form: { key: '' },
      btnLoading: false,
      rules: {
        key: [
          { required: true, message: '请输入实名要素', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getCert().then(({ data }) => {
        this.form.key = data.value
      })
    },
    onFormSubmit() {
      this.btnLoading = true
      setCert(this.form)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.getInfo()
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
</style>
