<template>
  <el-dialog :title="form.id && !form.stock ? $t('table.edit') : $t('table.add') + '到我的海报' " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="海报" prop="icon">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.url" :src="domin + form.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          注意：建议海报尺寸 660*1020
        </div>
      </el-form-item>
      <el-form-item label="海报名称" prop="name">
        <el-input v-model="form.name" placeholder="海报名称" clearable />
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
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/poster'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        url: '',
        name: '',
        sort: 0
      },
      agentList: [],
      roleOptions: [],
      rules: {
        url: [
          { required: true, message: '请上传海报', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '海报名称不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
        if (data.stock) {
          this.form.id = 0
        }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              if (this.form.stock) {
                this.$message.success('已成功添加到 我的海报库')
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
      this.btnLoading = false
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.url = response
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

.input-number-box {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
</style>
