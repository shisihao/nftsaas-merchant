<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') + '到我的资讯' " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="栏目" prop="cate_id">
        <el-select v-model="form.cate_id" placeholder="请选择" @change="onChangeLevel">
          <el-option
            v-for="item in newsCateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.cover" :src="domin + form.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          建议尺寸702px * 468px
        </div>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="标题" clearable />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce v-if="visible" v-model="form.content" :classname="info.template_id === 3 ? 'temp3-body' : ''" :height="400" />
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
  </el-dialog>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/new'
import CustomUpload from '@/components/Upload/CustomUpload'
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, Tinymce },
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        cate_id: '',
        cover: '',
        title: '',
        content: ''
      },
      newsCateOptions: [],
      rules: {
        cate_id: [
          { required: true, message: '请选择栏目', trigger: ['blur', 'change'] }
        ],
        cover: [
          { required: true, message: '请上传封面', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] }
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
    init(data, options) {
      this.visible = true
      this.newsCateOptions = options.slice(1)
      if (data) {
        this.form = Object.assign({}, data)
        if (data.stock) {
          this.form.id = 0
          this.form.cate_id = ''
        }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (!this.form.cate_id) {
            this.form.cate_id = 0
          }

          // 去除异步加载图片
          this.form.content = this.form.content.replace(/crossorigin=\"anonymous\"/g, '')

          addOrUpdate(this.form)
            .then(({ msg }) => {
              if (this.form.stock) {
                this.$message.success('已成功添加到 我的资讯库')
              } else {
                this.$message.success(msg)
              }
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.cover = response
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
    },
    onChangeLevel() {

    }
  }
}
</script>

<style scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
::v-deep .el-dialog {
  width: 1000px;
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  min-height: 100px;

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
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  width: 100%;
  height: auto;
}

.input-number-box {
  width: 250px;
}

</style>
