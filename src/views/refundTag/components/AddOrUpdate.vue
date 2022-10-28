<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="原因类型" prop="name">
        <el-input v-model="form.name" placeholder="请输入原因类型" />
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
import { addOrUpdate } from '@/api/refundTag'
export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入原因类型', trigger: ['blur', 'change'] }
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
    onClose() {
      this.btnLoading = false
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addOrUpdate(this.form).then(({ msg }) => {
            this.$message.success(msg)
            this.visible = false
          }).finally(() => {
            this.$emit('refreshList')
          })
        }
      })
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
}
.avatar-uploader .el-upload:hover {
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
  display: block;
}
.el-input-number {
  width: 200px;
}
</style>
