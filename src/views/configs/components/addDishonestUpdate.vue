<template>
  <el-dialog title="失信配置" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="订单失信配置" prop="order_limit">
        <el-input-number v-model="form.order_limit" :precision="0" :min="1" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderLimit, putOrderLimit } from '@/api/configs'
export default {
  name: 'AddDishonestUpdate',
  data() {
    return {
      btnLoading: false,
      visible: false,
      form: {
        order_limit: 0
      },
      rules: {
        order_limit: [
          { required: true, message: '请输入订单失信配置', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      orderLimit()
        .then(response => {
          this.form.order_limit = response.data.value
        })
        .catch(() => {})
    },
    onClose() {
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putOrderLimit(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.$emit('refreshList')
              this.visible = false
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
.el-input-number{
width: 200px;
}
</style>
