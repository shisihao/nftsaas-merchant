<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item v-if="form.id === 0" label="选择用户" prop="type">
        <el-radio-group v-model="type">
          <el-radio :label="0">全部用户</el-radio>
          <el-radio :label="1">指定用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.id === 0 && type === 1" label="用户账号">
        <el-input v-model="form.account" placeholder="用户账号" clearable />
      </el-form-item>
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="form.title" placeholder="消息标题" clearable />
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="8" placeholder="消息内容" clearable />
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
import { addOrUpdate } from '@/api/message'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      accountOptions: [],
      type: 0,
      form: {
        id: 0,
        account: '',
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: ['blur', 'change'] }
        ],
        account: [
          { required: true, message: '请选择用户', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        const { id, title, content } = data
        this.form = Object.assign({}, this.form, { id, title, content })
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = this.form
          if (data.type === 0 && data.period_id === '') {
            delete data.period_id
          }
          addOrUpdate(data)
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
