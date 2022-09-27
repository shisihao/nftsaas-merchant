<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="邮箱" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="手机号" maxlength="11" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" clearable />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option
            v-for="item in rolesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
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
import { validUsername, validEmail, validPhone } from '@/utils/validate'
import { addOrUpdate, adminItem } from '@/api/admin'
import { dataList } from '@/api/role'

export default {
  name: 'AddOrUpdate',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('名称只能是中英文及数字'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.form.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        state: 0,
        role: '',
        roles: []
      },
      rolesOptions: [],
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: ['blur', 'change'] },
          { validator: validateEmail, trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: validatePassword, trigger: ['blur', 'change'] }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getRoles()
      if (data) {
        Object.keys(this.form).map(v => {
          if (data[v]) {
            this.form[v] = data[v]
          }
        })
        this.getAdminItem(data)
      }
    },
    getRoles() {
      dataList()
        .then(response => {
          if (response.data) {
            this.rolesOptions = response.data.map(v => {
              return {
                value: v.id,
                label: v.name
              }
            })
          }
        })
        .catch(() => {})
    },
    getAdminItem(data) {
      adminItem(data.id)
        .then(response => {
          this.form.role = response.data.roles[0].id
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = {}
          for (const i in this.form) {
            if (this.form[i] || i === 'state') {
              data[i] = this.form[i]
            }
          }

          if (data.role) {
            data.roles = [data.role]
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
      this.btnLoading = false
      this.$reset()
    }
  }
}
</script>

<style scoped>

</style>
