<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(value, index) in currencyOptions" :key="index" :label="value.label" :name="value.value">
        <el-form :ref="`${value.value}Form`" :model="form" label-width="200px">
          <el-form-item label="转账开关">
            <el-switch
              v-model="form[value.value].switch"
              active-value="on"
              inactive-value="off"
              @change="onFormSubmit()"
            />
          </el-form-item>
          <el-form-item :label="`${value.label}单日转账上限(个)`" :prop="`${value.value}.user_day_limit`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form[value.value].user_day_limit" :min="0" />
          </el-form-item>
          <el-form-item :label="`${value.label}互转手续费(个)`" :prop="`${value.value}.${value.value}_fee`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form[value.value][`${value.value}_fee`]" :min="0" />
          </el-form-item>
          <el-form-item :label="`${value.label}单次转账最低数量(个)`" :prop="`${value.value}.user_min`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
            <el-input-number v-model="form[value.value].user_min" :min="0" />
          </el-form-item>
          <el-form-item label="转账说明" :prop="`${value.value}.instr`">
            <el-input v-model="form[value.value].instr" type="textarea" :rows="10" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t("table.confirm") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { filTransfer, putFilTransfer, ethTransfer, putEthTransfer, btcTransfer, putBtcTransfer, usdtTransfer, putUsdtTransfer, xchTransfer, putXchTransfer } from '@/api/configs'
import { currencyOptions } from '@/utils/explain'

export default {
  name: 'Transformation',
  data() {
    return {
      btnLoading: false,
      currencyOptions: currencyOptions.slice(1),
      activeName: currencyOptions.slice(1).shift().value,
      form: {
        // on-开启 off-关闭
        usdt: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          usdt_fee: 0
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
        eth: {
          switch: 'on',
          instr: '',
          user_min: 0,
          user_day_limit: 0,
          eth_fee: 0
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
    handleClick(tab, event) {
      this.getList()
    },
    getList() {
      let api
      if (this.activeName === 'usdt') {
        api = usdtTransfer()
      } else if (this.activeName === 'fil') {
        api = filTransfer()
      } else if (this.activeName === 'btc') {
        api = btcTransfer()
      } else if (this.activeName === 'eth') {
        api = ethTransfer()
      } else if (this.activeName === 'xch') {
        api = xchTransfer()
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
            api = putUsdtTransfer(this.form[this.activeName])
          } else if (this.activeName === 'fil') {
            api = putFilTransfer(this.form[this.activeName])
          } else if (this.activeName === 'btc') {
            api = putBtcTransfer(this.form[this.activeName])
          } else if (this.activeName === 'eth') {
            api = putEthTransfer(this.form[this.activeName])
          } else if (this.activeName === 'xch') {
            api = putXchTransfer(this.form[this.activeName])
          }
          api
            .then(({ msg }) => {
              this.$message.success(msg)
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
