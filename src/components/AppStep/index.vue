<template>
  <div class="app-step-logo">
    <div class="step-title">
      {{ title }}
    </div>
    <el-form ref="form" :model="form" :rules="rules" size="medium">
      <div class="logo-box">
        <el-form-item label="启动页logo" prop="start_logo">
          <custom-upload class-name="avatar-uploader avatar1" ref-name="start_logo" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.start_logo" :src="domin + form.start_logo" class="avatar">
            <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
          </custom-upload>
          <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar1', 'start_logo')">上传图片</el-button>
          <div class="describe">
            <div> 1.尺寸为256px * 256px </div>
            <div> 2.支持png格式 </div>
            <div> 3.不超过2M </div>
          </div>
        </el-form-item>
        <div>
          <div class="logo-title logo-title-cover"> 示例 </div>
          <div class="logo1">
            <img src="@/assets/images/design/shuban_icon_logo.png">
          </div>
        </div>
        <div>
          <div class="logo-title"> 应用场景 </div>
          <div class="logo2">
            <img src="@/assets/images/design/step1_changjing1.png">
          </div>
        </div>
      </div>
      <el-divider />
      <div class="logo-box">
        <el-form-item label="子页面应用logo" prop="invite_logo">
          <custom-upload class-name="avatar-uploader avatar2" ref-name="invite_logo" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.invite_logo" :src="domin + form.invite_logo" class="avatar">
            <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
          </custom-upload>
          <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar2', 'invite_logo')">上传图片</el-button>
          <div class="describe">
            <div> 1.尺寸为256px * 64px </div>
            <div> 2.支持png格式 </div>
            <div> 3.不超过2M </div>
          </div>
        </el-form-item>
        <div>
          <div class="logo-title logo-title-cover"> 示例 </div>
          <div class="logo3">
            <img src="@/assets/images/design/hengban_icon_logo.png">
          </div>
        </div>
        <div>
          <div class="logo-title"> 应用场景 </div>
          <div class="logo2">
            <img src="@/assets/images/design/step1_changjing2.png">
          </div>
        </div>
      </div>
      <el-divider />

      <div class="logo-box">
        <el-form-item label="不带产品名图片logo" prop="inside_logo">
          <custom-upload class-name="avatar-uploader avatar3" ref-name="inside_logo" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.inside_logo" :src="domin + form.inside_logo" class="avatar">
            <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
          </custom-upload>
          <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar3', 'inside_logo')">上传图片</el-button>
          <div class="describe">
            <div> 1.尺寸为112 * 112px </div>
            <div> 2.支持png格式 </div>
            <div> 3.不超过2M </div>
          </div>
        </el-form-item>
        <div>
          <div class="logo-title logo-title-cover"> 示例 </div>
          <div class="logo1">
            <img src="@/assets/images/design/appicon1024x1024.png">
          </div>
        </div>
        <div>
          <div class="logo-title"> 应用场景 </div>
          <div class="logo2">
            <img src="@/assets/images/design/step1_changjing3.png">
          </div>
        </div>
      </div>
      <el-divider />

      <div class="logo-box">
        <el-form-item label="藏品专区banner" prop="goods_banner">
          <custom-upload class-name="avatar-uploader avatar4" ref-name="goods_banner" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.goods_banner" :src="domin + form.goods_banner" class="avatar">
            <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
          </custom-upload>
          <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar4', 'goods_banner')">上传图片</el-button>
          <div class="describe">
            <div> 1.尺寸为750px * 540px </div>
            <div> 2.支持png格式 </div>
            <div> 3.不超过2M </div>
          </div>
        </el-form-item>
        <div>
          <div class="logo-title logo-title-cover"> 示例 </div>
          <div class="logo3">
            <img src="@/assets/images/design/changjing4_shili.png">
          </div>
        </div>
        <div>
          <div class="logo-title"> 应用场景 </div>
          <div class="logo2">
            <img src="@/assets/images/design/step1_changjing4.png">
          </div>
        </div>
      </div>
      <el-divider />

      <div class="logo-box">
        <el-form-item label="h5下载页" prop="download_image">
          <custom-upload class-name="avatar-uploader avatar5" ref-name="download_image" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.download_image" :src="domin + form.download_image" class="avatar">
            <img v-else src="@/assets/images/design/step1_add_img.png" class="avatar">
          </custom-upload>
          <el-button class="logo-uploader" type="success" size="small" plain @click="onHandleUpload('avatar5', 'download_image')">上传图片</el-button>
          <div class="describe">
            <div> 1.尺寸为750px * 1624px </div>
            <div> 2.支持png格式 </div>
            <div> 3.不超过2M </div>
          </div>
        </el-form-item>
        <div>
          <div class="logo-title logo-title-cover logo5-title"> 示例 </div>
          <div class="logo3">
            <img src="@/assets/images/design/changjing5@2x.png">
          </div>
        </div>
        <div>
          <div class="logo-title"> 应用场景 </div>
          <div class="logo2">
            <img src="@/assets/images/design/step1_changjing5@2x.png">
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'AppStep',
  components: { CustomUpload },
  props: {
    title: {
      type: String,
      default: '请上传您的APP的logo'
    },
    appData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      currentName: '',
      form: {
        start_logo: '',
        invite_logo: '',
        inside_logo: '',
        goods_banner: '',
        download_image: ''
      },
      rules: {
        start_logo: [{ required: true, trigger: ['blur', 'change'], message: '请上传启动页logo' }],
        invite_logo: [{ required: true, trigger: ['blur', 'change'], message: '请上传子页面应用logo' }],
        inside_logo: [{ required: true, trigger: ['blur', 'change'], message: '不带产品名图片logo' }],
        goods_banner: [{ required: true, trigger: ['blur', 'change'], message: '藏品专区banner图片' }],
        download_image: [{ required: true, trigger: ['blur', 'change'], message: '请上传h5下载页图片' }]
      }
    }
  },
  watch: {
    appData(newVal, oldVal) {
      if (newVal) {
        this.form.start_logo = newVal.start_logo
        this.form.invite_logo = newVal.invite_logo
        this.form.inside_logo = newVal.inside_logo
        this.form.goods_banner = newVal.goods_banner
        this.form.download_image = newVal.download_image
      }
    }
  },
  created() {},
  methods: {
    onImage(data) {
      this.imageIndex = data
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
    onsubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('appLogoInfo', this.form)
        } else {
          this.$message.error('请上传logo')
        }
      })
    },
    setForm(val) {
      for (const key in this.form) {
        this.form[key] = val[key]
      }
    }
  }
}
</script>
<style scoped lang="scss">
.app-step-logo {
	width: 1000px;
	.step-title {
		padding-top: 21px;
		padding-bottom: 25px;
		font-size: 20px;
	}
	.logo-box {
		display: flex;
		justify-content: space-between;

		::v-deep .el-form-item__label {
			margin-bottom: 20px;
			color: #808080;
			font-size: 16px;
			font-weight: normal;
		}
		.logo-title {
			margin-top: 10px;
			margin-bottom: 20px;
			color: #808080;
		}
		.logo-title-cover {
			margin-bottom: 50px;
		}
    .logo5-title{
      margin-bottom: 30px;
    }
		.logo-uploader {
			width: 200px;
			margin-top: 20px;
		}
		.describe {
			line-height: 1.3;
			font-size: 14px;
			color: #a6a6a6;
			margin-top: 20px;
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
	::v-deep .avatar-uploader .el-upload .avatar {
		width: 100%;
		display: block;
		object-fit: contain;
	}
	::v-deep .avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	::v-deep .avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100%;
		height: 100%;
		line-height: 200px;
		text-align: center;
	}
	.logo1 {
		width: 109px;
		height: 100px;
		img {
			width: 100%;
		}
	}
	.logo2 {
		width: 170px;
		height: 332px;
		img {
			width: 100%;
		}
	}
	.logo3 {
		width: 186px;
		img {
			width: 100%;
		}
	}

}
</style>
