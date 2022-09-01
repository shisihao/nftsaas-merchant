<template>
  <div>
    <el-dialog
      width="750px"
      top="30px"
      title="编辑"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="权益名称" prop="name">
          <el-input
            v-model="form.name"
            :precision="0"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="权益说明" prop="describe">
          <el-input v-model="form.describe" type="textarea" :rows="10" placeholder="权益说明" show-word-limit maxlength="500" style="width: 600px" clearable />
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
  </div>
</template>

<script>
import { addDataList } from '@/api/interest'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      pickerOptions,
      visible: false,
      btnLoading: false,
      form: {
        id: '',
        describe: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        describe: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form = Object.assign({}, data)
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addDataList(this.form.id, { name: this.form.name, describe: this.form.describe })
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
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 600px
}
</style>
