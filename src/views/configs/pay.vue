<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="USDT" prop="usdt">
        <span slot="label">
          <span class="svg">
            <svg-icon icon-class="radius-usdt" style="color: #269A77;" />
          </span>
          USDT
        </span>
        <el-switch
          v-model="form.usdt"
          active-value="on"
          inactive-value="off"
          @change="onFormSubmit"
        />
      </el-form-item>
      <el-form-item label="银行卡" prop="bank">
        <span slot="label">
          <span class="svg">
            <svg-icon icon-class="radius-bank" style="color: #F59D03;" />
          </span>
          银行卡
        </span>
        <el-switch
          v-model="form.bank"
          active-value="on"
          inactive-value="off"
          @change="onFormSubmit"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { pay, putPay } from '@/api/configs'
export default {
  name: 'Pay',
  data() {
    return {
      btnLoading: false,
      form: {
        // on-开启 off-关闭
        cny: 'off',
        bank: 'off'
      },
      rules: {}
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
      pay()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.btnLoading = true
      putPay({ 'switch': this.form })
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          this.getList()
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.svg {
  vertical-align: middle;
}
svg.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
