<template>
  <el-dialog title="导入订单" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="手机号/邮箱" clearable />
      </el-form-item>
      <el-form-item label="所属专区" prop="zone">
        <el-select v-model="search.zone" @change="onChangeZone">
          <el-option v-for="item in zoneOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="search.zone" label="商品分类" prop="cate_id">
        <el-select v-model="search.cate_id" @change="onChangeCate">
          <el-option v-for="item in cateOptions.filter(v => v.zone === search.zone)" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goods_id">
        <el-select v-model="form.goods_id" placeholder="请选择" :loading="goodsLoading">
          <el-option
            v-for="item in goodsOptions.filter(v => v.zone === search.zone && v.cate_id === search.cate_id)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        <el-select v-model="form.pay_type">
          <el-option v-for="item in payTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="num">
        <el-input-number v-model="form.num" :min="1" :precision="0" placeholder="数量" />
      </el-form-item>
      <el-form-item label="有无市场业绩" prop="market_status">
        <el-switch
          v-model="form.market_status"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="有无销售奖励" prop="sales_status">
        <el-switch
          v-model="form.sales_status"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
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
import { importOrder } from '@/api/order'
import { validPhone, validEmail } from '@/utils/validate'
import { zoneOptions, payOptions } from '@/utils/explain'
import { powerGoodsList } from '@/api/goods'
import { powerCategoryList } from '@/api/category'
import axios from 'axios'

export default {
  name: 'ImportOrder',
  data() {
    const validateAccount= (rule, value, callback) => {
      if (!validPhone(value) && !validEmail(value)) {
        callback(new Error('请输入正确的手机号或邮箱'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      goodsLoading: false,
      levelLoading: false,
      goodsOptions: [],
      zoneOptions: zoneOptions.slice(1),
      payTypeOptions: payOptions.slice(1),
      cateOptions: [],
      search: {
        cate_id: '',
        zone: ''
      },
      form: {
        account: '',
        goods_id: '',
        num: 1,
        pay_type: '',
        market_status: 0,
        sales_status: 0
      },
      rules: {
        account: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: validateAccount, trigger: ['blur', 'change'] }
        ],
        goods_id: [
          { required: true, message: '请选择商品', trigger: ['blur', 'change'] }
        ],
        num: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量为数字' }
        ],
        pay_type: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getGoodsAndCategory()
    },
    getGoodsAndCategory () {
      axios.all([powerGoodsList(), powerCategoryList()])
        .then(axios.spread((goods, cates) => {
          this.goodsOptions = goods.data.map(v => {
            return {
              label: v.name,
              value: v.id,
              zone: v.zone,
              cate_id: v.cate_id
            }
          })
          this.cateOptions = cates.data.map(v => {
            return {
              label: v.name,
              value: v.id,
              zone: v.zone
            }
          })
        }))
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          importOrder(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              setTimeout(() => {
                this.$emit('refreshList')
              }, 1000)
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    onChangeZone(val) {
      this.search.cate_id = ''
      this.form.goods_id = ''
    },
    onChangeCate(val) {
      this.form.goods_id = ''
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 200px;
}
</style>
