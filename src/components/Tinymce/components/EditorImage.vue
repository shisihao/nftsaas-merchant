<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片/视频
    </el-button>
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
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, OssKey, setToken } from '@/utils/auth'
import { getQiniuToken } from '@/api/qiniu'
import OSS from 'ali-oss'

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
          this.listObj[objKeyArr[i]].url = response.url
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
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        if (file.type.indexOf('image/') >= 0) {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height, type: 'image' }
          }
        } else if (file.type.indexOf('video/') >= 0) {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: 0, height: 0, type: 'video' }
        }
        resolve(true)
      })
    },
    uploadRequest(options) {
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

        const filename = `${String(+new Date()) + Math.random().toString(36).substr(2)}.${options.file.name.split('.').pop()}`

        client.put(filename, options.file).then(res => {
          if (res.res.statusCode === 200) {
            options.onSuccess(res)
          } else {
            options.onError('上传失败')
          }
        })
          .catch((e) => {
            this.handleRemove1(options.file)
            this.$message.error('上传失败，请重新上传')
            getQiniuToken()
              .then((data) => {
                setToken(data.data, OssKey)
              })
          })
      } catch (e) {
        options.onError('上传失败')
      }
    },
    handleError(err, file, fileList) {
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
