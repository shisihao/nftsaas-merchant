<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="email" prop="email">
        <el-input v-model.trim="form.email" show-word-limit maxlength="20" placeholder="email" />
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
import { contact, putContact } from '@/api/configs'
import { validEmail } from '@/utils/validate'
export default {
  name: 'Contact',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的Email'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      form: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: 'qq不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: ['blur', 'change'] }
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
      contact()
        .then(response => {
          this.form = response.data
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putContact(this.form)
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
</style>
