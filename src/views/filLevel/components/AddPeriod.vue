<template>
  <div>
    <el-dialog title="分发收益" width="1000px" :visible.sync="visible" @closed="onClose()">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form ref="form" :model="form" :rules="rules" label-width="180px">
            <el-form-item label="专区">
              <div style="text-transform:uppercase;">
                {{ form.type }}
              </div>
            </el-form-item>
            <el-form-item v-if="form.node && ['fil'].includes(form.type)" label="节点号">
              {{ form.node }}
            </el-form-item>
            <el-form-item label="期数">
              {{ form.name }}
            </el-form-item>
            <el-form-item v-if="['fil'].includes(form.type)" label="期数类型">
              {{ form.cate | paraphrase(catesOptions) }}
            </el-form-item>
            <el-form-item v-if="['fil'].includes(form.type)" label="规格">
              {{ form.specs.name }}
            </el-form-item>

            <template v-if="form.currency">
              <el-form-item label="有效算力">
                <div>
                  {{ data.mingSpec }}
                </div>
              </el-form-item>
              <el-form-item v-if="['eth', 'btc'].includes(form.currency)" label="欠费停机算力">
                <div>
                  {{ data.arrearsSpec }}
                </div>
              </el-form-item>
              <el-form-item label="总封装数">
                <div>
                  {{ data.fz_num | cutZero }}
                </div>
              </el-form-item>
              <el-form-item label="订单总算力">
                <div>
                  {{ Number(data.mingSpec) + Number(data.arrearsSpec) }}
                </div>
                <div class="notice">
                  注意：订单总算力为该期数的所有订单总算力
                </div>
              </el-form-item>
              <div v-if="form.currency === 'fil'">
                <div v-if="form.cate === 1">
                  <el-form-item label="已收取GAS">
                    {{ data.sync_use_gas }}
                  </el-form-item>
                  <el-form-item label="已收取质押">
                    {{ data.sync_use_pledge }}
                  </el-form-item>
                </div>
                <div v-if="form.cate === 2">
                  <el-form-item label="已分发同步资产GAS">
                    {{ data.sync_use_gas }}
                  </el-form-item>
                  <el-form-item label="已分发同步资产质押">
                    {{ data.sync_use_pledge }}
                  </el-form-item>
                  <el-form-item label="已分发不同步资产GAS">
                    {{ data.unsync_use_gas }}
                  </el-form-item>
                  <el-form-item label="已分发不同步资产质押">
                    {{ data.unsync_use_pledge }}
                  </el-form-item>
                  <el-form-item label="是否同步资产" prop="sync_wallet">
                    <el-select v-model="form.sync_wallet">
                      <el-option label="否" :value="0" />
                      <el-option label="是" :value="1" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="分发数量" prop="amount">
                <el-input-number v-model="form.amount" controls-position="right" :min="0" placeholder="请输入数字" clearable @change="onTotalNum" />
              </el-form-item>
              <el-form-item v-if="['fil', 'xch'].includes(form.currency)" label="封装总数" prop="fz_num">
                <el-input-number v-model="form.fz_num" controls-position="right" :min="0" placeholder="请输入数字" clearable />
              </el-form-item>
              <el-form-item v-if="form.currency === 'fil'" :label="`${form.cate === 0 ? '借贷' : '使用'}质押数量`" prop="pledge">
                <el-input-number v-model="form.pledge" controls-position="right" :min="0" placeholder="请输入数字" clearable />
              </el-form-item>
              <el-form-item v-if="form.currency === 'fil'" :label="`${form.cate === 0 ? '借贷' : '使用'}gas数量`" prop="gas">
                <el-input-number v-model="form.gas" controls-position="right" :min="0" placeholder="请输入数字" clearable />
              </el-form-item>
            </template>
            <el-form-item>
              <el-button v-if="form.currency" type="primary" :loading="btnLoading" @click="onFormSubmit()">
                {{ $t('table.confirm') }}
              </el-button>
              <el-button @click="visible = false">
                {{ $t('table.cancel') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div style="position: absolute;width: 450px;height: 100%;background-color: #F5F7FA;border-radius: 6px;">
            <b-period v-if="visible" :zone="form.type" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <dialog-issue
      v-if="dialogIssueVisible"
      ref="dialogIssue"
      @addOrUpdateVisable="visible = false"
    />
  </div>
</template>

<script>
import DialogIssue from './DialogIssue'
import { getSpecs } from '@/api/fil'
import { toFixedDigit } from '@/utils'
import { zoneOptions, catesOptions } from '@/utils/explain'
import BPeriod from './BPeriod'

export default {
  name: 'AddPeriod',
  components: { DialogIssue, BPeriod },
  data() {
    const validateReplace = (rule, value, callback) => {
      if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        callback(new Error('必须是大于0的数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      dialogIssueVisible: false,
      bPeriodVisible: false,
      catesOptions,
      currencyOptions: zoneOptions.slice(1),
      data: {
        fz_num: 0,
        mingSpec: 0,
        arrearsSpec: 0,
        collect_gas: 0,
        collect_pledge: 0,
        sync_use_gas: 0,
        sync_use_pledge: 0,
        unsync_use_gas: 0,
        unsync_use_pledge: 0
      },
      form: {
        id: 0,
        period_id: 0,
        node: '',
        name: '',
        cate: '',
        type: '',
        specs: {},
        order_count: 0,
        amount: 0,
        currency: '',
        fz_num: 0,
        pledge: 0,
        gas: 0,
        sync_wallet: 0
      },
      rules: {
        currency: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '期数不能为空', trigger: ['blur', 'change'] }
        ],
        fz_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        amount: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateReplace, trigger: ['blur', 'change'] }
        ],
        pledge: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        gas: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      if (data) {
        this.visible = true
        this.form = Object.assign({}, this.form, { period_id: data.id, currency: data.type }, data, { amount: 0, fz_num: 0, gas: 0, pledge: 0 })
        this.getOrderSpec()
      }
    },
    getOrderSpec() {
      getSpecs({ period_id: this.form.id, currency: this.form.currency })
        .then((response) => {
          this.data = response.data
          this.form.order_count = response.data.mingSpec
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const formData = Object.assign({}, this.form)
          if (this.form.type !== 'fil') {
            ['pledge', 'gas'].forEach(item => {
              formData[item] = 0
            })
          }
          this.onDialogIssue(formData, this.data)
        }
      })
    },
    onClose() {
      this.$reset()
    },
    onTotalNum(currentValue) {
      this.form.amount = toFixedDigit(currentValue, 8)
    },
    onDialogIssue(formData, data) {
      this.dialogIssueVisible = true
      this.$nextTick(() => {
        this.$refs.dialogIssue && this.$refs.dialogIssue.init(formData, data)
      })
    }
  }
}
</script>
<style scoped>
.el-input-number {
  width: 200px;
}
.notice {
  color: #E6A23C;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
</style>
