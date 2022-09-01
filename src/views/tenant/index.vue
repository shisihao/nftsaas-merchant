<template>
  <div class="app-container">
    <div class="member-box">
      <div v-if="+new Date() < +new Date(info.expire_at)">
        <el-page-header content="会员续费" @back="goBack" />
        <el-divider />
      </div>
      <p class="member-time">
        <el-button type="primary" plain @click="onGoto('/login')">返回登录</el-button>
        <el-divider direction="vertical" />
        您的会员到期时间：<span>{{ info.expire_at }}</span>
      </p>
      <div class="mod-secton">
        <div class="content-section">
          <el-steps :active="step" finish-status="success" :process-status="step === 2 ? 'success' : 'process'" simple>
            <el-step title="1.选择续费类型" />
            <el-step title="2.订单支付" />
            <el-step title="3.等待审核" />
          </el-steps>
          <div class="member-content">
            <div class="member-form">
              <el-form ref="form" size="medium" :model="form" :rules="rules" label-width="80px">
                <div v-show="step === 0">
                  <div class="member-meal">
                    <div v-loading="mealsLoading">
                      <div class="meals-box">
                        <div class="vip-item">
                          <div class="vip-box" :class="form.meal_id === 0 ? 'active' : ''" @click="form.meal_id = 0">
                            <div class="vip-header">
                              <div class="vip-name">
                                自定义续费
                              </div>
                              <div class="vip-day">
                                个性定制更灵活
                              </div>
                            </div>
                            <div class="vip-body">
                              <div class="vip-new-price">
                                ¥{{ timesNumber(configInfo.price_day ? configInfo.price_day.price || 0 : 0, form.days || 0).toFixed(2) }}
                              </div>
                              <div class="vip-edit-day">
                                <el-input v-model.number="form.days" class="input-edit-day" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入天数" maxlength="3" clearable @blur="salaryChange" />
                              </div>
                              <div class="vip-price-month" style="margin-top: 7px;">
                                ¥{{ configInfo.price_day ? configInfo.price_day.price || 0 : 0 }} / 天
                              </div>
                              <div class="vip-price-day">
                                续费天数10-999天
                              </div>
                            </div>
                            <i class="el-icon-check vip-right" />
                          </div>
                        </div>
                        <div v-for="(value, index) in mealsOptions" :key="index" class="vip-item">
                          <div class="vip-box" :class="form.meal_id === value.id ? 'active' : ''" @click="form.meal_id = value.id;form.index = index">
                            <div class="vip-header">
                              <div class="vip-name ellipsis">
                                {{ value.name }}
                              </div>
                              <div class="vip-day ellipsis">
                                {{ value.days }}天
                              </div>
                            </div>
                            <div class="vip-body">
                              <div class="vip-new-price">
                                ¥{{ value.price }}
                              </div>
                              <div class="vip-old-price">
                                ¥{{ timesNumber(configInfo.price_day ? configInfo.price_day.price || 0 : 0, value.days) }}
                              </div>
                              <div class="vip-price-month">
                                ¥{{ timesNumber(dividedByNumber(value.price, value.days), 30).toFixed(2) }} / 月
                              </div>
                              <div class="vip-price-day ellipsis">
                                {{ value.desc }}
                              </div>
                            </div>
                            <i class="el-icon-check vip-right" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-form-item label="优惠券">
                    <el-select v-model="form.coupon_id" placeholder="请选择">
                      <el-option
                        v-for="item in couponOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="支付方式">
                    <el-radio v-model="form.type" label="cny">现金公户</el-radio>
                    <!-- <div>
                      <el-radio v-model="form.type" label="usdt">USDT</el-radio>
                    </div> -->
                  </el-form-item>
                  <el-form-item label="续费协议">
                    <el-checkbox v-model="form.agree" label="确认即同意" name="type" />
                    <el-link type="primary" style="vertical-align: initial;" :underline="false" @click="dialogRenewalVisible = true">《会员服务协议》</el-link>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onStepNext">下一步</el-button>
                  </el-form-item>
                </div>
                <div v-show="step === 1">
                  <div class="transfer-info">
                    <el-form-item label="待付款">
                      <div style="color: #E6A23C;font-size: 24px;">
                        {{ price | moneyToFormat }}元
                        <!-- <div>
                          <span v-if="form.meal_id">{{ this.form.meal_id ? mealsOptions[this.form.index].price : 0 | moneyToFormat }}</span>
                          <span v-else>{{ timesNumber(configInfo.price_day ? configInfo.price_day.price || 0 : 0, this.form.days) | moneyToFormat }}</span>
                          元
                        </div> -->
                      </div>
                    </el-form-item>
                    <el-form-item label="优惠券">
                      {{ `-${coupon}元` }}
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
                    <el-form-item v-if="step === 1 && this.price > 0" label="支付凭证" prop="credential">
                      <custom-upload
                        class-name="avatar-uploader avatar1"
                        ref-name="credential"
                        @handleBeforeUpload="beforeAvatarUpload"
                        @handleSuccess="handleAvatarSuccess"
                      >
                        <img v-if="form.credential" :src="domin + form.credential" class="avatar">
                        <img v-else src="@/assets/images/step1_add_img.png" class="avatar">
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

    <el-dialog title="会员服务协议" top="30px" width="80%" :visible.sync="dialogRenewalVisible">
      <div v-html="configInfo.renewal_agreement" />
    </el-dialog>
  </div>
