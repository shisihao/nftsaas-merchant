<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item prop="price" label="USDT支付费率（%）：">
        <el-input-number v-model="form.usdt" :precision="2" :step="1" :min="0" />
        <div class="notice">
          注意：保留两位小数，用户在APP采用此支付方式时候需要支付对应订单百分比的税率
        </div>
      </el-form-item>
      <el-form-item prop="price" label="银行卡支付费率（%）：">
        <el-input-number v-model="form.bank" :precision="2" :step="1" :min="0" />
        <div class="notice">
          注意：保留两位小数，用户在APP采用此支付方式时候需要支付对应订单百分比的税率
        </div>
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
import { configsTax, putConfigsTax } from '@/api/configs'
export default {
  name: 'Texpoint',
  data() {
    return {
      btnLoading: false,
      form: {
        usdt: 0,
        bank: 0
      },
      rules: {
        usdt: [
          { required: true, message: 'USDT支付费率不能为空', trigger: ['blur', 'change'] }
        ],
        bank: [
          { required: true, message: '银行卡支付费率不能为空', trigger: ['blur', 'change'] }
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
      configsTax()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putConfigsTax(this.form)
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
.notice {
  color: #909399;
  font-size: 12px;
}
</style>
