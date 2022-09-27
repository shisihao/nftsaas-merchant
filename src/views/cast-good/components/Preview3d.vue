<template>
  <div>
    <el-dialog
      width="500px"
      top="30px"
      :visible.sync="visible"
      @closed="onClose()"
    >
      <span slot="title">
        预览模型
        <el-popover
          placement="bottom"
          title="扫一扫预览"
          width="200"
          trigger="hover"
        >
          <el-link slot="reference" class="preview-btn" type="primary" :underline="false">手机预览<i class="el-icon-view el-icon--right" /></el-link>
          <img :src="QRUrl" style="width: 100%;height: 100%;">
        </el-popover>
      </span>
      <div class="box">
        <div class="box-3d">
          <iframe
            v-if="src && visible"
            frameborder="0"
            :src="`${domin}threejs/${src}`"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBackImage } from '@/api/configs'
import { DominKey, getToken } from '@/utils/auth'
import QRCode from 'qrcode'

export default {
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      src: '',
      QRUrl: '',
      data: {},
      bg_url: ''
    }
  },
  created() {
    this.getBgImg()
  },
  methods: {
    init(data) {
      this.visible = true
      if (data.is_three) {
        if (data.three_url.three_type === undefined) {
          data.three_url.three_type = 'obj'
        }
        if (data.three_url && data.three_url.three_type === 'obj') {
          this.src = `3d.html?obj=${data.three_url && data.three_url.three_obj}&mtl=${data.three_url && data.three_url.three_mtl}`
        } else if (data.three_url && data.three_url.three_type === 'gltf') {
          this.src = `3d_gltf.html?gltf=${data.three_url && data.three_url.three_gltf}`
        }
        this.src += this.bg_url ? `&bg=${this.bg_url}` : ''
      }

      if (data.is_video) {
        this.src = `video.html?video=${data.video_url.filename}`
      }

      var _this = this
      QRCode.toDataURL(`${_this.domin}threejs/${_this.src}`, {
        margin: 1
      }, function(err, url) {
        if (err) throw new Error(err)
        _this.QRUrl = url
      })
    },
    getBgImg() {
      getBackImage().then(({ data }) => {
        this.bg_url = data.value || ''
      })
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  .preview-btn {
    margin-left: 10px;
  }
}
::v-deep .el-dialog__body {
  padding: 0;
  .box {
    width: 100%;
    min-height: calc(500px * 1.514);
    position: relative;
    .box-3d {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      iframe {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
