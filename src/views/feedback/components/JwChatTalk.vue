<template>
  <el-dialog title="" :visible.sync="visible" @closed="onClose()">
    <JwChat v-model="inputMsg" :tale-list="list" :tool-config="tool" @enter="bindEnter" />
    <div class="up-img">
      <div v-for="(item, index) in sendImgs" :key="index" class="img-box">
        <i class="el-icon-close close" @click="onCloseImg(index)" />
        <el-image
          class="img-item"
          :src="domin + item"
          fit="cover"
          :preview-src-list="[domin + item]"
        />
      </div>
    </div>
    <div style="display: none;">
      <custom-upload
        class-name="up_uploader"
        @handleBeforeUpload="beforeAvatarUpload"
        @handleSuccess="handleAvatarSuccess"
      />
    </div>
  </el-dialog>
</template>

<script>
import { detailList, setReply } from '@/api/feedback'
import { getToken, DominKey } from '@/utils/auth'
import { mapGetters } from 'vuex'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'JwChatTalk',
  components: { CustomUpload },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      inputMsg: '',
      list: [],
      sendImgs: [],
      tool: {
        show: ['img'],
        showEmoji: false,
        callback: this.toolEvent
      },
      form: {
        id: 0,
        user: {},
        content: '',
        created_at: '',
        images: []
      },
      rules: {
        name: [
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
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = data
        this.list.push(this.tem(this.form.created_at, false, this.form.user.name, this.avatar('user'), this.form.content))
        if (this.form.images && this.form.images.length) {
          this.form.images.forEach(v => {
            this.list.push(this.tem(this.form.created_at, false, this.form.user.name, this.avatar('user'), v, 'img'))
          })
        }
        this.getList()
      }
    },
    getList() {
      detailList(this.form.id)
        .then(response => {
          response.data.forEach(item => {
            this.list.push(this.tem(item.created_at, item.type !== 'user', this.form.user.name, this.avatar(item.type), item.content))
            if (item.images.length > 0) {
              item.images.forEach(v => {
                this.list.push(this.tem(item.created_at, item.type !== 'user', this.form.user.name, this.avatar(item.type), v, 'img'))
              })
            }
          })
        })
        .catch(() => {
        })
        .finally(() => {
        })
    },
    bindEnter(e) {
      const msg = this.inputMsg
      if (!msg) {
        this.$message.error('必须输入回复')
        return false
      }
      this.$confirm(`确定进行回复操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setReply({ id: this.form.id, content: msg, images: this.sendImgs })
            .then(({ data, msg = '跟进成功' }) => {
              this.sendImgs = []
              this.list.push(this.tem(data.created_at, true, this.info.name, this.domin + this.info.icon, data.content))
              if (data.images.length > 0) {
                data.images.forEach(item => {
                  this.list.push(this.tem(data.created_at, true, this.info.name, this.domin + this.info.icon, item, 'img'))
                })
              }
              this.$message.success(msg)
            })
            .catch(() => {
              console.log(12112312)
              this.inputMsg = msg
            })
        })
        .catch(() => {
          console.log(3333333)
          this.inputMsg = msg
        })
    },
    onClose() {
      this.$reset('data', false)
    },
    tem(date, mine, name, img, text, textType) {
      let newText
      if (textType === 'img') {
        newText = `<img data-src='${this.domin + text}' />`
      } else {
        newText = text
      }
      return {
        date: date,
        mine: mine,
        name: name,
        img: img,
        text: { text: newText }
      }
    },
    avatar(type) {
      if (type === 'user') {
        return this.form.user.avatar ? this.domin + this.form.user.avatar : require('@/assets/images/20211014141547@2x.png')
      } else if (type === 'system') {
        return this.domin + this.info.icon
      }
      return ''
    },
    toolEvent(type, plyload) {
      if (type === 'img') {
        if (this.sendImgs.length < 3) {
          document.querySelector('.up_uploader input').click()
        } else {
          this.$message.error('最多上传3张图片')
        }
      }
    },
    onCloseImg(index) {
      this.sendImgs.splice(index, 1)
    },
    handleAvatarSuccess(response, file) {
      this.sendImgs.push(response)
    },
    beforeAvatarUpload(file, cb) {
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
      cb(true)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
  padding-top: 30px;
}
.up-img {
  position: relative;
  left: 20px;
  top: -20px;
  .img-box {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 50px;
    margin-right: 20px;
    .img-item {
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      right: -5px;
      top: -5px;
      z-index: 1;
      color: #000;
      background-color: #999;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.5);
      }
    }
  }
}
</style>
