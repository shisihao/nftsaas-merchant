<template>
  <div class="upload-container">
    <el-button :style="{ background: color, borderColor: color }" icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible = true"> 上传图片/视频 </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        ref="pictureUpload"
        :multiple="true"
        :data="{}"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-error="handleError"
        :on-change="handleChange"
        :http-request="uploadRequest"
        class="editor-slide-upload"
        action=""
        accept="image/*,video/*"
        list-type="picture-card"
      >
        <div slot="file" slot-scope="{ file }" class="upload-box">
          <div v-if="file.url" class="upload-item">
            <video v-if="file.type ? file.type.indexOf('video/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" />
            <img v-else class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          </div>
          <div v-else>
            <video v-if="file.response ? file.response.mime.indexOf('video/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" />
            <img v-else-if="file.response ? file.response.mime.indexOf('image/') >= 0 : ''" class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          </div>
          <span class="upload-status progress" :class="file.status">
            <i v-if="file.status === 'success'" class="el-icon-check" />
            <i v-else-if="file.status === 'fail'" class="el-icon-close" />
            <i v-else class="el-icon-loading" />
          </span>
          <span class="el-upload-list__item-actions">
            <!--            <span class="el-upload-list__item-preview">
              <i class="el-icon-zoom-in" />
            </span>
            <span class="el-upload-list__item-delete">
              <i class="el-icon-download" />
            </span>-->
            <span class="el-upload-list__item-delete" @click="handleRemove1(file)">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, OssKey, setToken } from '@/utils/auth'
import { getQiniuToken } from '@/api/qiniu'
import COS from 'cos-js-sdk-v5'
import CalcVideo from '@/utils/calcVideo'
import { mapGetters } from 'vuex'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      oss: {
        SecretId: '',
        SecretKey: '',
        Bucket: '',
        Region: ''
      }
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  created() {
    if (getToken(OssKey)) {
      this.oss = JSON.parse(getToken(OssKey))
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功。如果有网络问题，请刷新页面并重新上传!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    handleRemove1(file) {
      this.$refs.pictureUpload.handleRemove(file)
    },
    handleChange(file) {
      for (let i = 0, len = this.$refs.pictureUpload.uploadFiles.length; i < len; i++) {
        if (this.$refs.pictureUpload.uploadFiles[i].uid === file.uid) {
          this.$refs.pictureUpload.uploadFiles[i].type = file.raw.type
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const fileName = file.uid

      let verifySize
      if (file.type.indexOf('image') >= 0) {
        verifySize = new Promise(function(resolve, reject) {
          const _URL = window.URL || window.webkitURL
          const image = new Image()
          image.src = _URL.createObjectURL(file)
          image.onload = function() {
            resolve({
              width: image.width,
              height: image.height
            })
          }
          image.onerror = function() {
            reject()
          }
        })
      }

      let videoSize
      if (file.type.indexOf('video') >= 0) {
        videoSize = new CalcVideo(file, 1)
      }
      return new Promise((resolve, reject) => {
        if (file.type.indexOf('image/') >= 0) {
          verifySize.then(res => {
            if (res.width > 1920) {
              _self.$message.error('上传图片过大，宽度不超过`1920像素`')
              reject(false)
            } else {
              _self.listObj[fileName] = {}
              _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, type: 'image' }
              resolve(true)
            }
          })
        } else if (file.type.indexOf('video/') >= 0) {
          videoSize.then(response => {
            const { width } = response
            if (width > 750) {
              _self.$message.error('上传图片过大，宽度不超过`750像素`')
              reject(false)
            } else {
              _self.listObj[fileName] = {}
              _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: 0, height: 0, type: 'video' }
              resolve(true)
            }
          })
        }
      })
    },
    uploadRequest(options) {
      try {
        if (getToken(OssKey)) {
          this.oss = JSON.parse(getToken(OssKey))
        }
        const cos = new COS({
          SecretId: this.oss.credentials.tmpSecretId,
          SecretKey: this.oss.credentials.tmpSecretKey,
          SecurityToken: this.oss.credentials.sessionToken
        })

        const filename = `${String(+new Date()) + Math.random().toString(36).substring(2)}.${options.file.name.split('.').pop()}`

        cos.putObject(
          {
            Bucket: this.oss.bucket,
            Region: this.oss.region,
            Key: this.info.id + '/' + filename,
            Body: options.file
          },
          (err, data) => {
            if (err) {
              console.log(err)
              this.$message.error('上传失败，请重新上传')
              getQiniuToken().then(data => {
                setToken(data.data, OssKey)
              })
              return
            }
            if (data.statusCode === 200) {
              const newData = data.Location.split('/').splice(1).join('/')
              options.onSuccess(newData)
            } else {
              options.onError('上传失败')
            }
          }
        )
      } catch (e) {
        options.onError('上传失败')
      }
    },
    handleError() {
      this.$message.error('上传失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
	margin-bottom: 20px;
	::v-deep .el-upload--picture-card {
		width: 100%;
	}
}
.upload-status {
	position: absolute;
	right: -15px;
	top: -6px;
	width: 40px;
	height: 24px;
	text-align: center;
	transform: rotate(45deg);
	box-shadow: 0 0 1pc 1px rgb(0 0 0 / 20%);
	&.progress {
		background: #e6a23c;
	}
	&.success {
		background: #13ce66;
	}
	&.fail {
		background: #f56c6c;
	}
	i {
		transform: rotate(-45deg);
		margin-top: 10px;
		color: #fff;
	}
}
.upload-box {
	height: 100%;
	display: flex;
	justify-content: center;
	.upload-item {
		line-height: 1;
		img {
			object-fit: contain;
		}
	}
}
</style>
