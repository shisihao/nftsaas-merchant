<template>
  <el-upload
    v-if="refresh"
    :ref="refName"
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
import OSS from 'ali-oss'

export default {
  props: {
    refName: {
      type: String,
      default: `elUpload${String(+new Date()) + Math.random().toString(36).substr(2)}`
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
    },

  },
  data() {
    return {
      oss: {
        AccessKeyId: '',
        AccessKeySecret: '',
        BucketName: '',
        Expiration: '',
        SecurityToken: ''
      }
    }
  },
  created() {
    if (getToken(OssKey)) {
      this.oss = JSON.parse(getToken(OssKey))
    }
  },
  methods: {
    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        this.$emit('handleBeforeUpload', file, res => {
          res ? resolve(file) : reject(false)
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
        const client = new OSS({
          region: 'oss-cn-hangzhou',
          accessKeyId: this.oss.AccessKeyId,
          accessKeySecret: this.oss.AccessKeySecret,
          stsToken: this.oss.SecurityToken,
          bucket: this.oss.BucketName,
          refreshSTSToken: async() => {
          }
        })

        let _this = this
        const filename = `${String(+new Date()) + Math.random().toString(36).substr(2)}.${options.file.name.split('.').pop()}`

        client.multipartUpload(filename, options.file, {
          progress: function (p, cpt, res) {
            _this.$emit('elProgress', p, cpt, res)
          }
        }).then(res => {
          if (res.res.statusCode === 200) {
            options.onSuccess(res)
          } else {
            options.onError('上传失败')
          }
        })
          .catch((e) => {
            this.$message.error('上传失败，请重新上传')
            getQiniuToken()
              .then((data) => {
                setToken(data.data, OssKey)
              })
          })
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
.single-upload >>> .el-upload {
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
.single-upload >>> .el-upload>img {
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