</template>
<script>
import { BigNumber } from 'bignumber.js'
import CustomUpload from '@/components/Upload/CustomUpload'
import { mapGetters } from 'vuex'
import { getMeals, postStore, getCoupons } from '@/api/tenant'
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
      activeName: 0,
      currentName: 'credential',
      mealsLoading: false,
      btnLoading: false,
      dialogRenewalVisible: false,
      mealsOptions: [],
      couponOptions: [],
      oldCouponOptions: [],
      price: 0,
      coupon: 0,
      form: {
        index: 0,
        meal_id: 0,
        days: '',
        type: 'cny',
        agree: false,
        credential: '',
        coupon_id: ''
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
      this.getCoupons()
      if (this.$route.query.coupon_id && this.$route.query.coupon_id > 0) {
        this.form.coupon_id = parseInt(this.$route.query.coupon_id)
      }
    },
    goBack() {
      let path = '/'
      path = this.$route.query.path ? this.$route.query.path : path
      this.$router.replace({ path: path })
    },
    onGoto(path) {
      this.$store.dispatch('user/logout')
      this.$router.replace({ path: path })
    },
    timesNumber(num1, num2) {
      return new BigNumber(num1).times(num2)
    },
    dividedByNumber(num1, num2) {
      return new BigNumber(num1).dividedBy(new BigNumber(num2))
    },
    minusNumber(num1, num2) {
      return new BigNumber(num1).minus(num2)
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
    getCoupons() {
      getCoupons({ limit: 9999, status: 0 })
        .then((response) => {
          let isCoupon = false
          this.oldCouponOptions = response.data.data
          this.couponOptions = [{ label: '不使用优惠券', value: '' }]
          const datas = response.data.data.map(v => {
            return {
              label: `${v.title}-${v.amount}元`,
              value: v.id
            }
          })
          this.couponOptions = this.couponOptions.concat(datas)

          isCoupon = this.couponOptions.some(v => {
            return v.value === this.form.coupon_id
          })
          if (!isCoupon) {
            this.form.coupon_id = ''
          }
        })
    },
    onStepNext() {
      if (this.form.meal_id === 0 && !this.form.days) {
        return this.$message.warning('请输入续费天数')
      }
      if (!this.form.agree) {
        return this.$message.warning('请阅读并勾选协议')
      }

      if (this.form.coupon_id > 0) {
        this.coupon = parseFloat(this.oldCouponOptions.find(v => this.form.coupon_id === v.id).amount) || 0
        if (this.form.meal_id > 0) {
          if (parseFloat(this.mealsOptions[this.form.index].price) > this.coupon) {
            this.price = this.minusNumber(this.mealsOptions[this.form.index].price, this.coupon)
          } else {
            this.price = 0
          }
        } else {
          if (parseFloat(this.timesNumber(this.configInfo.price_day ? this.configInfo.price_day.price || 0 : 0, this.form.days).toString()) > this.coupon) {
            this.price = this.minusNumber(this.timesNumber(this.configInfo.price_day ? this.configInfo.price_day.price || 0 : 0, this.form.days), this.coupon)
          } else {
            this.price = 0
          }
        }
      } else {
        this.coupon = 0
        if (this.form.meal_id > 0) {
          this.price = this.mealsOptions[this.form.index].price
        } else {
          this.price = this.timesNumber(this.configInfo.price_day ? this.configInfo.price_day.price || 0 : 0, this.form.days)
        }
      }
      this.step = 1
    },
    onStepPrev() {
      this.step = 0
    },
    handleClear() {
      this.step = 0
      this.price = 0
      this.coupon = 0
      this.form = {
        meal_id: 0,
        days: '',
        type: 'cny',
        agree: false,
        credential: '',
        coupon_id: ''
      }
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          postStore(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getCoupons()
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
      if (e.target.value > 0 && e.target.value < 10) {
        this.form.days = 10
      }
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
  .content-section {
    width: 100%;
    padding: 0 20px;
  }
}
.member-content {
  margin-top: 48px;
  .member-form {
    width: 80%;
    margin: 0 auto;
    .transfer-info {
      width: 410px;
      margin: 0 auto;
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
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .vip-item {
          width: 25%;
          height: 270px;
          margin-bottom: 20px;
          .vip-box {
            width: 208px;
            height: 100%;
            border: 1px solid #DCDFE6;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            color: #333333;
            font-size: 16px;
            overflow: hidden;
            .vip-right {
              display: none;
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 2;
              color: #fff;
              font-size: 18px;
              font-weight: bolder;
            }
            .vip-header {
              height: 88px;
              background-color: #DCDFE6;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
              overflow: hidden;
              .vip-name {
                font-size: 20px;
                margin-top: 20px;
              }
              .vip-day {
                color: #666666;
                margin-top: 10px;
              }
            }
            .vip-body {
              .vip-new-price {
                font-size: 28px;
                margin-top: 22px;
                font-weight: bold;
              }
              .vip-old-price {
                color: #999999;
                text-decoration: line-through;
                margin-top: 8px;
              }
              .vip-price-month {
                margin-top: 28px;
              }
              .vip-price-day {
                font-size: 14px;
                color: #999999;
                margin-top: 10px;
              }
              .vip-edit-day {
                width: 170px;
                margin: 0 auto 0;
                text-align: center;
                .input-edit-day {
                  ::v-deep input {
                    padding: 0 40px;
                    height: 48px;
                    font-size: 16px;
                    border-left-width: 0;
                    border-right-width: 0;
                    border-top-width: 0;
                    border-radius: 0;
                    text-align: center;
                  }
                }
              }
            }
          }
          .active {
            border-color: #409EFF;
            position: relative;
            &::after {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-bottom: 30px solid #409EFF;
              border-left: 30px solid transparent;
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 1;
            }
            .vip-right {
              display: block;
            }
            .vip-header {
              background-color: #409EFF;
              .vip-name {
                color: #fff;
              }
              .vip-day {
                color: #fff;
              }
            }
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
