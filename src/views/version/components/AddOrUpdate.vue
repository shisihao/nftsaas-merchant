<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="版本类型" prop="type">
        <el-radio-group v-model="form.type" @change="onSelectType">
          <el-radio :label="0">android</el-radio>
          <el-radio :label="1">ios</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="版本名称" prop="version_name">
        <el-input v-model="form.version_name" placeholder="版本名称" clearable />
      </el-form-item>
      <el-form-item label="内部版本号" prop="version_code">
        <el-input v-model="form.version_code" placeholder="内部版本号" clearable />
      </el-form-item>
      <el-form-item label="更新说明" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="更新说明" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 0" label="上传APK" prop="link">
        <custom-upload
          className=""
          :showFileList="true"
          :limit="1"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
          @handleExceed="handleExceed"
          @elProgress="elProgress"
        >
          <el-button type="primary">点击上传</el-button>
        </custom-upload>
        <el-progress v-if="![0, 1].includes(percentage)" :percentage="percentage * 100"></el-progress>
      </el-form-item>
      <el-form-item v-if="form.type === 1" label="链接地址" prop="link">
        <el-input v-model="form.link" placeholder="链接地址" clearable />
      </el-form-item>
      <el-form-item label="是否强制更新" prop="is_forced">
        <el-radio-group v-model="form.is_forced">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
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
import { validNumber } from '@/utils/validate'
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/version'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    const validateVersionCode = (rule, value, callback) => {
      if (!validNumber(value)) {
        callback(new Error('内部版本号必须是整数'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      percentage: 0,
      form: {
        type: 0,
        version_name: '',
        version_code: '',
        description: '',
        link: '',
        is_forced: 0
      },
      fileList: [],
      rules: {
        type: [
          { required: true, message: '请选择版本类型', trigger: 'blur' }
        ],
        version_name: [
          { required: true, message: '版本名称不能为空', trigger: 'blur' }
        ],
        version_code: [
          { required: true, message: '内部版本号不能为空', trigger: 'blur' },
          { validator: validateVersionCode, trigger: 'blur' }
        ],
        link: [
          { required: true, message: '下载链接不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '更新说明不能为空', trigger: 'blur' }
        ],
        is_forced: [
          { required: true, message: '请选择是否强制更新', trigger: 'blur' }
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
          addOrUpdate(this.form)
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
    onSelectType(val) {
      this.form.link = ''
    },
    clearForm() {
      this.form = {
        type: 0,
        version_name: '',
        version_code: '',
        description: '',
        link: '',
        is_forced: 0
      }
    },
    onClose() {
      this.btnLoading = false
      this.clearForm()
      this.$refs['form'].resetFields()
    },
    elProgress(p, cpt, res) {
      this.percentage = p
    },
    handleAvatarSuccess(response, file) {
      this.form.link = response.name
    },
    handleAvatarError(error) {
      if (JSON.parse(error.message).error.indexOf('token') !== -1) {
        this.$message.error('上传功能已失效，请重新登录')
      }
    },
    beforeAvatarUpload(file, cb) {
      if (file.type.indexOf('android') === -1) {
        this.$message.error('请上传安卓apk文件')
        cb(false)
      }
      cb(true)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    }
  }
}
</script>
