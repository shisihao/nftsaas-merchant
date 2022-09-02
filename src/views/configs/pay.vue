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
      <el-table-column prop="desc" label="支付方式描述" width="400" />
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
      @closed="visible = false"
    >
      <div v-if="active === 1">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
          <el-form-item label="支付宝应用ID：" prop="app_id">
            <el-input v-model="form.app_id" :precision="0" :min="0" clearable />
          </el-form-item>
          <el-form-item label="应用私钥：" prop="private_key">
            <el-input
              v-model="form.private_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="应用证书：" prop="public_key">
            <el-input
              v-model="form.public_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="公钥证书：" prop="public_key_rsa">
            <el-input
              v-model="form.public_key_rsa"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="根证书：" prop="root_cert">
            <el-input
              v-model="form.root_cert"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="active === 2">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
          <el-form-item label=" 微信应用ID：" prop="app_id">
            <el-input v-model="form.app_id" :precision="0" :min="0" clearable />
          </el-form-item>
          <el-form-item label="商户私钥：" prop="name">
            <el-input
              v-model="form.private_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="商户编号：" prop="name">
            <el-input
              v-model="form.name"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="active === 3">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
          <el-form-item label="杉德商户号：" prop="name">
            <el-input v-model="form.app_id" :precision="0" :min="0" clearable />
          </el-form-item>
          <el-form-item label="商户公钥：" prop="name">
            <el-input
              v-model="form.private_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="杉德公钥：" prop="name">
            <el-input
              v-model="form.name"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="私钥：" prop="name">
            <el-input
              v-model="form.name"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="key1keyMD5K：" prop="name">
            <el-input
              v-model="form.root_cert"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
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
import { aliPay, setAliPay, wxPay, setWxPay } from '@/api/configs'
export default {
  name: 'Pay',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {},
      rules: {},
      tableData: [
        {
          method: '支付宝支付',
          desc: '支付宝网站（alipay.com）是国内先进的网上支付平台',
          key: 1
        }
        // {
        //   method: "微信支付",
        //   desc: "微信支付（pay.weixin.qq..com）是国内先进的网上支付平台",
        //   key: 2,
        // },
        // {
        //   method: "杉德支付",
        //   desc: "杉德支付（sandpay.com.cn）是国内先进的网上支付平台",
        //   key: 3,
        // },
      ],
      active: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {},
    onFormSubmit() {
      this.btnLoading = true
      if (this.active === 1) {
        this.setAli()
      } else if (this.active === 2) {
        this.setWx()
      }
    },
    handleClick(row) {
      this.active = row.key
      this.visible = true
      if (this.active === 1) {
        this.getAli()
      } else if (this.active === 2) {
        this.getWx()
      }
    },
    getAli() {
      aliPay().then((res) => {
        this.form = res.data.value
      })
    },
    setAli() {
      setAliPay(this.form).then(({ msg }) => {
        this.$message.success(msg)
        this.visible = false
      })
    },
    getWx() {
      wxPay().then((res) => {
        this.form = res.data.value
      })
    },
    setWx() {
      setWxPay(this.form).then(({ msg }) => {
        this.$message.success(msg)
        this.visible = false
      })
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
