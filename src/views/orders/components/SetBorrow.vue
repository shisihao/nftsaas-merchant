<template>
  <el-dialog title="资产操作" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="操作类型" prop="action">
        <el-select v-model="form.action">
          <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${form.action === 1 ? '增加' : '扣除'}质押数量`" prop="pledge">
        <el-input-number v-model="form.pledge" :min="0" :precision="8" placeholder="请输入质押数量" clearable />
      </el-form-item>
      <el-form-item :label="`${form.action === 1 ? '增加' : '扣除'}gas数量`" prop="gas">
        <el-input-number v-model="form.gas" :min="0" :precision="8" placeholder="请输入gas数量" clearable />
      </el-form-item>
      <el-form-item :label="`${form.action === 1 ? '增加' : '扣除'}欠款利息`" prop="interest">
        <el-input-number v-model="form.interest" :min="0" :precision="8" placeholder="请输入欠款利息" clearable />
      </el-form-item>
      <div style="color: #F56C6C;">
        注：资本垫付补发为借贷GAS和借贷质押数量，会累计到用户该笔订单的借贷总量需要用户归还，而自付质押与满存算力补发为使用GAS和质押，后期工作结束使用质押数量需要退还给用户，请谨慎操作
      </div>
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
import { setBorrow } from '@/api/order'

export default {
  name: 'SetBorrow',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        order_id: 0,
        action: 1,
        pledge: 0,
        gas: 0,
        interest: 0
      },
      actionOptions: [
        { label: '增加', value: 1 },
        { label: '扣除', value: 2 }
      ],
      rules: {
        action: [
          { required: true, message: '操作类型不能为空', trigger: ['blur', 'change'] }
        ],
        pledge: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        gas: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        interest: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      if (data.id) {
        this.visible = true
        this.form.order_id = data.id
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确认${this.form.action === 1 ? '增加' : '扣除'}质押数量：${this.form.pledge}，GAS数量：${this.form.gas}，欠款利息：${this.form.interest}`, `确认操作`, {
            type: this.form.action === 1 ? 'warning' : 'error'
          }).then(() => {
            this.btnLoading = true
            setBorrow(this.form)
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.$emit('refreshList')
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
            .catch(() => {})
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
  .el-input-number ::v-deep {
    width: 200px;
  }
</style>
