<template>
  <div class="app-container">
    <!-- <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="USDT" prop="usdt">
        <span slot="label">
          <span class="svg">
            <svg-icon icon-class="radius-usdt" style="color: #269A77;" />
          </span>
          USDT
        </span>
        <el-switch
          v-model="form.usdt"
          active-value="on"
          inactive-value="off"
          @change="onFormSubmit"
        />
      </el-form-item>
      <el-form-item label="银行卡" prop="bank">
        <span slot="label">
          <span class="svg">
            <svg-icon icon-class="radius-bank" style="color: #F59D03;" />
          </span>
          银行卡
        </span>
        <el-switch
          v-model="form.bank"
          active-value="on"
          inactive-value="off"
          @change="onFormSubmit"
        />
      </el-form-item>
    </el-form> -->
    <el-table :data="tableData" border style="width: 800px">
      <el-table-column fixed prop="method" label="支付方式名称" width="300" />
      <el-table-column
        prop="desc"
        label="支付方式描述"
        width="400"
      />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      top="30px"
      title="配置"
      :visible.sync="visible"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="支付宝应用ID：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="应用私钥：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="应用证书：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="公钥证书：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="根证书：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="通知地址：" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否启用支付：" prop="name">
          <el-switch
            v-model="form.usdt"
            active-value="on"
            inactive-value="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t("table.confirm") }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t("table.cancel") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pay, putPay } from '@/api/configs'
export default {
  name: 'Pay',
  data() {
    return {
      visible: true,
      btnLoading: false,
      form: {
        // on-开启 off-关闭
        cny: 'off',
        bank: 'off'
      },
      rules: {},
      tableData: [
        {
          method: '支付宝支付',
          desc: '支付宝网站（alipay.com）是国内先进的网上支付平台'
        },
        {
          method: '微信支付',
          desc: '微信支付（pay.weixin.qq..com）是国内先进的网上支付平台'
        },
        {
          method: '杉德支付',
          desc: '杉德支付（sandpay.com.cn）是国内先进的网上支付平台'
        }
      ]
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
      pay()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.btnLoading = true
      putPay({ switch: this.form })
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          this.getList()
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    handleClick(key) {
      console.log(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.svg {
  vertical-align: middle;
}
svg.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
