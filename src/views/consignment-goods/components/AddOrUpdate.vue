<template>
  <div>
    <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="藏品图片" prop="show_image">
          <custom-upload class-name="avatar-uploader" ref-name="show_image" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.show_image" :src="form.show_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice"> 建议比例 1:1，不超过20M </div>
        </el-form-item>
        <el-form-item label="藏品名称" prop="name">
          <el-input v-model="form.name" placeholder="藏品名称" clearable />
        </el-form-item>
        <el-form-item label="发行价" prop="cny_price">
          <el-input-number v-model="form.cny_price" placeholder="发行价" :min="0" />
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" :min="0" placeholder="发行量" />
        </el-form-item>
        <el-form-item label="流通量" prop="circulate">
          <el-input-number v-model="form.circulate" :min="0" placeholder="流通量" />
        </el-form-item>
        <el-form-item label="创作者" prop="author">
          <el-input v-model="form.author" placeholder="创作者" clearable />
        </el-form-item>
        <el-form-item label="创作者logo" prop="author_avatar">
          <custom-upload class-name="avatar-uploader" ref-name="author_avatar" @handleBeforeUpload="beforeAvatarUpload" @handleSuccess="handleAvatarSuccess">
            <img v-if="form.author_avatar" :src="form.author_avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice"> 建议比例 1:1，不超过20M </div>
        </el-form-item>
        <el-form-item label="发行方" prop="issuer">
          <el-input v-model="form.issuer" placeholder="发行方" clearable />
        </el-form-item>
        <el-form-item label="藏品详情" prop="detail">
          <el-link type="primary" :underline="false" @click="onTinymce(form)">
            点击编辑
          </el-link>
        </el-form-item>
        <el-form-item label="权益说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" placeholder="权益说明" :rows="5" />
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
    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />
  </div>

</template>

<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { getToken, DominKey } from '@/utils/auth'
import { putData } from '@/api/consignment-goods'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, EditTinymce },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      currentName: '',
      form: {
        show_image: '',
        cny_price: '',
        consignment_status: 0,
        desc: '',
        detail: '',
        author: '',
        issuer: '',
        author_avatar: '',
        total: '',
        circulate: ''
      },
      rules: {
        show_image: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cny_price: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        consignment_status: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        issuer: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        author_avatar: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        total: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        circulate: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
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
    handleAvatarSuccess(response) {
      console.log(response)
      this.form[this.currentName] = this.domin + response.name
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
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          putData(this.form.id, this.form).then(({ msg }) => {
            this.$message.success(msg)
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
		border-color: #409eff;
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
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.el-input-number{
  width: 200px;
}
</style>
