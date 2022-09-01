<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="图标" prop="icon">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.icon" :src="domin + form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称(最长3个字符)" maxlength="3" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
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
import { validUsername } from '@/utils/validate'
import { DominKey, getToken } from '@/utils/auth'
import { roleAddOrUpdate } from '@/api/user'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('名称只能是中英文及数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        name: '',
        icon: '',
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        icon: [
          { required: true, message: '图标不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          roleAddOrUpdate(this.form)
            .then(({ msg }) => {
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
    clearFrom() {
      this.form = {
        id: 0,
        name: '',
        icon: '',
        sort: 0
      }
    },
    onClose() {
      this.btnLoading = false
      this.clearFrom()
      this.$refs['form'].resetFields()
    },
    handleAvatarSuccess(response, file) {
      this.form.icon = response
    },
    handleAvatarError(error) {
      if (JSON.parse(error.message).error.indexOf('token') !== -1) {
        this.$message.error('上传功能已失效，请重新登录')
      }
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

<style scoped>
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
</style>
