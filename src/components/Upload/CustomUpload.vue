<template>
  <el-upload
    v-if="refresh"
    :ref="refName"
    v-loading="loading"
    :class="className"
    :data="{}"
    action=""
    :http-request="fnUploadRequest"
    :accept="accept"
    :limit="limit"
    :multiple="multiple"
    :file-list="fileList"
    :show-file-list="showFileList"
    :list-type="listType"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
    :on-progress="handleProgress"
    :on-success="handleSuccess"
    :on-preview="handlePicture"
    :on-remove="handleRemove"
    :on-error="handleError"
    :on-change="handleChange"
  >
    <slot />
  </el-upload>
</template>

<script>
import { getToken, OssKey, setToken } from '@/utils/auth'
import { getQiniuToken } from '@/api/qiniu'
import COS from 'cos-js-sdk-v5'
import CalcVideo from '@/utils/calcVideo'
import { mapGetters } from 'vuex'

export default {
  props: {
    refName: {
      type: String,
      default: `elUpload${String(+new Date()) + Math.random().toString(36).substring(2)}`
    },
    refresh: {
      type: Boolean,
      default: true
    },
    uploadType: {
      type: String,
      default: 'uploadToken'
    },
    listType: {
      type: String,
      default: 'text'
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 0
    },
    multiple: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'single-upload upload-default'
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      oss: {
        SecretId: '',
        SecretKey: '',
        Bucket: '',
        Region: ''
      },
      loading: false
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
    handleBeforeUpload(file) {
      if (!this.showFileList) {
        this.loading = true
      }

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
        this.$emit('handleBeforeUpload', file, res => {
          if (res) {
            if (file.type.indexOf('image') >= 0) {
              verifySize
                .then(response => {
                  if (response.width > 2048) {
                    this.$message.error('上传图片过大，宽度不超过`2048像素`')
                    this.loading = false
                    reject(false)
                  } else {
                    resolve(file)
                  }
                })
                .catch(() => {})
            } else if (file.type.indexOf('video') >= 0) {
              videoSize
                .then(response => {
                  const { width } = response
                  if (width > 750) {
                    this.$message.error('上传图片过大，宽度不超过`750像素`')
                    this.loading = false
                    reject(false)
                  } else {
                    resolve(file)
                  }
                })
            } else {
              resolve(file)
            }
          } else {
            this.loading = false
            reject(false)
          }
        }, this.refName)
      })
    },
    handleSuccess(res, file, fileList) {
      this.$emit('handleSuccess', res, file, fileList)
    },
    handlePicture(file) {
      this.$emit('handlePicture', file)
    },
    handleChange(file, fileList) {
      this.$emit('handleChange', file, fileList)
    },
    handleExceed(files, fileList) {
      this.$emit('handleExceed', files, fileList)
    },
    handleRemove(file, fileList) {
      this.$emit('handleRemove', file, fileList)
    },
    handleProgress(event, file, fileList) {
      this.$emit('handleProgress', event, file, fileList)
    },
    handleError(err, file, fileList) {
      this.$emit('handleError', err, file, fileList)
    },
    fnUploadRequest(options) {
      try {
        if (getToken(OssKey)) {
          this.oss = JSON.parse(getToken(OssKey))
        }
        const cos = new COS({
          SecretId: this.oss.credentials.tmpSecretId,
          SecretKey: this.oss.credentials.tmpSecretKey,
          SecurityToken: this.oss.credentials.sessionToken
        })

        let filename = ''
        if (['three_url.three_image', 'three_url.three_bin'].includes(this.refName)) {
          filename = options.file.name
        } else {
          filename = `${String(+new Date()) + Math.random().toString(36).substring(2)}.${options.file.name.split('.').pop()}`
        }
        cos.putObject(
          {
            Bucket: this.oss.bucket,
            Region: this.oss.region,
            Key: this.info.id + '/' + filename,
            Body: options.file,
            onProgress: function(progressData) {
              options.onProgress(progressData.percent)
            }
          },
          (err, data) => {
            if (err) {
              console.log(err)
              this.$message.error('上传失败，请重新上传')
              getQiniuToken()
                .then((data) => {
                  setToken(data.data, OssKey)
                })
              this.loading = false
              return
            }
            if (data.statusCode === 200) {
              const newData = data.Location.split('/').splice(1).join('/')
              options.onSuccess(newData)
            } else {
              options.onError('上传失败')
            }
            this.loading = false
          }
        )
      } catch (e) {
        options.onError('上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.single-upload {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.single-upload:hover {
  border-color: #409EFF;
}
.single-upload ::v-deep .el-upload {
  width: 100%;
  height: 100%;
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
.single-upload ::v-deep .el-upload>img {
  width: 100%;
}
.upload-big {
  width: 202px;
  height: 202px;
}
.upload-default {
  width: 142px;
  height: 142px;
}
.upload-mini {
  width: 82px;
  height: 82px;
}

</style>
