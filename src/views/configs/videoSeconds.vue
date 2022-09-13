<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule" label-width="100px">
      <el-form-item label="时间(秒)" prop="value">
        <el-input-number v-model="form.value" placeholder="时间" :min="0" />
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
import { videoSeconds, putVideoSeconds } from '@/api/configs'
export default {
  name: 'VideoSeconds',
  data() {
    return {
      form: {
        value: 0
      },
      btnLoading: false,
      rule: {
        value: [
          { required: true, message: '请输入', trigger: 'blur' }
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
      videoSeconds().then(response => {
        this.form.value = response.data.value
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putVideoSeconds({ ...this.form })
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

<style  scoped>
.el-input-number{
    width: 200px;
}
</style>
