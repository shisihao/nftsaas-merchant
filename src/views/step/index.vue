<template>
  <div class="app-step">
    <div class="app-step-box">
      <div class="app-step-title">
        请上传您的APP基本资料
      </div>
      <el-steps :active="step" finish-status="success" simple>
        <el-step title="1.上传基本资料" />
        <el-step title="2.选择APP模板" />
      </el-steps>
      <div class="app-step-content">
        <div v-show="step === 0">
          <div class="step-form">
            <div class="step-title">
              <span style="color: #F56C6C;">*</span> 请输入您的APP产品名
            </div>
            <el-form ref="form" :model="form" :rules="rules" size="medium">
              <el-form-item class="app-name" prop="app_name">
                <el-input v-model="form.app_name" placeholder="请输入您的APP产品名称" maxlength="10" clearable />
                <div class="name-length">
                  {{ `${form.app_name.length}/10` }}
                </div>
              </el-form-item>

              <app-step
                ref="appStep"
                :app-data="appData"
                @appLogoInfo="getAppLogoInfo"
              />

            </el-form>
          </div>
          <div class="app-step-next">
            <el-button type="primary" size="medium" @click="onStepNext">下一步</el-button>
          </div>
        </div>
        <div v-show="step === 1">
          <el-empty v-if="templateLoading" description="暂无数据" />
          <el-tabs v-else v-model="activeName" tab-position="left">
            <el-tab-pane v-for="(item, index) in templateList" :key="index" :label="templateList[index].name" :name="`tem_${index}`">
              <div class="swpier-box">
                <div class="template-title">
                  {{ templateList[index].name }}
                </div>
                <div class="swpier-content">
                  <swiper :ref="`mySwiper${index}`" :options="swiperOptions">
                    <swiper-slide v-for="(v, i) in item.images" :key="i" class="images-list">
                      <div class="phone-section" @click="onPreview(index)">
                        <el-image class="phone-box" :src="phoneBox" />
                        <div v-if="v.bottom" class="phone-tabbar">
                          <img :src="domin + v.bottom" alt="">
                        </div>
                        <div class="phone-content">
                          <img :src="domin + v.center" alt="">
                        </div>
                      </div>
                    </swiper-slide>
                    <div slot="pagination" class="swiper-pagination" />
                  </swiper>
                  <div slot="button-prev" class="swiper-button-prev" :class="item.btn === 0 ? 'swiper-button-prev-disable' : ''" @click="prev(index)" />
                  <div slot="button-next" class="swiper-button-next" :class="item.btn === 1 ? 'swiper-button-next-disable' : ''" @click="next(index)" />
                </div>
                <div class="template-introduce">
                  <span>
                    设计风格介绍
                  </span>
                  <div>
                    {{ templateList[index].desc }}
                  </div>
                </div>
              </div>

              <div class="template-btn">
                <el-button size="medium" @click="logout">退出登录</el-button>
                <el-button type="primary" size="medium" plain @click="onStepPrev">上一步</el-button>
                <el-button type="primary" size="medium" :loading="btnLoading" @click="onSubmit">确认选择</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <copyright />

    <el-dialog class="template-dailog" top="30px" :show-close="false" :visible.sync="templateVisible">
      <div slot="title">
        <div v-for="(item, index) in templateList" v-show="activeName === `tem_${index}`" :key="index" class="swpier-content">
          <swiper :ref="`previewSwiper${index}`" :options="swiperPreviewOptions">
            <swiper-slide v-for="(v, i) in item.images" :key="i" class="images-list">
              <div class="phone-section">
                <el-image class="phone-box" :src="phoneBox" />
                <div v-if="v.bottom" class="phone-tabbar">
                  <img :src="domin + v.bottom" alt="">
                </div>
                <div class="phone-content">
                  <img :src="domin + v.center" alt="">
                </div>
              </div>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination" />
          </swiper>
          <div slot="button-prev" class="swiper-button-prev swiper-button-prev1" :class="item.btn === 0 ? 'swiper-button-prev-disable' : ''" @click="previewPrev(index)" />
          <div slot="button-next" class="swiper-button-next swiper-button-next1" :class="item.btn === 1 ? 'swiper-button-next-disable' : ''" @click="previewNext(index)" />
        </div>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="agreementVisible" @closed="onClosedAgreement">
      <el-dialog
        title="使用协议"
        width="80%"
        :visible.sync="dialogRenewalVisible"
        append-to-body
      >
        <div v-html="configInfo.use_agreement" />
      </el-dialog>

      <div>
        <p>
          APP产品名：{{ form.app_name }}，模版：{{ templateList[activeIndex] ? templateList[activeIndex].name : '' }}，设计风格选择之后暂不可修改，确认选择？
        </p>
        <p>
          <el-checkbox v-model="form.agree" label="我已阅读并同意" name="type" />
          <el-link type="primary" style="vertical-align: initial;" :underline="false" @click="dialogRenewalVisible = true">《使用协议》</el-link>
        </p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="agreementVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmAgreement">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'
