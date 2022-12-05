<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="通道号" prop="sender">
        <el-input v-model="form.sender" placeholder="请输入通道号" clearable />
      </el-form-item>
      <el-form-item label="签名" prop="sign">
        <el-input v-model="form.sign" placeholder="请输入签名" clearable />
      </el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t("table.confirm") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getSms, setSms } from '@/api/configs'
export default {
  name: 'ShortMessage',
  data() {
    return {
      btnLoading: false,
      form: {},
      rules: {
        sender: [
          { required: true, message: '通道号不能为空', trigger: 'blur' }
        ],
        sign: [{ required: true, message: '签名不能为空', trigger: 'blur' }]
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
      getSms()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setSms(this.form)
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
.app-container {
  width: 400px;
}
</style>
