<template>
  <el-dialog :title="(form.id ? $t('table.edit') : $t('table.add')) + '利率' " :visible.sync="visible" append-to-body @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="利率" prop="interest_rate">
        <el-input-number v-model="form.interest_rate" :min="0" :max="100" :precision="2" placeholder="利率" />
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
import { setInterest } from '@/api/order'

export default {
  name: 'Interest',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        interest_rate: 0
      },
      rules: {
        interest_rate: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.id = data.order_id
        this.form.interest_rate = data.assets.interest_rate
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          setInterest(this.form)
            .then(({ msg = '设置成功' }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 200px;
}
</style>
