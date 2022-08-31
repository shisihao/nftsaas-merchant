<template>
  <el-dialog v-el-drag-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="头像" prop="avatar">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.avatar" :src="domin + form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          建议比例 1:1，不超过2M
        </div>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="昵称" maxlength="10" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="代理商等级" prop="agency_id">
        <el-select v-model="form.agency_id" placeholder="请选择">
          <el-option
            v-for="(item, index) in agencyOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="手机号/邮箱" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" clearable />
      </el-form-item>
      <el-form-item label="确认密码" prop="password_confirmation">
        <el-input v-model="form.password_confirmation" type="password" placeholder="确认密码" clearable />
      </el-form-item>
      <el-form-item v-if="form.id === 0" label="上级邀请码" prop="code">
        <el-input v-model="form.code" :disabled="form.id > 0" placeholder="上级邀请码" clearable />
      </el-form-item>
      <!-- <el-form-item label="FIL提现地址" prop="fil_address">
        <el-input v-model="form.currency_address.fil_address" placeholder="FIL提现地址" clearable />
      </el-form-item>
      <el-form-item label="ERC20提现地址" prop="erc_address">
        <el-input v-model="form.currency_address.erc_address" placeholder="ERC20提现地址" clearable />
      </el-form-item>
      <el-form-item label="BTC提现地址" prop="btc_address">
        <el-input v-model="form.currency_address.btc_address" placeholder="BTC提现地址" clearable />
      </el-form-item>
      <el-form-item label="TRX提现地址" prop="usdt_trx_address">
        <el-input v-model="form.currency_address.usdt_trx_address" placeholder="TRX提现地址" clearable />
      </el-form-item>
      <el-form-item label="XCH提现地址" prop="xch_address">
        <el-input v-model="form.currency_address.xch_address" placeholder="XCH提现地址" clearable />
      </el-form-item> -->
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
        <div class="notice1">
          注意：禁用之后用户无法登录
        </div>
      </el-form-item>
      <el-form-item label="提现状态">
        <el-checkbox v-model="form.withdrawal[key]" :key="index" v-for="(value, key, index) in form.withdrawal" :true-label="1" :false-label="0">{{ key.toUpperCase() }}</el-checkbox>
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
import elDragDialog from '@/directive/el-drag-dialog'
import { validUsername1, validPhone, validEmail, validENumber } from '@/utils/validate'
import { QiniuUrl, QiniuKey, DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/user'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  directives: { elDragDialog },
  components: { CustomUpload },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername1(value)) {
        callback(new Error('名称只能是中英文下划线及数字'))
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error('名称2位到10位之间'))
      } else {
        callback()
      }
    }
    const validateAccount= (rule, value, callback) => {
      if (!validPhone(value) && !validEmail(value)) {
        callback(new Error('请输入正确的手机号或邮箱'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else if (value && value.length < 6 || value.length > 20) {
        callback(new Error('密码6位到20位之间'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.form.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        avatar: '',
        name: '',
        account: '',
        password: '',
        password_confirmation: '',
        agency_id: 0,
        state: 0,
        /* currency_address: {
          erc_address: '',
          fil_address: '',
          btc_address: '',
          usdt_trx_address: '',
          xch_address: ''
        }, */
        withdrawal: {
          usdt: 1,
          fil: 1,
          btc: 1,
          eth: 1,
          xch: 1
        }
      },
      agencyOptions: [],
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: ['blur', 'change'] },
          { validator: validateAccount, trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: validatePassword, trigger: ['blur', 'change'] }
        ],
        password_confirmation: [
          { validator: validateConfirmPassword, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data, options) {
      this.visible = true
      this.agencyOptions = options.slice(1)
      if (data) {
        const newKeys = Object.keys(this.form).filter(v => {
          return !['password', 'password_confirmation', 'currency_address', 'withdrawal'].includes(v)
        })
        newKeys.map(v => {
          if (v === 'account') {
            this.form[v] = data['phone'] || data['email']
          } else {
            this.form[v] = data[v]
          }
        })
        /* if (data.currency_address) {
          Object.keys(this.form.currency_address).map(v => {
            if (data.currency_address[v]) {
              this.form.currency_address[v] = data.currency_address[v]
            }
          })
        } */
        if (data.withdrawal) {
          Object.keys(this.form.withdrawal).map(v => {
            if (data.withdrawal[v] >= 0) {
              this.form.withdrawal[v] = data.withdrawal[v]
            }
          })
        }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          if (!data.password) {
            delete data.password
            delete data.password_confirmation
          }

          if (!this.form.code && !this.form.id) {
            this.$confirm(`没有上级邀请码的用户，将成为平台一级用户，是否确认添加`, `确认添加`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                addOrUpdate(data)
                  .then(({ msg }) => {
                    this.$message.success(msg)
                    this.visible = false
                    this.$emit('refreshList')
                  })
                  .catch(() => {})
                  .finally(() => {
                    this.btnLoading = false
                  })
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            addOrUpdate(data)
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.$emit('refreshList')
              })
              .catch(() => {})
              .finally(() => {
                this.btnLoading = false
              })
          }

        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.avatar = response.name
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    }
  }
}
</script>

<style scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  min-height: 100px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  width: 100%;
  height: auto;
}
.notice1 {
  color: #e6a23c;
  font-size: 12px;
}
</style>
