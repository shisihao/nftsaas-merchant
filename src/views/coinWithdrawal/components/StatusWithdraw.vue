<template>
  <el-dialog :title="form.status === 1 ? '通过申请' : '驳回申请'" :visible.sync="visible" @closed="onClose()">

    <div class="el-message-box__container">
      <div class="el-message-box__status" :class="form.status === 1 ? 'el-icon-success' : 'el-icon-warning'" />
      <div class="el-message-box__message">
        <p>{{ `${form.status === 1 ? '通过' : '驳回'} #${form.id} 申请，资产类型：${form.currency.toUpperCase()}， 提资产数：${setCutZero(form.num)}， 手续费：${setCutZero(form.fee)}， 实际：${setCutZero(minusNum(form.num, form.fee))}` }}</p>
      </div>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="margin-top: 20px">
      <div v-if="form.status === 1">
        <el-form-item v-if="['btc', 'xch'].includes(form.currency)" label="交易HASH" prop="hash">
          <el-input v-model="form.hash" placeholder="交易HASH" clearable />
        </el-form-item>

        <el-form-item v-if="!['btc', 'xch'].includes(form.currency)" label="手机验证码" prop="ver_code">
          <el-input v-model="form.ver_code" oninput="value=value.replace(/[^\d]/g,'')" placeholder="手机验证码" style="width: 320px;" show-word-limit maxlength="6" clearable />
          <el-button type="primary" style="float: right;" :disabled="codeStatus" :loading="codeStatusLoading" @click="onSendCode">
            {{ codeText }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="!['btc', 'xch'].includes(form.currency)" label="谷歌验证码" prop="code">
          <el-input v-model="form.code" oninput="value=value.replace(/[^\d]/g,'')" placeholder="谷歌验证码" show-word-limit maxlength="6" clearable />
        </el-form-item>
      </div>

      <el-form-item v-if="form.status === 2" label="驳回原因" prop="reason">
        <el-input v-model="form.reason" placeholder="驳回原因" clearable />
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
import { statusWithdraw, getCode } from '@/api/fil'
import { BigNumber } from 'bignumber.js'
import Vue from 'vue'
import Cookies from 'js-cookie'

export default {
  name: 'StatusWithdraw',
  data() {
    const validateNumberLength = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        hash: '',
        reason: '',
        status: 0,
        num: 0,
        fee: 0,
        currency: '',
        code: '',
        ver_code: ''
      },
      rolesOptions: [],
      count: 60,
      curCount: '',
      interValObj: '',
      codeText: '获取验证码',
      codeStatus: false,
      codeStatusLoading: false,
      rules: {
        reason: [
          { required: true, message: '请输入驳回原因', trigger: ['blur', 'change'] }
        ],
        hash: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumberLength, trigger: ['blur'] }
        ],
        ver_code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumberLength, trigger: ['blur'] }
        ]
      }
    }
  },
  created() {
    if (parseInt(Cookies.get('residueTime') || 0) > 0 && parseInt(Cookies.get('residueTime')) - (+new Date()) > 0) {
      this.curCount = parseInt((parseInt(Cookies.get('residueTime')) - (+new Date())) / 1000)
      this.codeStatus = true
      this.codeText = `${this.curCount}s 后重发`
      this.interValObj = setInterval(this.setRemainTime, 1000)
    }
  },
  methods: {
    init(data, status) {
      this.visible = true
      this.form.id = data.id
      this.form.num = data.num
      this.form.status = status
      this.form.currency = data.currency
      this.form.fee = data.fee
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确定${this.form.status === 1 ? '通过' : '驳回'}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
            .then(() => {
              this.btnLoading = true
              statusWithdraw(this.form)
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
    },
    setCutZero(value) {
      return Vue.filter('cutZero')(value)
    },
    minusNum(num, fee) {
      return new BigNumber(num).minus(fee)
    },
    setRemainTime() {
      if (this.curCount <= 1) {
        clearInterval(this.interValObj)
        this.codeText = '重新发送'
        this.codeStatus = false
      } else {
        this.curCount--
        this.codeText = `${this.curCount}s 后重发`
      }
    },
    onSendCode() {
      this.codeStatus = true
      this.codeStatusLoading = true
      getCode()
        .then((data) => {
          this.curCount = this.count
          this.codeText = `${this.curCount}s 后重发`
          Cookies.set('residueTime', +new Date() + this.count * 1000, { expires: new Date(+new Date() + this.count * 1000) })
          this.interValObj = setInterval(this.setRemainTime, 1000)
        })
        .catch(() => {
          this.codeStatus = false
        })
        .finally(() => {
          this.codeStatusLoading = false
        })
    }
  }
}
</script>
