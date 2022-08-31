<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" :before-leave="onHanleBefore" @tab-click="handleClick">
      <el-tab-pane v-for="(value, index) in currencyReportOptions" :key="index" :label="value.label" :name="value.value">
        <el-form :ref="`${value.value}Form`" :model="form" label-width="200px">
          <el-form-item label="提现开关">
            <el-switch
              v-model="form[value.value].switch"
              active-value="on"
              inactive-value="off"
              @change="onFormSubmit()"
            />
          </el-form-item>

          <div v-if="value.value === 'usdt'">
            <el-form-item prop="usdt.usdt_erc_fee" label="ERC20提现手续费(个)" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.usdt.usdt_erc_fee" :min="0" />
            </el-form-item>

            <el-form-item prop="usdt.usdt_trx_fee" label="TRC20提现手续费(个)" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.usdt.usdt_trx_fee" :min="0" />
            </el-form-item>
          </div>

          <el-form-item v-else :label="`${value.label}提现手续费(${value.value === 'cny' ? '元' : '个'})`" :prop="`${value.value}.${value.value}_fee`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-if="value.value === 'cny'" v-model="form[value.value][`${value.value}_fee`]" :min="0" :precision="2" />
            <el-input-number v-else v-model="form[value.value][`${value.value}_fee`]" :min="0" />
          </el-form-item>

          <el-form-item :label="`${value.label}平台单日提现上限(${value.value === 'cny' ? '元' : '个'})`" :prop="`${value.value}.terrace_day_limit`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number  v-model="form[value.value]['terrace_day_limit']" :min="0" />
          </el-form-item>

          <el-form-item :label="`用户最低提现额(${value.value === 'cny' ? '元' : '个'})`" :prop="`${value.value}.user_min`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-if="value.value === 'cny'" v-model="form[value.value].user_min" :step="10" :min="0" :precision="2" />
            <el-input-number v-else v-model="form[value.value].user_min" :step="10" :min="0" />
          </el-form-item>

          <el-form-item :label="`用户单日提现额上限(${value.value === 'cny' ? '元' : '个'})`" :prop="`${value.value}.user_day_limit`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-if="value.value === 'cny'" v-model="form[value.value].user_day_limit" :step="1000" :min="0" :precision="2" />
            <el-input-number v-else v-model="form[value.value].user_day_limit" :step="1000" :min="0" />
          </el-form-item>
          
          <el-form-item label="提现说明" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input v-model="form[value.value].instr" type="textarea" :rows="10" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t('table.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { cnyWithdrawal, putCnyWithdrawal, usdtWithdrawal, putUsdtWithdrawal, filWithdrawal, putFilWithdrawal, btcWithdrawal, putBtcWithdrawal, ethWithdrawal, putEthWithdrawal, xchWithdrawal, putXchWithdrawal } from '@/api/configs'
import { currencyReportOptions } from '@/utils/explain'

export default {
  name: 'WithdrawalDel',
  data() {
    return {
      btnLoading: false,
      currencyReportOptions: currencyReportOptions.slice(1).filter(v => v.value !== 'dfb'),
      activeName: currencyReportOptions.find(v => !!v.value).value,
      form: {
        // on-开启 off-关闭
        usdt: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          usdt_trx_fee: 0,
          usdt_erc_fee: 0
        },
        fil: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          fil_fee: 0
        },
        btc: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          btc_fee: 0
        },
        cny: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          cny_fee: 0
        },
        eth: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          erc_fee: 0
        },
        xch: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          xch_fee: 0
        }
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
    onHanleBefore(val, old) {
      this.$refs[`${old}Form`][0].resetFields()
    },
    handleClick(tab, event) {
      this.getList()
    },
    getList() {
      let api
      if (this.activeName === 'usdt') {
        api = usdtWithdrawal()
      } else if (this.activeName === 'fil') {
        api = filWithdrawal()
      } else if (this.activeName === 'btc') {
        api = btcWithdrawal()
      } else if (this.activeName === 'cny') {
        api = cnyWithdrawal()
      } else if (this.activeName === 'eth') {
        api = ethWithdrawal()
      } else if (this.activeName === 'xch') {
        api = xchWithdrawal()
      }
      api
        .then(response => {
          this.form[this.activeName] = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs[`${this.activeName}Form`][0].validate(valid => {
        if (valid) {
          this.btnLoading = true
          let api
          if (this.activeName === 'usdt') {
            api = putUsdtWithdrawal(this.form[this.activeName])
          } else if (this.activeName === 'fil') {
            api = putFilWithdrawal(this.form[this.activeName])
          } else if (this.activeName === 'btc') {
            api = putBtcWithdrawal(this.form[this.activeName])
          } else if (this.activeName === 'cny') {
            api = putCnyWithdrawal(this.form[this.activeName])
          } else if (this.activeName === 'eth') {
            api = putEthWithdrawal(this.form[this.activeName])
          } else if (this.activeName === 'xch') {
            api = putXchWithdrawal(this.form[this.activeName])
          }
          api
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

<style scoped>
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.app-container {
  width: 800px;
}
</style>
