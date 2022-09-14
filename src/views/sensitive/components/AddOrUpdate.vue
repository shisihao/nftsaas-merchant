<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="敏感词" prop="word">
        <el-input v-model="form.word" type="text" placeholder="请输入敏感词" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 'replace'" label="替换内容" prop="replace">
        <el-input v-model="form.replace" type="text" placeholder="请输入替换内容" clearable />
        <div class="notice">
          注意：检测到的敏感词内容，由替换内容填充
        </div>
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
import { addOrUpdate } from '@/api/sensitive'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        type: 'replace',
        word: '',
        replace: ''
      },
      typeOptions: [
        {
          label: '替换',
          value: 'replace'
        },
        {
          label: '提示',
          value: 'warning'
        }
      ],
      rules: {
        type: [
          { required: true, message: '请输入敏感词', trigger: ['blur', 'change'] }
        ],
        word: [
          { required: true, message: '请输入替换内容', trigger: ['blur', 'change'] }
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
    onClose() {
      this.btnLoading = false
      this.$reset()
    }
  }
}
</script>

<style scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
</style>
