<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="注册协议" prop="value">
        <tinymce v-model="form.value" :height="400" />
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
import { register, putRegister } from '@/api/configs'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Purchase',
  components: { Tinymce },
  data() {
    return {
      btnLoading: false,
      form: {
        value: ''
      },
      rules: {
        value: [
          { required: true, message: '协议不能为空', trigger: 'blur' }
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
      register()
        .then(response => {
          this.form.value = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putRegister({ register: this.form.value })
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
.app-container {
  width: 1000px;
}
</style>
