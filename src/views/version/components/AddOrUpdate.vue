<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
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
      <el-form-item label="上传APP包" prop="link">
        <custom-upload-ali
          class-name=""
          :show-file-list="true"
          :limit="1"
          :file-list="fileList"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
          @handleExceed="handleExceed"
          @handleProgress="elProgress"
        >
          <el-button type="primary">点击上传</el-button>
        </custom-upload-ali>
        <el-progress v-if="![0, 1].includes(percentage)" style="margin-top:5px" :percentage="percentage * 100" />
      </el-form-item>
      <el-form-item v-if="form.type === 1" label="包名" prop="package_name">
        <el-input v-model="form.package_name" placeholder="包名" clearable />
      </el-form-item>
      <!-- <el-form-item v-if="form.type === 1" label="链接地址" prop="link">
        <el-input v-model="form.link" placeholder="链接地址" clearable />
      </el-form-item> -->
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
import CustomUploadAli from '@/components/Upload/CustomUploadAli'

export default {
  name: 'AddOrUpdate',
  components: { CustomUploadAli },
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
        ],
        package_name: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
      this.fileList = []
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
      this.fileList = []
    },
    elProgress(p, cpt, res) {
      this.percentage = Number.parseFloat(p)
    },
    handleAvatarSuccess(response, file) {
      this.form.link = response.name
      this.fileList = [{
        name: response.name,
        url: response.name
      }]
    },
    beforeAvatarUpload(file, cb) {
      if (!this.form.type && file.type.indexOf('android') === -1) {
        this.$message.error(`请上传安卓apk文件`)
        cb(false)
      } else if (this.form.type && file.name.indexOf('ipa') === -1) {
        this.$message.error(`请上传苹果ipa文件`)
        cb(false)
      } else {
        cb(true)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload-list__item {
  transition: none !important;
}
</style>
