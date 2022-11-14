<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="寄售开关">
        <el-switch v-model="form.switch" active-value="on" inactive-value="off" />
      </el-form-item>
      <el-form-item label="购买后寄售时间(天)" prop="buy">
        <el-input-number v-model="form.buy" :min="0" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="钱包转回后寄售时间(天)" prop="again">
        <el-input-number v-model="form.again" :min="0" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="最高寄售价格(元)" prop="sell_price">
        <el-input-number v-model="form.sell_price" :min="0" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="最低寄售价(元)" prop="min_sell_price">
        <el-input-number v-model="form.min_sell_price" :min="0" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="手续费比例(%)" prop="charge_fee">
        <el-input-number v-model="form.charge_fee" :precision="1" :max="100" :min="0" placeholder="请输入手续费比例" />
      </el-form-item>
      <el-form-item label="版权费配置(%)" prop="copyright_fee">
        <el-input-number v-model="form.copyright_fee" :min="0" :precision="1" :max="100" placeholder="请输入版权费" />
      </el-form-item>
      <el-form-item label="限制下单数量" prop="un_order_num">
        <el-input-number v-model="form.un_order_num" :min="0" :max="100" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="寄售协议" prop="agreement">
        <tinymce v-model="form.agreement" :height="400" />
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
import Tinymce from '@/components/Tinymce'
import { consignment, putConsignment } from '@/api/configs'

export default {
  name: 'Consignments',
  components: { Tinymce },
  data() {
    return {
      form: {
        switch: 'off',
        again: 0,
        buy: 0,
        sell_price: 0,
        agreement: '',
        charge_fee: 0,
        min_sell_price: 0,
        copyright_fee: 0,
        un_order_num: 0
      },
      btnLoading: false,
      rules: {
        again: [{ required: true, message: '请输入购买后寄售天数', trigger: 'blur' }],
        buy: [{ required: true, message: '请输入钱包转回后寄售天数', trigger: 'blur' }],
        sell_price: [{ required: true, message: '请输入最高寄售价格', trigger: 'blur' }],
        charge_fee: [{ required: true, message: '请输入手续费', trigger: 'blur' }],
        un_order_num: [{ required: true, message: '请输入未完成订单限制数量', trigger: 'blur' }],
        agreement: [{ required: true, message: '请输入寄售协议', trigger: 'blur' }],
        min_sell_price: [{ required: true, message: '请输入最低寄售价格', trigger: 'blur' }],
        copyright_fee: [{ required: true, message: '请输入版权费', trigger: 'blur' }]
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
      consignment()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putConsignment({ ...this.form })
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
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

<style scoped lang="scss">
.el-input-number {
	width: 200px;
}
</style>
