<template>
  <el-dialog top="30px" :title="form.status | paraphrase(handleOptions)" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" label-width="100px">
      <el-descriptions title="退/换货商品详情" size="medium" :column="1">
        <el-descriptions-item label="商品信息">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              fit="cover"
              :src="`${domin}${form.entity_goods_order.goods_order.sku ? form.entity_goods_order.goods_order.sku.image : form.entity_goods_order.goods_order.goods_image}`"
              :preview-src-list="[`${domin}${form.entity_goods_order.goods_order.sku ? form.entity_goods_order.goods_order.sku.image : form.entity_goods_order.goods_order.goods_image}`]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="info-box" style="margin-left:10px">
              <div class="goods-name">
                <span>
                  {{ form.entity_goods_order.goods_order.goods_name }}
                </span>
              </div>
              <div class="goods-properties">
                规格：{{ form.entity_goods_order.goods_order.sku ? form.entity_goods_order.goods_order.sku.properties.join('/') : '无规格' }}
              </div>
              <div>购买量：x{{ form.entity_goods_order.num }}</div>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="付款信息" size="medium" :column="4">
        <el-descriptions-item label="支付方式">{{ form.entity_goods_order.pay_type | paraphrase(payTypeOptions) }}</el-descriptions-item>
        <el-descriptions-item label="人民币价格">{{ form.entity_goods_order.cny_price }}</el-descriptions-item>
        <el-descriptions-item label="商品券数量">{{ form.entity_goods_order.commodity_price }}</el-descriptions-item>
        <el-descriptions-item :label="`${integral}数量`">{{ form.entity_goods_order.integral_price }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="售后状态" size="medium" :column="4">
        <el-descriptions-item label="订单号"> {{ form.entity_goods_order.order_no }}</el-descriptions-item>
        <el-descriptions-item label="售后申请状态">{{ form.status | paraphrase(handleOptions) }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ form.created_at||'-' }}</el-descriptions-item>
        <el-descriptions-item label="退货原因">{{ form.reason }}</el-descriptions-item>
        <el-descriptions-item v-if="form.status === 3" label="拒绝原因">{{ form.reject }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="用户信息" size="medium" :column="4">
        <el-descriptions-item label="用户名称">{{ form.user.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ form.user.phone }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions v-if="[1,2,3].includes(form.status) " title="确认退款金额" size="medium" :column="4">
        <el-descriptions-item label="退款金额(元)">{{ form.cny_price }}</el-descriptions-item>
        <el-descriptions-item label="商品券数量">{{ form.entity_goods_order.commodity_price }}</el-descriptions-item>
        <el-descriptions-item :label="`${integral}数量`">{{ form.entity_goods_order.integral_price }}</el-descriptions-item>
        <!-- <el-descriptions-item label="积分">{{ form.entity_goods_order.integral_deduction || 0 }}</el-descriptions-item> -->
      </el-descriptions>

      <el-descriptions v-if="![0,3].includes(form.status)" size="medium" title="退货单信息" :column="4">
        <el-descriptions-item label="物流公司">{{ form.logistics_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="运单编号">{{ form.logistics_no || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="退货地址" size="medium" :column="4">
        <el-descriptions-item label="收货人姓名">{{ form.consignee_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="收货人手机">{{ form.consignee_phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ form.consignee_address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注">{{ form.explain || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" :loading="btnLoading" @click="visible = false">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { DominKey, getToken } from '@/utils/auth'
import { payTypeOptions, handleOptions, payOptions } from '@/utils/explain'
export default {
  name: 'PendingUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      payTypeOptions: payTypeOptions.concat(payOptions),
      handleOptions,
      form: {
        entity_goods_order: {
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
      this.$reset()
    }
  }
}
</script>

<style scoped lang="scss">
.info-wrapper {
  display: flex;
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    // img {
    //   height: unset;
    // }
    ::v-deep .image-slot {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
  .info-box{
    margin-left: 10px;
  }
}

  ::v-deep .el-dialog {
    width: 1000px;
  }
  ::v-deep .el-input__inner{
    width: 200px;
  }
  ::v-deep .el-input-number{
    width: 200px;
  }
</style>
