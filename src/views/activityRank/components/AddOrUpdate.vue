<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" top="30px" width="500px" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="form.amount" style="width:200px" :min="0" :precision="2" placeholder="请输入金额" clearable />
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
import { putData } from '@/api/activityRank'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        user_id: 0,
        amount: 0
      },
      rules: {
        amount: [
          { required: true, message: '请输入金额', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putData(this.form)
            .then(({ msg }) => {
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
      this.btnLoading = false
      this.$reset()
    }
  }
}
</script>
