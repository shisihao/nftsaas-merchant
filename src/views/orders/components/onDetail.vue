<template>
  <el-dialog title="订单详情" width="800px" :visible.sync="visible" @closed="onClose()">
    <el-descriptions title="订单信息" size="medium" :column="3">
      <el-descriptions-item label="订单ID"># {{ form.id }}</el-descriptions-item>
      <el-descriptions-item label="订单号">{{ form.order_no }}</el-descriptions-item>
      <el-descriptions-item label="订单类型"><el-tag :type="form.target_type | paraphrase(orderTypeOptions, 'value', 'type')">{{ form.target_type | paraphrase(orderTypeOptions) }}</el-tag></el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ form.created_at }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="藏品信息" size="medium" style="margin-top: 10px" :column="3">
      <el-descriptions-item v-if="form.goods && form.goods.name" label="藏品名称">{{ form.goods.name }}</el-descriptions-item>
      <el-descriptions-item label="人民币价格">{{ form.cny_price || 0.00 }}</el-descriptions-item>
      <el-descriptions-item :label="`${integral}价格`">{{ form.integral_price || 0.00 }}</el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ form.created_at || '-' }}</el-descriptions-item>
      <el-descriptions-item label="数量">x{{ form.num }}</el-descriptions-item>
      <el-descriptions-item v-if="form.hash" label="交易HASH">{{ form.hash || '-' }}</el-descriptions-item>
      <el-descriptions-item v-if="form.goods" label="合约地址">{{ form.goods.address ? form.goods.address : '-' }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="用户信息" size="medium" style="margin-top: 10px" :column="3">
      <el-descriptions-item v-if="form.user && form.user.id" label="用户ID"># {{ form.user.id || '' }}</el-descriptions-item>
      <el-descriptions-item label="用户名称">{{ form.user.name }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ form.user.phone }}</el-descriptions-item>
      <el-descriptions-item label="用户头像">
        <el-avatar class="avatar" icon="el-icon-user-solid" :src="form.user.avatar ? (domin + form.user.avatar) : ''" />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="支付价格" size="medium" style="margin-top: 10px" :column="3">
      <el-descriptions-item label="现金价格">¥ {{ form.cny_price || 0.00 }}</el-descriptions-item>
      <el-descriptions-item :label="`${integral}价格`">{{ form.integral_price || 0.00 }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="支付方式" size="medium" style="margin-top: 10px" :column="3">
      <el-descriptions-item label="支付方式">
        <span v-if="form.cny_price > 0" style="margin-right: 5px">
          <svg-icon :icon-class="form.pay_type | paraphrase(payOptions, 'value', 'value')" /> {{ form.pay_type | paraphrase(payOptions) }}
        </span>
        <span v-if="form.integral_price > 0">
          <svg-icon icon-class="hd" /> {{ integral }}
        </span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
<script>

import { orderTypeOptions, payOptions } from '@/utils/explain'
import { DominKey, getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      orderTypeOptions,
      payOptions,
      domin: getToken(DominKey),
      form: {
        id: 0,
        order_no: '',
        target_type: '',
        created_at: '',
        goods: {
          name: ''
        },
        cny_price: 0,
        num: 0,
        hash: '',
        user: {
          id: 0,
          name: '',
          phone: '',
          avatar: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },

    onClose() {
      this.btnLoading = false
    }
  }
}
</script>
<style scoped>
  ::v-deep .el-descriptions__title{
    font-size: 14px!important; ;
  }
  .avatar{
    width: 28px;
    height: 28px;
    line-height: 28px;

  }
</style>
