<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="微信" prop="wechat">
        <el-input v-model="form.wechat" placeholder="微信" show-word-limit maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model.number="form.qq" oninput="value=value.replace(/[^\d]/g,'')" show-word-limit maxlength="12" placeholder="QQ" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { contact, putContact } from '@/api/configs'
import { validWehcat, validQQ } from '@/utils/validate'
export default {
  name: 'Contact',
  data() {
    const validateWehcat = (rule, value, callback) => {
      if (!validWehcat(value)) {
        callback(new Error('请输入正确的微信号码'))
      } else {
        callback()
      }
    }
    const validateQQ = (rule, value, callback) => {
      if (!validQQ(value)) {
        callback(new Error('请输入正确的QQ'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      form: {
        wechat: '',
        qq: ''
      },
      rules: {
        wechat: [
          { required: true, message: '微信不能为空', trigger: 'blur' },
          { validator: validateWehcat, trigger: ['blur', 'change'] }
        ],
        qq: [
          { required: true, message: 'qq不能为空', trigger: 'blur' },
          { validator: validateQQ, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      contact()
        .then(response => {
          this.form = response.data
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putContact(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
.app-container {
  width: 800px;
}
</style>
