<template>
  <div class="app-container">
    <div class="member-box">
      <div v-if="+new Date() < +new Date(info.expire_at)">
        <el-page-header content="服务器续费" @back="goBack" />
        <el-divider />
      </div>
      <p class="member-time">
        <el-button type="primary" plain @click="onGoto('/login')">返回登录</el-button>
        <el-divider direction="vertical" />
        您的服务器到期时间：<span>{{ info.expire_at }}</span>
      </p>
      <div class="mod-secton">
        <div class="tabs-section">
          <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClear">
            <el-tab-pane label="选择套餐" name="meal" />
            <el-tab-pane label="自定义续费" name="custom" />
          </el-tabs>
        </div>
        <div class="content-section">
          <el-steps :active="step" finish-status="success" :process-status="step === 2 ? 'success' : 'process'" simple>
            <el-step :title="`1.${activeName === 'meal' ? '选择续费套餐' : '设定续费天数'}`" />
            <el-step title="2.订单支付" />
            <el-step title="3.等待审核" />
          </el-steps>
          <div class="member-content">
            <div class="member-form">
              <el-form ref="form" size="medium" :model="form" :rules="rules" label-width="80px">
                <div v-show="step === 0">
                  <div v-if="activeName === 'meal'" class="member-meal">
                    <div v-loading="mealsLoading">
                      <div v-if="mealsOptions.length" class="meals-box">
                        <div class="vip_list">
                          <div v-for="(value, index) in mealsOptions" :key="index" class="vip_serial" :class="form.meal_id === value.id ? 'current' : ''" @click="form.meal_id = value.id;form.index = index">
                            <div class="title">{{ value.days }} 天 </div>
                            <div class="price">
                              ￥<span class="em">{{ value.price }}</span>
                            </div>
                            <p class="desc">
                              <del>￥{{ timesNumber(configInfo.price_day ? configInfo.price_day.price || 0 : 0, value.days) }}</del>
                            </p>
                            <p class="desc">
                              {{ value.desc.slice(0, 21) }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <el-empty v-else description="暂无数据" />
                    </div>
                  </div>
                  <el-form-item v-if="activeName === 'custom'" label="续费天数" prop="days">
                    <el-input v-model.number="form.days" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入你需要续费的天数" maxlength="3" show-word-limit @blur="salaryChange" />
                  </el-form-item>
                  <el-form-item label="支付方式">
                    <el-radio v-model="form.type" label="cny">现金公户</el-radio>
                    <!-- <div>
                      <el-radio v-model="form.type" label="usdt">USDT</el-radio>
                    </div> -->
                  </el-form-item>
                  <el-form-item label="续费协议">
                    <el-checkbox v-model="form.agree" label="确认即同意" name="type" />
                    <el-link type="primary" style="vertical-align: initial;" :underline="false" @click="dialogRenewalVisible = true">《服务器服务协议》</el-link>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onStepNext">下一步</el-button>
                  </el-form-item>
                </div>
                <div v-show="step === 1">
                  <div class="transfer-info">
                    <el-form-item label="待付款">
                      <div style="color: #E6A23C;font-size: 24px;">
                        <span v-if="activeName === 'meal'">{{ form.meal_id ? mealsOptions[form.index].price : 0 | moneyToFormat }}</span>
                        <span v-else-if="activeName === 'custom'">{{ timesNumber(configInfo.price_day ? configInfo.price_day.price || 0 : 0, form.days) | moneyToFormat }}</span>
                        元
                      </div>
                    </el-form-item>
                    <el-form-item label="开户行">
                      {{ configInfo.account_receivable ? configInfo.account_receivable.bank.bank : '' }}
                    </el-form-item>
                    <el-form-item label="开户号">
                      {{ configInfo.account_receivable ? configInfo.account_receivable.bank.account_number : '' }}
                    </el-form-item>
                    <el-form-item label="开户名">
                      {{ configInfo.account_receivable ? configInfo.account_receivable.bank.account_name : '' }}
                    </el-form-item>
                    <el-form-item v-if="step === 1" label="支付凭证" prop="credential">
                      <custom-upload
                        class-name="avatar-uploader avatar1"
                        ref-name="credential"
                        @handleBeforeUpload="beforeAvatarUpload"
                        @handleSuccess="handleAvatarSuccess"
                      >
                        <img v-if="form.credential" :src="domin + form.credential" class="avatar">
                        <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
                      </custom-upload>
                      <div class="update-btn">
                        <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar1', 'img')">上传图片</el-button>
                      </div>
                    </el-form-item>
                    <el-form-item class="img-text">
                      <section>
                        请将款项转账至以上账户，并上传支付证明<br>
                        (银行转款的电子回单)
                      </section>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" plain @click="onStepPrev">上一步</el-button>
                      <el-button type="primary" :loading="btnLoading" @click="onSubmit">提交</el-button>
                    </el-form-item>
                  </div>
                  <!-- <div class="transfer-info">二维码</div> -->
                </div>
              </el-form>
            </div>
            <div v-show="step === 2" class="vip-success">
              <section>
                <div class="success-icon">
                  <i class="el-icon-check" />
                </div>
              </section>
              <div class="success-text">提交成功，请耐心等待审核</div>
              <div class="success-describe">续费订单已提交，请等待审核，大概需2~3个工作日</div>
              <el-button type="primary" size="medium" @click="handleClear">返回第一步</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="服务器服务协议" top="30px" width="80%" :visible.sync="dialogRenewalVisible">
      <div v-html="configInfo.renewal_agreement" />
    </el-dialog>
  </div>
</template>
<script>
import { BigNumber } from 'bignumber.js'
import CustomUpload from '@/components/Upload/CustomUpload'
import { mapGetters } from 'vuex'
import { getMeals, postStore } from '@/api/tenant'
import { validNumber } from '@/utils/validate'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Tanant',
  components: { CustomUpload },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error('只能是整数'))
      } else {
        callback()
      }
    }

    return {
      domin: getToken(DominKey),
      step: 0,
      activeName: 'meal',
      currentName: 'credential',
      mealsLoading: false,
      btnLoading: false,
      dialogRenewalVisible: false,
      mealsOptions: [],
      form: {
        index: 0,
        meal_id: 0,
        days: '',
        type: 'cny',
        agree: false,
        credential: ''
      },
      rules: {
        days: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: ['blur', 'change'] }
        ],
        img: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getSetMeals()
    },
    goBack() {
      this.$router.replace({ path: '/' })
    },
    onGoto(path) {
      this.$router.replace({ path: path })
    },
    timesNumber(num1, num2) {
      const num = new BigNumber(num1).times(num2)
      return num
    },
    getSetMeals() {
      this.mealsLoading = true
      getMeals()
        .then((response) => {
          this.mealsOptions = response.data || []
        })
        .finally(() => {
          this.mealsLoading = false
        })
    },
    onStepNext() {
      if (!this.form.agree) {
        return this.$message.warning('请阅读并勾选协议')
      }
      if (this.activeName === 'meal') {
        if (!this.form.meal_id) {
          return this.$message.warning('请选择套餐')
        }
        this.step = 1
      } else if (this.activeName === 'custom') {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.step = 1
          }
        })
      }
    },
    onStepPrev() {
      this.step = 0
    },
    handleClear() {
      this.step = 0
      this.form = {
        meal_id: 0,
        days: '',
        type: 'cny',
        agree: false,
        credential: ''
      }
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          postStore(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.step = 2
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleAvatarSuccess(response, file) {
      this.form[this.currentName] = response
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
    onHandleUpload(className, refName) {
      this.currentName = refName
      document.querySelector(`.${className} input`).click()
    },
    salaryChange(e) {
      this.input = e.target.value
    }
  }
}
</script>
<style lang="scss" scoped>
.member-box {
  width: 1200px;
  margin: 0 auto;
}
.member-time {
  margin: 24px 0;
  span {
    font-size: 20px;
  }
}
.mod-secton {
  display: flex;
  .tabs-section {
    width: 190px;
    .el-tabs {
      position: relative;
      width: 100%;
      height: 100%;
      ::v-deep .el-tabs__header {
        float: none;
        width: 100%;
        .is-active {
          background-color: #E7F7FF;
        }
        .is-left {
          text-align: left;
          margin-right: 0;
        }
      }
    }
  }
  .content-section {
    flex-grow: 1;
    padding: 0 20px;
  }
}
.member-content {
  margin-top: 48px;
  .member-form {
    width: 510px;
    margin: 0 auto;
    .transfer-info {
      .avatar-uploader {
        width: 200px;
        height: 200px;
        margin-top: 12px;
      }
      .update-btn {
        .logo-uploader {
          width: 200px;
          margin-top: 20px;
        }
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .img-text {
        margin: 20px 0 40px 0;
        section {
          font-size: 14px;
          color: #A6A6A6;
          line-height: 1.5;
        }
      }
    }
    .member-meal {
      width: 100%;
      .meals-box {
        .vip_list {
          width: 100%;
          .vip_serial {
            vertical-align: top;
            box-sizing: border-box;
            display: inline-block;
            position: relative;
            width: 146px;
            height: 187px;
            border: 2px solid #f0f0f0;
            border-radius: 10px;
            margin-right: 20px;
            margin-bottom: 20px;
            text-align: center;
            cursor: pointer;
            .title {
              font-size: 18px;
              color: #222;
              margin-top: 18px;
            }
            .price {
              margin-top: 10px;
              margin-bottom: 10px;
              color: #000;
              font-size: 16px;
              font-weight: 700;
              text-indent: -8px;
              .em {
                font-size: 26px;
              }
            }
            .desc {
              font-size: 16px;
              color: #979797;
              line-height: 20px;
              padding: 0 10px;
              margin-top: -2px;
              word-wrap: break-word;
            }
          }
          .current {
            border-color: #f5dab1;
            background-color: #fdf6ec;
            color: #e6a23c;
          }
        }
      }
    }
  }
  .vip-success {
    text-align: center;
    .success-icon {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      background-color: #67C23A;
      border-radius: 50%;
      color: #fff;
      i {
        line-height: 70px;
        font-size: 40px;
        font-weight: bold;
      }
    }
    .success-text {
      font-size: 24px;
      margin-top: 28px;
    }
    .success-describe {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
      margin-top: 10px;
      margin-bottom: 28px;
    }
  }

  ::v-deep .avatar-uploader .el-upload {
    width: 200px;
    height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
  }
  ::v-deep .avatar-uploader .el-upload .avatar{
    width: 100%;
    display: block;
    object-fit: contain;
  }
   ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
   ::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 200px;
    text-align: center;
  }
}
</style>
