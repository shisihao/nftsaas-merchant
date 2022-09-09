<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule">
      <el-form-item label="藏品编号前缀" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t("table.confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPrefix, setPrefix } from '@/api/configs'
import { validAlphabets } from '@/utils/validate'

export default {
  name: 'Prefix',
  data() {
    const validateName = (rule, value, callback) => {
      if (!validAlphabets(value)) {
        callback(new Error('格式错误，只能输入英文'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      btnLoading: false,
      form: {
        name: ''
      },
      rule: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateName, trigger: ['blur', 'change'] }
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      getPrefix({ ...this.form })
        .then((response) => {
          if (response.code !== 0) return
          this.form.name = response.data.value
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setPrefix({ ...this.form })
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
.el-input {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.app-container {
  width: 800px;
}
</style>
