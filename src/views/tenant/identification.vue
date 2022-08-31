<template>
  <div class="identification">
    <el-row v-if="[0, 2].includes(form.status)" class="identify-result">
      <el-col>
        <el-result v-if="form.status === 0" icon="warning" title="提交成功，请耐心等待审核" subTitle="实名认证已提交，请等待审核，大概需2~3个工作日">
          <template slot="icon">
            <i class="el-icon-time icon-time"></i>
          </template>
          <template slot="extra">
            <el-button type="primary" size="medium" @click="onInfo">查看认证信息</el-button>
          </template>
        </el-result>
        <el-result v-else-if="form.status === 2" icon="error" title="认证失败，请重新提交" :subTitle="`失败原因：${form.reason}`">
          <template slot="extra">
            <el-button type="primary" size="medium" @click="form.status = 3">重新提交</el-button>
          </template>
        </el-result>
      </el-col>
    </el-row>

    <div v-else-if="form.status === 1 && [0, 1].includes(form.type)">
      <div class="title">
        认证信息
      </div>
      <div class="content">
        <identy-info :form="form" />

        <div class="identify-type">
        <el-button type="primary" v-if="initForm.type === 0" @click="form.status = 3;form.type = 1">升级为企业认证</el-button>
        </div>
      </div>
    </div>

    <div v-else-if="form.status === 3">
      <div class="title">
        认证类型
      </div>
      
      <div class="identify-type">
        <el-radio-group v-model="form.type"  :disabled="!!form.id" @change="onChangeType">
          <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </div>

      <el-form ref="form" size="medium" :model="form" :rules="rules" label-width="150px">
        <div v-if="form.type === 0">
          <div class="title">
            个人信息
          </div>
          <div class="content">
            <el-form-item label="真实姓名" prop="user_name">
              <el-input v-model="form.user_name" placeholder="请输入真实姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="card_number">
              <el-input v-model="form.card_number" maxlength="18" placeholder="请输入身份证号" show-word-limit clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证正面" prop="positive">
              <custom-upload
                class-name="avatar-uploader avatar1"
                ref-name="positive"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <img v-if="form.positive" :src="domin + form.positive" class="avatar">
                <img v-else src="@/assets/images/icon_certification_front.png" class="avatar">
              </custom-upload>
              <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar1', 'positive')">上传图片</el-button>
              <div class="describe">
                <div>
                  1.身份证正反面文字需清晰可辨认
                </div>
                <div>
                  2.支持png、jpg、jpeg格式
                </div>
                <div>
                  3.不超过2M
                </div>
              </div>
            </el-form-item>
            <el-form-item label="身份证反面" prop="other_side">
              <custom-upload
                class-name="avatar-uploader avatar2"
                ref-name="other_side"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <img v-if="form.other_side" :src="domin + form.other_side" class="avatar">
                <img v-else src="@/assets/images/icon_certification_verso.png" class="avatar">
              </custom-upload>
              <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar2', 'other_side')">上传图片</el-button>
              <div class="describe">
                <div>
                  1.身份证正反面文字需清晰可辨认
                </div>
                <div>
                  2.支持png、jpg、jpeg格式
                </div>
                <div>
                  3.不超过2M
                </div>
              </div>
            </el-form-item>
          </div>
        </div>

        <div v-else-if="form.type === 1">
          <div class="title">
            企业基本信息
          </div>
          <div class="content">
              <el-form-item label="公司名称" prop="company_name">
                <el-input v-model="form.company_name" placeholder="请输入公司名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="所在地" prop="location">
                <el-cascader
                  size="large"
                  :options="regionOptions"
                  v-model="form.location"
                  placeholder="请选择所在地"
                />
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入详细地址" clearable></el-input>
              </el-form-item>
              <el-form-item label="统一社会信用代码" prop="social_code">
                <el-input v-model="form.social_code" maxlength="18" placeholder="请输入统一社会信用代码" show-word-limit clearable></el-input>
              </el-form-item>
              <el-form-item label="营业执照扫描" prop="business_license">
                <custom-upload
                  class-name="business-uploader avatar3"
                  ref-name="business_license"
                  @handleBeforeUpload="beforeAvatarUpload"
                  @handleSuccess="handleAvatarSuccess"
                >
                  <img v-if="form.business_license" :src="domin + form.business_license" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </custom-upload>
                <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar3', 'business_license')">上传图片</el-button>
                <div class="describe">
                  <div>
                    1.营业执照正副本均可，文字/盖章需清晰可见
                  </div>
                  <div>
                    2.原件照片或彩色扫描件，格式为png、jpg、jpeg，大小不超过2MB
                  </div>
                </div>
              </el-form-item>
          </div>

          <div class="title">
            法人信息
          </div>
          <div class="content">
            <el-form-item label="身份证正面" prop="positive">
              <custom-upload
                class-name="avatar-uploader avatar1"
                ref-name="positive"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <img v-if="form.positive" :src="domin + form.positive" class="avatar">
                <img v-else src="@/assets/images/icon_certification_front.png" class="avatar">
              </custom-upload>
              <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar1', 'positive')">上传图片</el-button>
              <div class="describe">
                <div>
                  1.身份证正反面文字需清晰可辨认
                </div>
                <div>
                  2.支持png、jpg、jpeg格式
                </div>
                <div>
                  3.不超过2M
                </div>
              </div>
            </el-form-item>
            <el-form-item label="身份证反面" prop="other_side">
              <custom-upload
                class-name="avatar-uploader avatar2"
                ref-name="other_side"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <img v-if="form.other_side" :src="domin + form.other_side" class="avatar">
                <img v-else src="@/assets/images/icon_certification_verso.png" class="avatar">
              </custom-upload>
              <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar2', 'other_side')">上传图片</el-button>
              <div class="describe">
                <div>
                  1.身份证正反面文字需清晰可辨认
                </div>
                <div>
                  2.支持png、jpg、jpeg格式
                </div>
                <div>
                  3.不超过2M
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
          
        <div v-if="[0, 1].includes(form.type)">
          <div class="title">
            短信验证
          </div>
          <div class="content">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model.number="form.phone" maxlength="11" placeholder="请输入手机号" show-word-limit clearable></el-input>
              </el-form-item>
              <div class="code-box">
                <el-form-item label="验证码" prop="code">
                  <el-input v-model.number="form.code" maxlength="6" placeholder="请输入验证码" show-word-limit clearable></el-input>
                </el-form-item>
                <el-button type="primary" size="medium" :disabled="codeStatus" :loading="codeStatusLoading" plain @click="onSendCode">
                  {{ codeText }}
                </el-button>
              </div>
          </div>
          <div class="identify-type">
            <el-button type="primary" size="medium" :loading="btnLoading" @click="onSumbit">确认提交</el-button>
            <el-button v-if="initForm.type === 0 && initForm.status === 1" size="medium" plain @click="onCancelUpgrade">取消升级</el-button>
          </div>
        </div>
      </el-form>
    </div>

    <identification-info
      v-if="infoVisible"
      ref="info"
    />

  </div>