import { validUsername } from '@/utils/validate'
import { scrollTo } from '@/utils/scroll-to'
import Copyright from '@/components/Copyright'
import AppStep from '@/components/AppStep'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import phoneBox from '@/assets/images/step2_phone_bg2.png'
import { dataList, temList, setTem } from '@/api/design'
import { mapGetters } from 'vuex'
import { putFirst } from '@/api/common'

export default {
  name: 'Step',
  components: { AppStep, Copyright, Swiper, SwiperSlide },
  directives: {
    swiper: directive
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('只能包含汉字、字母、数字'))
      } else {
        callback()
      }
    }
    return {
      domin: getToken(DominKey),
      phoneBox,
      templateVisible: false,
      templateLoading: true,
      agreementVisible: false,
      dialogRenewalVisible: false,
      btnLoading: false,
      step: 0,
      activeName: 'tem_0',
      activeIndex: 0,
      swiperTo: {
        current: 0,
        index: 0
      },
      swiperOptions: {
        slidesPerView: 4,
        spaceBetween: 10,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        touchRatio: '0',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperPreviewOptions: {
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        navigation: {
          nextEl: '.swiper-button-next1',
          prevEl: '.swiper-button-prev1'
        },
        on: {
          slideChange: function(swiper) {
            console.log(swiper)
          }
        }
      },
      templateList: [],
      form: {
        app_name: '',
        start_logo: '',
        inside_logo: '',
        invite_logo: '',
        template_id: 0,
        agree: false
      },
      appData: {},
      rules: {
        app_name: [
          { required: true, trigger: ['blur', 'change'], validator: validateUsername }
        ]
      }
    }
  },
  computed: {
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`][0].$swiper
      }
    },
    previewSwiper() {
      return function(v = 0) {
        return this.$refs[`previewSwiper${v}`][0].$swiper
      }
    },
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  created() {
    this.init()
  },
  beforeRouteEnter(to, from, next) {
    if (from.path !== '/login') {
      next(vm => {
        vm.getTemData()
      })
    } else {
      next()
    }
  },
  methods: {
    init() {
      this.getTemList()
    },
    getTemData() {
      dataList().then(response => {
        this.appData = response.data
        this.form.app_name = response.data.app_name
      })
    },
    getTemList() {
      this.templateLoading = true
      temList()
        .then((response) => {
          if (response.data.length) {
            this.templateLoading = false
            this.templateList = response.data.map(v => {
              return Object.assign(v, { btn: 0 })
            })
          }
        })
    },
    prev(index) {
      this.swiper(index).slidePrev()
      this.templateList[index].btn = this.swiper(index).progress
    },
    next(index) {
      this.swiper(index).slideNext()
      this.templateList[index].btn = this.swiper(index).progress
    },
    previewPrev(index) {
      this.previewSwiper(index).slidePrev()
      this.templateList[index].btn = this.previewSwiper(index).progress
    },
    previewNext(index) {
      this.previewSwiper(index).slideNext()
      this.templateList[index].btn = this.previewSwiper(index).progress
    },
    onPreview(index) {
      this.templateVisible = true
      this.previewSwiper(index).slideTo(this.swiper(index).clickedIndex || 0, 0, false)
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.replace(`/login?redirect=dashboard`)
    },
    onStepPrev() {
      this.step = 0
      scrollTo(0)
    },
    onStepNext() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$refs.appStep.onsubmit()
          if (this.form.start_logo && this.form.inside_logo && this.form.invite_logo) {
            this.step = 1
            scrollTo(0)
          }
        } else {
          this.$message.error('请输入APP产品名')
        }
      })
    },
    onSubmit() {
      this.btnLoading = true
      this.activeIndex = this.activeName.split('_')[1]
      this.form.template_id = this.templateList[this.activeIndex].id
      this.agreementVisible = true
    },
    getAppLogoInfo(val) {
      for (const key in val) {
        this.form[key] = val[key]
      }
    },
    onClosedAgreement() {
      this.btnLoading = false
    },
    onConfirmAgreement() {
      if (!this.form.agree) {
        return this.$message.warning('请阅读并同意《使用协议》')
      }
      setTem(this.form)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.$router.replace({ path: '/' })
          putFirst()
        })
        .catch(error => {
          if (error.toString().indexOf('设计风格已设置，请前往编辑') >= 0) {
            putFirst()
            this.$router.replace({ path: '/design' })
          }
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.images-list {
  width: 160px;
  overflow: hidden;
}
.template-dailog ::v-deep .el-dialog {
  background: transparent;
  box-shadow: 0 0 0 transparent;
  width: 429px;
  .el-dialog__header {
    padding: 0;

    .swpier-content {
      width: 100%;
      position: relative;
      .phone-section {
        position: relative;
        .phone-box {
          position: relative;
          z-index: 1;
        }
        .phone-tabbar {
          position: absolute;
          z-index: 3;
          width: 375px;
          left: 50%;
          margin-left: -187.5px;
          bottom: 28.5px;
          overflow: hidden;
          border-bottom-left-radius: 36px;
          border-bottom-right-radius: 36px;
          img {
            width: 100%;
          }
        }
        .phone-content {
          width: 375px;
          height: 801px;
          position: absolute;
          z-index: 2;
          left: 50%;
          margin-left: -187.5px;
          top: 50%;
          margin-top: -402px;
          overflow-y: auto;
          border-radius: 36px;
          img {
            width: 100%;
          }
        }
      }
      .swiper-button-next1 {
        width: 26px;
        height: 26px;
        right: -46px;
        margin-top: -13px;
      }
      .swiper-button-prev1 {
        width: 26px;
        height: 26px;
        left: -46px;
        margin-top: -13px;
      }
      .swiper-button-next1::after {
        content: '';
        width: 26px;
        height: 26px;
        background-image: url('~@/assets/images/step2_more_you_lanse.png');
        background-repeat: no-repeat;
      }
      .swiper-button-next-disable::after {
        background-image: url('~@/assets/images/step2_more_you_huise.png');
      }
      .swiper-button-prev1::after {
        content: '';
        width: 26px;
        height: 26px;
        background-image: url('~@/assets/images/step2_more_zuo_lanse.png');
        background-repeat: no-repeat;
      }
      .swiper-button-prev-disable::after {
        background-image: url('~@/assets/images/step2_more_zuo_huise.png');
      }
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
::v-deep .el-dialog__body {
  overflow: hidden;
}
.phone-content::-webkit-scrollbar {
  display: none;
}
.app-step {
  min-height: 100%;
  background-color: #F0F2F5;
  .app-step-box {
    width: 1200px;
    margin: 0 auto;
  }
  .el-steps--simple {
    background-color: #fff;
    margin-bottom: 25px;
  }
  .app-step-title {
    padding-top: 50px;
    padding-bottom: 25px;
    font-size: 30px;
  }
  .app-step-content {
    background-color: #fff;
    padding: 40px 0;
    border-radius: 4px;
    .step-form {
      padding: 0 25px;
      .step-title {
        padding-bottom: 25px;
        font-size: 20px;
      }
      ::v-deep .app-name {
        width: 966px;
        input {
          background-color: #F5F5F5;
        }
        .name-length {
          position: absolute;
          top: 0;
          right: 36px;
          color: #A6A6A6;
        }
      }
    }
    ::v-deep .el-tabs {
      position: relative;
      .el-tabs__header {
        float: none;
        position: absolute;
        width: 190px;
        .is-active {
          background-color: #E7F7FF;
        }
        .is-left {
          text-align: left;
        }
      }
      .el-tabs__content {
        padding-left: 200px;
      }
    }
    .swpier-box {
      width: 800px;
      margin: 0 auto;
      .template-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 30px;
      }
      .swpier-content {
        width: 100%;
        position: relative;
        .phone-section {
          position: relative;
          .phone-box {
            position: relative;
            z-index: 1;
          }
          .phone-tabbar {
            position: absolute;
            z-index: 3;
            width: 170px;
            height: 42px;
            left: 50%;
            margin-left: -85px;
            bottom: 12px;
            overflow: hidden;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            img {
              width: 100%;
            }
          }
          .phone-content {
            width: 170px;
            height: 360px;
            position: absolute;
            z-index: 2;
            left: 50%;
            margin-left: -85px;
            top: 50%;
            margin-top: -182px;
            overflow-y: auto;
            border-radius: 16px;
            img {
              width: 100%;
            }
          }
        }
      }
      .template-introduce {
        margin-top: 20px;
        color: #303133;
        font-size: 14px;
        div {
          margin-top: 14px;
          line-height: 1.5;
        }
      }
      .swiper-button-next {
        width: 26px;
        height: 26px;
        right: -46px;
        margin-top: -13px;
      }
      .swiper-button-prev {
        width: 26px;
        height: 26px;
        left: -46px;
        margin-top: -13px;
      }
      .swiper-button-next::after {
        content: '';
        width: 26px;
        height: 26px;
        background-image: url('~@/assets/images/step2_more_you_lanse.png');
        background-repeat: no-repeat;
      }
      .swiper-button-next-disable::after {
        background-image: url('~@/assets/images/step2_more_you_huise.png');
      }
      .swiper-button-prev::after {
        content: '';
        width: 26px;
        height: 26px;
        background-image: url('~@/assets/images/step2_more_zuo_lanse.png');
        background-repeat: no-repeat;
      }
      .swiper-button-prev-disable::after {
        background-image: url('~@/assets/images/step2_more_zuo_huise.png');
      }
    }

    .template-btn {
      margin-top: 40px;
      text-align: center;
    }
  }
  .app-step-next {
    width: 100%;
    text-align: center;
    margin-top: 40px;
  }
}

</style>
