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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
          <el-form-item label="rsa公钥证书：" prop="public_key_rsa">
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
            <!-- <el-input
              v-model="form.public_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            /> -->
            <custom-upload
              ref-name="public_key"
              class-name=""
              :limit="1"
              :show-file-list="true"
              :file-list="fileList1"
              @handleBeforeUpload="handleBeforeUpload1"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @handleSuccess="handleSuceess"
            >
              <el-button type="primary">点击上传</el-button>
            </custom-upload>
            <div class="el-upload__tip notice">只能上传cer文件</div>
          </el-form-item>
          <el-form-item label="杉德私钥：" prop="private_key">
            <!-- <el-input
              v-model="form.private_key"
              type="textarea"
              :rows="5"
              :precision="0"
              :min="0"
              clearable
            /> -->
            <custom-upload
              ref-name="private_key"
              class-name=""
              :limit="1"
              :show-file-list="true"
              :file-list="fileList2"
              @handleBeforeUpload="handleBeforeUpload2"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @handleSuccess="handleSuceess"
            >
              <el-button type="primary">点击上传</el-button>
            </custom-upload>
            <div class="el-upload__tip notice">只能上传pfx文件</div>
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
          <el-form-item label="杉德私钥密码：" prop="private_pass">
            <el-input
              v-model="form.private_pass"
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
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'Pay',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {},
      rules: {},
      fileList1: [],
      fileList2: [],
      currentName: '',
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
    },
    handleBeforeUpload1(file, cb, refName) {
      const a = file.name.split('.')
      const isLt2M = file.size / 1024 / 1024 < 3
      if (a[a.length - 1] !== 'cer') {
        this.$message.error('上传文件只能是 cer 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 3M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleBeforeUpload2(file, cb, refName) {
      const a = file.name.split('.')
      const isLt2M = file.size / 1024 / 1024 < 3
      if (a[a.length - 1] !== 'pfx') {
        this.$message.error('上传文件只能是 pfx 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 3M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    handleRemove() {
      this.form[this.currentName] = ''
    },
    handleSuceess(response) {
      this.form[this.currentName] = response
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
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  // margin-top: 10px;
}
</style>
