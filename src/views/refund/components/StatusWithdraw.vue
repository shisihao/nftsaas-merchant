<template>
  <el-dialog :title="form.status === 1 ? '通过' : '驳回'" :visible.sync="visible" @closed="onClose()">

    <div class="el-message-box__container">
      <div class="el-message-box__status" :class="form.status === 1 ? 'el-icon-success' : 'el-icon-warning'" />
      <div class="el-message-box__message">
        确认退款
      </div>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="margin-top: 20px">
      <el-form-item label="商户订单号" prop="oriOrderCode">
        <el-input v-model="form.oriOrderCode" placeholder="商户订单号" clearable />
      </el-form-item>
      <el-form-item v-if="form.status === 1" label="谷歌验证码" prop="code">
        <el-input v-model="form.code" style="width: 200px;" maxlength="6" placeholder="谷歌验证码" clearable />
      </el-form-item>
      <!-- <el-form-item v-if="form.status === 2" label="驳回原因" prop="reason">
        <el-input v-model="form.reason" placeholder="驳回原因" clearable />
      </el-form-item> -->
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
import { statusWithdraw } from '@/api/refund'

export default {
  data() {
    return {
      visible: false,
      btnLoading: false,

      form: {
        oriOrderCode: '',
        code: '',
        status: 1
      },
      rules: {
        oriOrderCode: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$confirm(`确定对商户订单号[${this.form.oriOrderCode}]进行[退款]操作`, '退款', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'success',
            cancelButtonClass: 'btn-custom-cancel'
          }
          )
            .then(() => {
              statusWithdraw(this.form)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                  this.$emit('refreshList')
                })
                .catch(() => {
                  this.btnLoading = false
                })
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

</style>
