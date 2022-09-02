<template>
  <el-dialog title="操作空投" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="资产类型" prop="type">
        <el-select v-model="form.type">
          <template v-for="item in payTypeOptions">
            <el-option v-if="item.label!=='全部'" :key="item.value" :label="item.label" :value="item.value" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="amount">
        <el-input-number v-model="form.amount" :min="1" :precision="2" label="label" />
      </el-form-item>
      <el-form-item label="是否去重" prop="is_unique">
        <el-radio-group v-model="form.is_unique">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传Excel文件" prop="file_path">
        <custom-upload
          class-name=""
          :limit="1"
          :show-file-list="true"
          :file-list="fileList"
          @handleExceed="handleExceed"
          @handleRemove="handleRemove"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <el-button type="primary">点击上传</el-button>
        </custom-upload>
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
import { payTypeOptions } from '@/utils/explain'
import { airBalance } from '@/api/user'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AirBalance',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      btnLoading: false,
      fileList: [],
      form: {
        type: 'integral',
        amount: 0,
        file_path: '',
        is_unique: 0
      },
      payTypeOptions,
      rules: {
        type: [
          { required: true, message: '请选择资产类型', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请选择数量', trigger: 'blur' }
        ],
        file_path: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        is_unique: [
          { required: true, message: '请选择文件上传', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    onClose() {
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          airBalance(this.form).then((data) => {
            this.$message.success(data.msg)
            this.visible = false
          })
        } else {
          return false
        }
      })
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    beforeAvatarUpload(file, cb) {
      const a = file.name.split('.')
      const isLt2M = file.size / 1024 / 1024 < 3
      if (a[a.length - 1] !== 'xlsx') {
        this.$message.error('上传文件只能是 xlsx 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 3M')
        cb(false)
        return
      }
      cb(true)
    },
    handleRemove(file, fileList) {
      this.form.file_path = ''
    },
    handleAvatarSuccess(res, fileList) {
      this.form.file_path = res
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 180px;
}
</style>
