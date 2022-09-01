<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule" label-width="120px">
      <el-form-item label="转移目标账户" prop="phone">
        <el-input
          v-model="form.phone"
          maxlength="11"
          show-word-limit
          clearable
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
import { destroy, putDestroy } from '@/api/configs'
import { validPhone } from '@/utils/validate'

export default {
  name: 'Destroy',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      form: {
        phone: ''
      },
      rule: {
        phone: [
          { required: true, message: '请输入转移目标账户', trigger: 'blur' },
          { validator: validatePhone, trigger: ['blur', 'change'] }
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
    getList() {
      destroy().then((response) => {
        this.form.phone = response.data.value
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          putDestroy(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
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
.el-input {
  width: 200px;
}
</style>
