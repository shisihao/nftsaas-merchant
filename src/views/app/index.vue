<template>
  <div v-loading="loading" class="app-container">
    <el-empty v-if="contentLoading" description="暂无数据" />
    <el-tabs v-else v-model="activeName" type="card">
      <el-tab-pane label="我的APP主题色" name="app">
        <div class="app-content">
          <div class="app-location">
            当前统一下载地址：<el-link type="success">{{ `${originUrl}/download` }}</el-link>
          </div>
          <div>
            <div>
              <tem-app :color="form.default_color" :index="index" />
            </div>
            <div class="app-preview">
              我的APP预览
            </div>
          </div>
          <div>
            <p>自定义主题色</p>
            <div class="color-section">
              <el-color-picker v-model="form.default_color" class="color-box" />
              <div class="color-item">
                当前颜色
                <div class="clolor-select" :style="`background-color: ${form.default_color};`" />
                <p>推荐颜色</p>
                <ul class="color-list">
                  <li v-for="(value, index1) in colorList" :key="index1" :style="`background-color: ${value};`" @click="onSelectColor(value)" />
                </ul>
              </div>
            </div>
          </div>
          <div class="color-btn">
            <el-button size="medium" @click="onCancelColor">取消更改</el-button>
            <el-button type="primary" size="medium" :loading="btnLoading" @click="onSubmitColor">确认更改</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的APPlogo" name="logo">
        <div class="app-content">
          <app-step
            ref="appStep"
            title="我的APP当前logo"
            @appLogoInfo="getAppLogoInfo"
          />
          <div class="color-btn">
            <el-button size="medium" @click="onCancelLogo">取消更改</el-button>
            <el-button type="primary" size="medium" :loading="btnLoading" @click="onSubmitColor">确认更改</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TemApp from './components/TemApp'
import AppStep from '@/components/AppStep'
import { dataList, putTem } from '@/api/design'

export default {
  name: 'About',
  components: { TemApp, AppStep },
  data() {
    return {
      loading: false,
      contentLoading: true,
      btnLoading: false,
      activeName: 'app',
      index: 0,
      originUrl: location.origin,
      colorList: [],
      defaultColor: '',
      defaultLogo: {
        start_logo: '',
        inside_logo: '',
        invite_logo: '',
        goods_banner: '',
        download_image: ''
      },
      form: {
        default_color: '',
        start_logo: '',
        inside_logo: '',
        invite_logo: '',
        goods_banner: '',
        download_image: ''
      }

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
      this.loading = true
      dataList()
        .then((response) => {
          this.colorList = response.data.template.recommend_color
          this.index = response.data.template.type
          this.defaultColor = response.data.default_color
          this.color = response.data.default_color
          this.form.default_color = response.data.default_color
          this.form.start_logo = response.data.start_logo
          this.form.inside_logo = response.data.inside_logo
          this.form.invite_logo = response.data.invite_logo
          this.form.goods_banner = response.data.goods_banner
          this.form.download_image = response.data.download_image
          this.defaultLogo.start_logo = response.data.start_logo
          this.defaultLogo.inside_logo = response.data.inside_logo
          this.defaultLogo.invite_logo = response.data.invite_logo
          this.defaultLogo.goods_banner = response.data.goods_banner
          this.defaultLogo.download_image = response.data.download_image
          this.contentLoading = false
          this.$nextTick(() => {
            this.$refs.appStep && this.$refs.appStep.setForm(this.form)
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSelectColor(val) {
      this.form.default_color = val
    },
    onCancelColor() {
      this.form.default_color = this.defaultColor
    },
    onCancelLogo() {
      for (const key in this.defaultLogo) {
        this.form[key] = this.defaultLogo[key]
      }
      this.$nextTick(() => {
        this.$refs.appStep && this.$refs.appStep.setForm(this.form)
      })
    },
    getAppLogoInfo(val) {
      for (const key in val) {
        this.form[key] = val[key]
      }
    },
    onSubmitColor() {
      this.$refs.appStep.onsubmit()
      if (this.form.start_logo && this.form.inside_logo && this.form.invite_logo) {
        this.btnLoading = true
        putTem(this.form)
          .then(({ msg }) => {
            this.$message.success(msg)
            this.getList()
          })
          .finally(() => {
            this.btnLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-content {
  padding: 20px;
  overflow-x: auto;
  .app-location {
    margin-bottom: 28px;
  }
  .app-preview {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .color-section {
    display: flex;
    ::v-deep .color-box {
      height: auto;
      .el-color-picker__trigger {
        display: none;
      }
      .el-color-dropdown {
        display: block !important;
        position: static;
        box-shadow: 0 0 0 transparent;
        .el-button--text {
          display: none;
        }
      }
    }
    .color-item {
      margin-left: 40px;
      .clolor-select {
        width: 84px;
        height: 84px;
        border-radius: 4px;
        margin-top: 16px;
      }
      .color-list {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          margin-right: 20px;
          margin-bottom: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .color-btn {
    margin-top: 40px;
    padding-left: 450px;
  }
}
</style>
