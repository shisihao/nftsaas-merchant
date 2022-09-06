<template>
  <el-dialog top="30px" width="1000px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item v-if="!form.id" label="库存" prop="stock">
        <el-input-number v-model="form.stock" :precision="0" :min="0" :max="10000" :step="1" placeholder="请输入库存(<10000)" />
      </el-form-item>
      <el-form-item label="类型" prop="">
        <el-radio-group v-model="typeValue" @change="handleTypeChange">
          <el-radio v-for="(item, index) in goodShowTypeOptions" :key="index" :label="item.value"> {{ item.label }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-card v-if="typeValue!==0" class="box-card">
        <template v-if="form.is_three">
          <el-form-item label="请选择3D模型类型" prop="three_url.three_type">
            <el-radio-group v-model="form.three_url.three_type" @change="onChangeThreeType">
              <el-radio v-for="(item, index) in threeTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.three_url.three_type === 'obj'">
            <el-form-item label="上传mtl文件" prop="three_url.three_mtl">
              <custom-upload
                class-name=""
                ref-name="three_url.three_mtl"
                :limit="1"
                :show-file-list="true"
                :file-list="mtlList"
                @handleBeforeUpload="beforeAvatarUpload3d"
                @handleSuccess="handleAvatarSuccess"
                @handleError="handleError"
                @handleExceed="handleExceed"
                @handleRemove="handleRemove"
                @elProgress="elProgress"
              >
                <el-button type="primary">点击上传</el-button>
              </custom-upload>
              <el-progress v-if="![0, 1].includes(mtlPercentage)" :percentage="mtlPercentage * 100" />
            </el-form-item>
            <el-form-item label="上传obj文件" prop="three_url.three_obj">
              <custom-upload
                class-name=""
                ref-name="three_url.three_obj"
                :limit="1"
                :show-file-list="true"
                :file-list="objList"
                @handleBeforeUpload="beforeAvatarUpload3d"
                @handleSuccess="handleAvatarSuccess"
                @handleError="handleError"
                @handleExceed="handleExceed"
                @handleRemove="handleRemove"
                @elProgress="elProgress"
              >
                <el-button type="primary">点击上传</el-button>
              </custom-upload>
              <el-progress v-if="![0, 1].includes(objPercentage)" :percentage="objPercentage * 100" />
            </el-form-item>
          </div>
          <div v-if="form.three_url.three_type === 'gltf'">
            <el-form-item label="上传gltf文件" prop="three_url.three_gltf">
              <custom-upload
                class-name=""
                ref-name="three_url.three_gltf"
                :limit="1"
                :show-file-list="true"
                :file-list="gltfList"
                @handleBeforeUpload="beforeAvatarUpload3d"
                @handleSuccess="handleAvatarSuccess"
                @handleError="handleError"
                @handleExceed="handleExceed"
                @handleRemove="handleRemove"
                @elProgress="elProgress"
              >
                <el-button type="primary">点击上传</el-button>
              </custom-upload>
              <el-progress v-if="![0, 1].includes(gltfPercentage)" :percentage="gltfPercentage * 100" />
            </el-form-item>
            <el-form-item label="上传bin文件" prop="three_url.three_bin">
              <custom-upload
                class-name=""
                ref-name="three_url.three_bin"
                :limit="1"
                :show-file-list="true"
                :file-list="binList"
                @handleBeforeUpload="beforeAvatarUpload3d"
                @handleSuccess="handleAvatarSuccess"
                @handleError="handleError"
                @handleExceed="handleExceed"
                @handleRemove="handleRemove"
                @elProgress="elProgress"
              >
                <el-button type="primary">点击上传</el-button>
              </custom-upload>
              <el-progress v-if="![0, 1].includes(binPercentage)" :percentage="binPercentage * 100" />
            </el-form-item>
          </div>
          <el-form-item label="3d渲染image文件" prop="three_url.three_image">
            <div class="filter-list-box">
              <draggable v-model="form.images" v-bind="dragOptions" class="wrapper" @start="drag = true" @end="drag = false">
                <transition-group>
                  <div v-for="(item,index) in form.three_url.three_image" :key="item" class="upload-images">
                    <div class="upload-image">
                      <el-image :src="item && domin + item" />
                    </div>
                    <div class="upload-actions">
                      <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                      <i class="el-icon-delete" @click="onPictureRemove(item, index, 'three_url.three_image')" />
                    </div>
                  </div>
                </transition-group>
              </draggable>
              <custom-upload
                ref-name="three_url.three_image"
                class-name="avatar-uploader"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <i slot="default" class="el-icon-plus avatar-uploader-icon" />
              </custom-upload>
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="视频文件" prop="video_url.filename">
            <custom-upload
              class-name=""
              ref-name="video"
              :limit="1"
              :show-file-list="true"
              :file-list="videoList"
              @handleBeforeUpload="beforeAvatarUploadVideo"
              @handleSuccess="handleAvatarSuccess"
              @handleError="handleError"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
            >
              <el-button type="primary">点击上传</el-button>
            </custom-upload>
            <div class="el-upload__tip notice">注意：视频格式只能是`mp4`，建议尺寸750x1000px</div>
          </el-form-item>
        </template>
      </el-card>
      <div v-if="!form.id">
        <el-form-item label="藏品图片" prop="images">
          <div class="filter-list-box">
            <draggable v-model="form.images" v-bind="dragOptions" class="wrapper" @start="drag = true" @end="drag = false">
              <transition-group>
                <div v-for="(item,index) in form.images" :key="index" class="upload-images">
                  <div class="upload-image">
                    <el-image :src="item && domin + item" />
                  </div>
                  <div class="upload-actions">
                    <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                    <i class="el-icon-delete" @click="onPictureRemove(item, index, 'images')" />
                  </div>
                </div>
              </transition-group>
            </draggable>
            <custom-upload
              ref-name="images"
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <i slot="default" class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
          </div>
          <div class="notice">
            注意：建议藏品图片尺寸 750*750px
          </div>
        </el-form-item>
        <el-form-item label="藏品展示图" prop="show_image">
          <custom-upload
            class-name="avatar-uploader"
            ref-name="show_image"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.show_image" :src="domin + form.show_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">
            注意：建议藏品展示图尺寸 750*750px
          </div>
        </el-form-item>
      </div>
      <el-form-item v-if="!form.id" label="藏品名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入藏品名称" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="创作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入创作者" />
      </el-form-item>
      <template>
        <el-form-item label="创作者头像" prop="author_avatar">
          <custom-upload
            class-name="avatar-uploader"
            ref-name="author_avatar"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.author_avatar" :src="domin + form.author_avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">
            注意：建议创作者头像尺寸 750*750px
          </div>
        </el-form-item>
      </template>
      <el-divider />
      <el-form-item v-if="!form.id" label="发行方" prop="issuer">
        <el-input v-model="form.issuer" />
      </el-form-item>
      <el-form-item label="发行方头像" prop="issuer_avatar">
        <custom-upload
          class-name="avatar-uploader"
          ref-name="issuer_avatar"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.issuer_avatar" :src="domin + form.issuer_avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          注意：建议创作者头像尺寸 750*750px
        </div>
      </el-form-item>
      <el-form-item label="权益说明" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="8" placeholder="权益说明" clearable />
      </el-form-item>
      <el-form-item label="详情说明" prop="detail">
        <el-link type="primary" :underline="false" @click="onTinymce(form)">点击编辑</el-link>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <edit-tinymce
      v-if="editTinymceVisible"
      ref="editTinymce"
      @info="onInfo"
    />
  </el-dialog>
</template>

<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import { addOrUpdate, details } from '@/api/cast'
import { DominKey, getToken } from '@/utils/auth'
import CalcVideo from '@/utils/calcVideo'
import EditTinymce from './EditTinymce'
import draggable from 'vuedraggable'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { goodShowTypeOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, EditTinymce, ElImageViewer, draggable },
  data() {
    return {
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      imageViewer: false,
      imageViewerList: [],
      domin: getToken(DominKey),
      currentName: '',
      videoList: [],
      oldVideoList: [],
      objList: [],
      mtlList: [],
      gltfList: [],
      binList: [],
      objPercentage: 0,
      mtlPercentage: 0,
      gltfPercentage: 0,
      binPercentage: 0,
      threeTypeOptions: [
        { label: 'obj', value: 'obj' },
        { label: 'gltf', value: 'gltf' }
      ],
      typeValue: 0,
      goodShowTypeOptions,
      form: {
        is_three: 0,
        is_video: 0,
        name: '',
        author: '',
        author_avatar: '',
        issuer_avatar: '',
        issuer: '',
        desc: '',
        detail: '',
        images: [],
        show_image: '',
        stock: '',
        three_url: {
          three_type: '',
          three_mtl: '',
          three_gltf: '',
          three_bin: '',
          three_obj: '',
          three_image: []
        },
        video_url: {
          width: 0,
          height: 0,
          filename: ''
        }
      },
      rules: {
        'video_url.filename': [
          { required: true, message: '请上传mp4文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_type': [
          { required: true, message: '请选择3D文件类型', trigger: ['blur', 'change'] }
        ],
        'three_url.three_mtl': [
          { required: true, message: '请上传mtl文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_obj': [
          { required: true, message: '请上传obj文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_gltf': [
          { required: true, message: '请上传gltf文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_bin': [
          { required: true, message: '请上传bin文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_image': [
          { required: true, message: '请上传图片文件', trigger: ['blur', 'change'] }
        ],
        images: [
          { required: true, message: '请选择藏品图片', trigger: ['blur', 'change'] }
        ],
        show_image: [
          { required: true, message: '请选择藏品展示图片', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入藏品名称', trigger: ['blur', 'change'] }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '请输入创作者', trigger: ['blur', 'change'] }
        ],
        author_avatar: [
          { required: true, message: '请选择创作者头像', trigger: ['blur', 'change'] }
        ],
        issuer_avatar: [
          { required: true, message: '请选择发行方头像', trigger: ['blur', 'change'] }
        ],
        issuer: [
          { required: true, message: '请输入发行方', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '请输入详情说明', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '请输入权益说明', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.id = data.id
        this.getDetails()
      }
    },
    getDetails() {
      details(this.form.id)
        .then(response => {
          if ([1].includes(response.data.is_three)) {
            this.typeValue = 1
            this.form = response.data
            this.form.three_url.three_type = response.data.three_url.three_type || ''
            const three_mtl = this.form.three_url.three_mtl
            const three_obj = this.form.three_url.three_obj
            const three_gltf = this.form.three_url.three_gltf
            const three_bin = this.form.three_url.three_bin
            this.mtlList = three_mtl ? [{ name: three_mtl, url: three_mtl }] : []
            this.objList = three_obj ? [{ name: three_obj, url: three_obj }] : []
            this.gltfList = three_gltf ? [{ name: three_gltf, url: three_gltf }] : []
            this.binList = three_bin ? [{ name: three_bin, url: three_bin }] : []
          } else if ([1].includes(response.data.is_video)) {
            this.typeValue = 2
            this.form = Object.assign(response.data, { three_url: { three_type: '', three_mtl: '', three_obj: '', three_gltf: '', three_bin: '', three_image: [] }})
            this.videoList = response.data.is_video ? [{ name: response.data.video_url.filename, url: response.data.video_url.filename }] : []
          } else {
            this.typeValue = 0
            this.form = Object.assign(response.data, { three_url: { three_type: '', three_mtl: '', three_obj: '', three_gltf: '', three_bin: '', three_image: [] }})
          }
        })
        .catch(() => {})
    },
    handleTypeChange(val) {
      this.$refs.form.clearValidate(['video_url.filename', 'three_url.three_type', 'three_url.three_obj', 'three_url.three_mtl', 'three_url.three_gltf', 'three_url.three_bin', 'three_url.three_image'])
      switch (val) {
        case 0:
          this.form.is_three = 0
          this.form.is_video = 0
          Object.assign(this.form.three_url, this.$options.data().form.three_url)
          this.form.video_url = {
            width: 0,
            height: 0,
            filename: ''
          }
          break
        case 1:
          this.form.is_three = 1
          this.form.is_video = 0
          this.form.video_url = {
            width: 0,
            height: 0,
            filename: ''
          }
          break
        case 2:
          this.form.is_three = 0
          this.form.is_video = 1
          this.form.video_url = {
            width: 0,
            height: 0,
            filename: ''
          }
          this.form.videoList = this.oldVideoList
          Object.assign(this.form.three_url, this.$options.data().form.three_url)
          break
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            this.$confirm(`确定对[(#${this.form.id})]进行修改?`, '编辑', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.hanldaddOrUpdate()
              })
              .catch(() => {
              })
          } else {
            this.hanldaddOrUpdate()
          }
        }
      })
    },
    hanldaddOrUpdate() {
      const data = JSON.parse(JSON.stringify(this.form))
      if (data.three_url && data.three_type === 'obj') {
        delete data.three_url.three_gltf
        delete data.three_url.three_bin
      } else if (data.three_url && data.three_type === 'gltf') {
        delete data.three_url.three_mtl
        delete data.three_url.three_obj
      }
      this.btnLoading = true
      addOrUpdate(data)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    onInfo(value) {
      this.form.detail = value
    },
    onChangeThreeType(value) {
      this.$refs['form'].clearValidate(['three_url.three_obj', 'three_url.three_mtl', 'three_url.three_gltf', 'three_url.three_bin'])
    },
    onClose() {
      this.$reset()
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    onPictureRemove(img, index, type) {
      if (type === 'images') {
        this.form.images.splice(index, 1)
      } else {
        this.form.three_url.three_image.splice(index, 1)
      }
    },
    handleRemove(file, fileList) {
      switch (this.typeValue) {
        case 1:
          this.form.three_url[`three_${file.name.split('.')[1]}`] = ''
          this[`${file.name.split('.')[1]}List`] = []
          break
        case 2:
          this.form.video_url = {
            width: 0,
            height: 0,
            filename: ''
          }
      }
    },
    closeViewer() {
      this.imageViewer = false
    },
    beforeAvatarUpload3d(file, cb, refName) {
      const a = file.name.split('.')
      const isLt20M = file.size / 1024 / 1024 < 20
      if (a[a.length - 1] !== refName.replace('three_url.three_', '')) {
        this.$message.error(`上传文件只能是 ${refName.replace('three_url.three_', '')} 格式!`)
        cb(false)
        return
      }
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    elProgress(p) {
      this[`${this.currentName.replace('three_url.three_', '')}Percentage`] = p
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'images') {
        this.form[this.currentName].push(response)
      } else if (this.currentName === 'video') {
        this.form.video_url.filename = response
      } else if (this.currentName.indexOf('three_url') >= 0) {
        if (this.currentName.indexOf('image') >= 0) {
          this.form.three_url.three_image.push(response)
        } else {
          const a = this.currentName.split('.')
          this.form[a[0]][a[1]] = response
        }
      } else {
        this.form[this.currentName] = response
      }
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleError() {
      switch (this.typeValue) {
        case 1:
          this[`${this.currentName.replace('three_url.three_', '')}List`] = []
          break
        case 2:
          this.videoList = []
          break
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    beforeAvatarUploadVideo(file, cb, refName) {
      const type = ['video/mp4']
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!type.includes(file.type)) {
        this.$message.error('上传文件只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20M')
        cb(false)
        return
      }

      this.currentName = refName

      if (file.type.indexOf('video') >= 0) {
        const videoSize = new CalcVideo(file, 1)
        videoSize
          .then(response => {
            const { width, height } = response
            this.form.video_url.width = width
            this.form.video_url.height = height
          })
      }

      cb(true)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input-number {
    width: 200px;
  }
  .box-card {
    margin-bottom: 18px;
  }
  .avatar-uploader {
    display: inline-block;
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
      object-fit: contain;
    }
  }
 ::v-deep .filter-list-box {
    .wrapper {
      display: inline;
      vertical-align: top;
    }
    .upload-images {
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      margin: 0 8px 8px 0;
      display: inline-block;
      position: relative;
      cursor: grabbing;
      .upload-image {
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
        & > img {
          width: 100%;
        }
      }
      .upload-actions {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,0.5);
        text-align: center;
        display: none;
        i {
          margin-left: 6px;
          margin-top: 6px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      &:hover .upload-actions {
        display: block;
      }
      .upload-actions i {
        color: #fff;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .notice {
    margin: 10px 0 0 0;
    color: #909399;
    font-size: 12px;
    line-height: 1.5;
  }
</style>
