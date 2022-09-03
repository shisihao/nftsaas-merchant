<template>
  <div class="app-container">
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
          <el-form-item label="杉德商户号：" prop="mer_no">
            <el-input v-model="form.mer_no" :precision="0" :min="0" clearable />
          </el-form-item>
          <el-form-item label="商户公钥：" prop="mer_key">
            <el-input
              v-model="form.mer_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="杉德公钥：" prop="public_key">
            <el-input
              v-model="form.public_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="杉德私钥：" prop="private_key">
            <el-input
              v-model="form.private_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="MD5K：" prop="md5_key">
            <el-input
              v-model="form.md5_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            />
          </el-form-item>
          <el-form-item label="two_public_key：" prop="two_public_key">
            <el-input
              v-model="form.two_public_key"
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
import { aliPay, setAliPay, wxPay, setWxPay, sandPay, setSandPay } from '@/api/configs'
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
        },
        // {
        //   method: '微信支付',
        //   desc: '微信支付（pay.weixin.qq..com）是国内先进的网上支付平台',
        //   key: 2
        // },
        {
          method: '杉德支付',
          desc: '杉德支付（sandpay.com.cn）是国内先进的网上支付平台',
          key: 3
        }
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
      } else if (this.active === 3) {
        this.setSand()
      }
    },
    handleClick(row) {
      this.active = row.key
      this.visible = true
      if (this.active === 1) {
        this.getAli()
      } else if (this.active === 2) {
        this.getWx()
      } else if (this.active === 3) {
        this.getSand()
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
      }).finally(() => {
        this.btnLoading = false
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
      }).finally(() => {
        this.btnLoading = false
      })
    },
    getSand() {
      sandPay().then((res) => {
        this.form = res.data.value
      })
    },
    setSand() {
      setSandPay(this.form).then(({ msg }) => {
        this.$message.success(msg)
        this.visible = false
      }).finally(() => {
        this.btnLoading = false
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
