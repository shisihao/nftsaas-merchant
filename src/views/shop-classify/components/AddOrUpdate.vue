<template>
  <el-dialog
    :visible.sync="visible"
    width="width"
    :title="form.id?'编辑分类':'添加分类'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClose"
  >
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :maxlength="30" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="分类大图" prop="image">
        <custom-upload
          class-name="avatar-uploader"
          ref-name="image"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.image" :src="domin + form.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
      <el-form-item label="分类小图" prop="icon">
        <custom-upload
          class-name="avatar-uploader"
          ref-name="icon"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.icon" :src="domin + form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/shop-classify'
export default {
  name: 'AddOrUpdata',
  components: { CustomUpload },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      form: {
        name: '',
        sort: 0,
        image: '',
        icon: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请选择排序', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传分类大图', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请上传分类小图', trigger: 'blur' }
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
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addOrUpdate(this.form).then((data) => {
            this.visible = false
            this.$message.success(data.msg)
            this.$emit('refreshList')
          })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      if (this.refName === 'image') {
        this.form.image = response.name
      } else if (this.refName === 'icon') {
        this.form.icon = response.name
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
      this.refName = refName
      cb(true)
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
.el-input-number {
  width: 200px;
}
</style>
