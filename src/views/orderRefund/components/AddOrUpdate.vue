<template>
  <el-dialog top="30px" title="收货信息" :visible.sync="Visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="收货人姓名" prop="consignee_name">
            <el-input v-model="form.consignee_name" placeholder="请输入收货人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货人手机" prop="consignee_phone">
            <el-input v-model="form.consignee_phone" maxlength="11" clearable placeholder="请输入收货人手机" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="收货地址" prop="consignee_address">
            <el-input v-model="form.consignee_address" type="textarea" placeholder="请输入收货地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="处理备注" prop="explain">
            <el-input v-model="form.explain" type="textarea" placeholder="请输入处理备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit(form,1)">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { refundAudit } from '@/api/orderRefund'
import { validPhone } from '@/utils/validate'
export default {
  name: 'AddOrUpdate',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      Visible: false,
      btnLoading: false,
      form: {
        order: {
          goods_order: {
            goods_image: [],
            goods_name: '',
            goods_price: '',
            num: 0,
            profit: ''
          },
          pay_price: 0,
          integral_deduction: 0,
          total_price: 0,
          order_no: 0,
          pay_type: ''
        },
        reason: '',
        created_at: '',
        user: {
          name: '',
          phone: ''
        },
        logistics_images: [],
        logistics_no: '',
        logistics_name: '',
        consignee_address: '',
        consignee_phone: '',
        consignee_name: ''
      },
      newForm: {
        consignee_name: '',
        consignee_phone: '',
        consignee_address: ''
      },
      rules: {
        'consignee_address': [
          { required: true, message: '收货人地址不能为空', trigger: ['blur', 'change'] }
        ],
        'consignee_phone': [
          { required: true, message: '收货人手机号不能为空', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        'consignee_name': [
          { required: true, message: '收货人姓名不能为空', trigger: ['blur', 'change'] }
        ],
        'explain': [
          { required: true, message: '处理备注不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.Visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    onClose() {
      this.btnLoading = false
      this.$reset()
    },
    onFormSubmit(row, status) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const newKeys = Object.keys(this.form).filter(v => {
            return ['consignee_address', 'consignee_phone', 'consignee_name'].includes(v)
          })
          newKeys.forEach(v => {
            this.newForm[v] = this.form[v]
          })
          this.btnLoading = true
          const data = Object.assign({ order_refund_id: row.id, notice: row.explain, status }, this.newForm)
          refundAudit(data)
            .then(() => {
              this.$message.success('已审核退货')
              this.$emit('refreshList')
            })
            .catch(error => {
              this.$message.error(error.msg)
            }).finally(() => {
              this.Visible = false
              this.onClose()
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    display: block;
  }
  .el-input-number {
    width: 200px;
  }
</style>