</template>
<script>
import { getToken, DominKey } from '@/utils/auth'
import { mapGetters } from 'vuex'
import CustomUpload from '@/components/Upload/CustomUpload'
import IdentificationInfo from './components/IdentificationInfo'
import IdentyInfo from './components/IdentyInfo'
import { regionData } from 'element-china-area-data'
import { getIdentification, postIdentification, putIdentification } from '@/api/tenant'
import { getCode } from '@/api/common'
import Cookies from 'js-cookie'
import { validUsername, validIdentity, validPhone, validENumber } from '@/utils/validate'

export default {
  name: 'Identification',
  components: { CustomUpload, IdentificationInfo, IdentyInfo },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('名称只能是中英文'))
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error('名称2位到20位之间'))
      } else {
        callback()
      }
    }

    const validateIdentity = (rule, value, callback) => {
      if (!validIdentity(value)) {
        callback(new Error('身份证号错误'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号错误'))
      } else {
        callback()
      }
    }

    const validateNumber = (rule, value, callback) => {
      if (value.toString().length !== 6) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      domin: getToken(DominKey),
      regionOptions: regionData,
      currentName: '',
      codeText: '获取验证码',
      count: 60,
      curCount: '',
      interValObj: '',
      codeText: '获取验证码',
      codeStatus: false,
      codeStatusLoading: false,
      btnLoading: false,
      infoVisible: false,
      typeOptions: [
        { label: '个人认证', value: 0 },
        { label: '企业认证', value: 1 }
      ],
      initForm: {},
      form: {
        id: 0,
        type: 0,
        status: '',
        user_name: '',
        company_name: '',
        card_number: '',
        positive: '',
        other_side: '',
        business_license: '',
        social_code: '',
        location: '',
        address: '',
        phone: '',
        code: '',
        reason: '',
        updated_at: ''
      },
      rules: {
        type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        user_name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        company_name: [
          { required: true, message: '不能为空', trigger: ['blur'] },
          { validator: validateUsername, trigger: ['blur'] }
        ],
        card_number: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateIdentity, trigger: ['blur', 'change'] }
        ],
        positive: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        other_side: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        business_license: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        social_code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        location: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (parseInt(Cookies.get('residueTime') || 0) > 0 && parseInt(Cookies.get('residueTime')) - (+new Date()) > 0) {
        this.curCount = parseInt((parseInt(Cookies.get('residueTime')) - (+new Date())) / 1000)
        this.codeStatus = true
        this.codeText = `${this.curCount}s 后重发`
        this.interValObj = setInterval(this.setRemainTime, 1000)
      }
      
      this.getList()
    },
    getList() {
      getIdentification()
        .then(response => {
          if (response.data) {
            this.form = JSON.parse(JSON.stringify(response.data))
            this.initForm = JSON.parse(JSON.stringify(response.data))
          } else {
            this.form.status = this.info.identify_status
            this.form.type = 0
          }
        })
    },
    onChangeType(val) {
      Object.keys(this.form).forEach(v => {
        if (!['type', 'status'].includes(v)) {
          this.form[v] = ''
        }
      })
      this.$refs['form'].clearValidate()
    },
    onSendCode() {
      this.$refs.form.validateField('phone', errMsg => {
        if (errMsg) {
          // console.log('账号校验未通过')
        } else {
          this.getSms()
        }
      })
    },
    getSms() {
      this.codeStatus = true
      this.codeStatusLoading = true
      getCode({ scene: 'identification', account: this.form.phone })
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
    onSumbit() {
       this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          let api
          if (this.form.id) {
            api = putIdentification(this.form)
          } else {
            api = postIdentification(this.form)
          }

          api.then(({ data, msg }) => {
            this.$message.success(msg)
            Object.keys(this.form).forEach(v => {
              if (!['status'].includes(v)) {
                this.form[v] = data[v]
              }
            })
            this.form.status = 0
          })
          .catch(() => {})
          .finally(() => {
            this.btnLoading = false
          })
        }
      })
    },
    onHandleUpload(className, refName) {
      this.currentName = refName
      document.querySelector(`.${className} input`).click()
    },
    handleAvatarSuccess(response, file) {
      this.form[this.currentName] = response.name
    },
    beforeAvatarUpload(file, cb, refName) {
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
      this.currentName = refName
      cb(true)
    },
    onInfo() {
      this.infoVisible = true
      this.$nextTick(() => {
        this.$refs.info && this.$refs.info.init(this.form)
      })
    },
    onCancelUpgrade() {
      this.form = JSON.parse(JSON.stringify(this.initForm))
    }
  }
}
</script>
<style lang="scss" scoped>
.identification {
  padding: 0 20px;

  .icon-time {
    color: #e6a23c;
    font-size: 54px;
  }

  .identify-result {
    display: flex;
    justify-content: center;
  }

  .title {
    line-height: 1;
    padding: 20px 0;
    border-bottom: 1px solid #E8E8E8;
  }
  .identify-type {
    margin-left: 150px;
    padding: 20px 0;
  }
  .content {
    margin-top: 20px;
    width: 600px;

    .code-box {
      position: relative;
    }
    .code-box .el-form-item {
      width: 460px;
      display: inline-block;
    }
    .code-box .el-button {
      position: absolute;
      right: 0;
      top: 0;
    }
    .el-cascader {
      width: 100%;
    }
    .avatar-uploader {
      width: 300px;
      img {
        width: 100%;
      }
    }
    .logo-uploader {
      width: 200px;
      margin-top: 20px;
    }
    .describe {
      line-height: 1.3;
      font-size: 14px;
      color: #A6A6A6;
      margin-top: 20px;
    }

    .business-uploader ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 200px;
      min-height: 200px;

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
    .business-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar {
      width: 100%;
      height: auto;
    }
  }
}
</style>
