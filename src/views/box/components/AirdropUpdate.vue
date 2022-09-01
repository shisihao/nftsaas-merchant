<template>
  <el-dialog title="操作空投" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="是否实名">
        <el-radio-group v-model="form.is_real">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否去重">
        <el-radio-group v-model="form.is_unique">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传Excel文件" prop="file_path">
        <el-upload
          :action="fileDmoin + 'public/upload'"
          :limit="1"
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :on-exceed="handleExceed"
          :on-success="handleSuceess"
        >
          <el-button type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip  notice">只能上传xlsx文件</div>
        </el-upload>
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
import { addAirdrops } from '@/api/box'

export default {
  name: 'AirdropUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      fileDmoin: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : `${location.origin}/admin/`,
      fileList: [],
      form: {
        is_real: 1,
        is_unique: 1,
        box_id: '',
        file_path: ''
      },
      rules: {
        file_path: [
          { required: true, message: '请上传文件', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.box_id = data.id
      }
    },
    onClose() {
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addAirdrops(this.form).then(({ msg }) => {
            this.$message.success(msg)
            this.visible = false
          })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    handleBeforeUpload(file) {
      const a = file.name.split('.')
      const isLt2M = file.size / 1024 / 1024 < 3
      if (a[a.length - 1] !== 'xlsx') {
        this.$message.error('上传文件只能是 xlsx 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 3M')
        return false
      }
    },
    handleSuceess(file, fileList) {
      this.form.file_path = file.data.path
    }
  }
}
</script>

<style scoped>
.notice{
  color:#909399 !important
}
</style>
