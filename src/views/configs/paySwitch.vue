<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="140px">
      <el-form-item v-for="(item, index) in payOptions" :key="index" :label="item.label + '支付'" :prop="item.value">
        <span slot="label">
          <span class="svg">
            <svg-icon :icon-class="item.value" />
          </span>
          {{ item.label }}支付
        </span>
        <el-switch
          v-model="form[item.value]"
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
import { payOptions } from '@/utils/explain'
export default {
  name: 'Pay',
  data() {
    return {
      payOptions: payOptions.slice(3),
      btnLoading: false,
      form: {
        // on-开启 off-关闭
        alipay: 'off',
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
