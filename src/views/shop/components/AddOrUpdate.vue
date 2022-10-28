<template>
  <el-dialog top="30px" width="1200px" :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="编辑基本信息" />
      <el-step title="编辑商品规格" />
      <el-step title="编辑商品详情" />
    </el-steps>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <step1 v-show="active === 1" ref="step1" :form.sync="form" />
      <step2 v-show="active === 2" ref="step2" :form.sync="form" @onCheckStock="updateStock" />
      <step3 v-show="active === 3" ref="step3" :form.sync="form" :visible="visible" />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="active === 1" @click="onPrev">上一步</el-button>
      <el-button :disabled="active === 3" @click="onNext">下一步</el-button>
      <el-button v-show="active === 3" type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrUpdate, getDataItem } from '@/api/shop'
import Step1 from './shopStep1'
import Step2 from './shopStep2'
import Step3 from './shopStep3'

export default {
  name: 'AddOrUpdate',
  components: { Step1, Step2, Step3 },
  data() {
    const validateConditionGoods = (rule, value, callback) => {
      if (this.form.cate_id === 2 && this.form.condition_goods.length === 0) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      active: 1,

      form: {
        id: 0,
        name: '',
        type: '',
        supplier: '',
        commodity_price: 0,
        goods_num: 0,
        single_limit_num: 0,
        is_destroy: 0,
        default_rebate: 100,
        desc: '',
        detail: '',
        cate_id: '',
        delivery_id: '',
        c_id: '',
        sub_id: '',
        market_icon: '',
        market_price: 0,
        is_home: 0,
        cny_price: 0,
        integral_price: 0,
        images: [],
        specs_properties: [],
        specifications: 1,
        skus: [],
        stock: 0,
        limit_num: 0,
        is_change_stock: 1,
        start_time: new Date(),
        is_postage: 1,
        sort: 0,
        condition_goods: [],
        grade: []
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        condition_goods: [
          { validator: validateConditionGoods, trigger: ['blur', 'change'] }
        ],
        is_change_stock: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        detail: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        supplier: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        cate_id: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        type: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        commodity_price: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        goods_num: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        is_destroy: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        cny_price: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        integral_price: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        images: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        specs_properties: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        specifications: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        skus: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        stock: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        show_stock: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        limit_num: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        single_limit_num: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        start_time: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        is_home: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        is_postage: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        delivery_id: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        default_rebate: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        c_id: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ],
        market_price: [
          { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data?.id) {
        this.getGoodsItem(data?.id)
      }
    },
    getGoodsItem(id, is_change_stock = 0) {
      getDataItem(id)
        .then(response => {
          this.form = Object.assign(response.data, { specifications: (response.data.specs_properties.length === 0 && response.data.skus.length === 0) ? 1 : 2 }, { is_change_stock: is_change_stock }, { old_stock: response.data.stock })
        })
        .catch(() => {
        })
    },
    onPrev() {
      if (this.active > 1) { this.active-- }
    },
    onNext() {
      let isNext = true
      if (this.active === 1) {
        this.$refs.form.validateField(['cate_id', 'name', 'desc', 'cny_price', 'integral_price', 'limit_num', 'images', 'sort', 'is_postage', 'condition_goods'], errMsg => {
          if (errMsg) {
            isNext = false
          }
        })
        if (isNext) {
          this.active = 2
        }
      } else if (this.active === 2) {
        if (this.form.specifications === 2) {
          this.$refs.form.validateField(['specs_properties'], errMsg => {
            if (errMsg) {
              isNext = false
            }
          })
        }
        if (isNext) {
          this.active = 3
        }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = JSON.parse(JSON.stringify(this.form))
          if (data.specifications === 1) {
            data.specs_properties = []
            data.skus = []
          } else if (data.specifications === 2) {
            data.stock = 0
          }
          addOrUpdate(data)
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
    updateStock(val) {
      this.getGoodsItem(this.form.id, val)
    },
    onClose() {
      this.$reset()
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>

<style scoped>
.el-steps {
  margin-bottom: 30px;
}
.dialog-footer {
  text-align: center;
}
</style>
