<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="合约地址配置" prop="address">
        <el-input v-model="form.address" :rows="10" placeholder="请输入合约地址" style="width: 600px" clearable />
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
import { changeAddress, putChangeAddress } from '@/api/configs'
export default {
  name: 'ChangeAdress',
  data() {
    return {
      btnLoading: false,
      form: {
        address: ''
      },
      rules: {
        address: [
          { required: true, message: '请输入合约地址', trigger: 'blur' }
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
      changeAddress()
        .then(response => {
          this.form.address = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putChangeAddress(this.form)
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
