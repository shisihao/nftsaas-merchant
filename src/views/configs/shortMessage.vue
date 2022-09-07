<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="app_id" prop="app_id">
        <el-input v-model="form.app_id" placeholder="请输入app_id" clearable />
      </el-form-item>
      <el-form-item label="签名" prop="sign">
        <el-input v-model="form.sign" placeholder="请输入签名" clearable />
      </el-form-item>
      <el-form-item label="模板" prop="template">
        <el-input v-model="form.template" placeholder="请输入模板" clearable />
      </el-form-item>
      <el-form-item label="access_key_id" prop="access_key_id">
        <el-input
          v-model="form.access_key_id"
          placeholder="请输入access_key_id	"
          clearable
        />
      </el-form-item>
      <el-form-item label="access_key_secret" prop="access_key_secret">
        <el-input
          v-model="form.access_key_secret"
          placeholder="请输入access_key_secret	"
          clearable
        />
      </el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t("table.confirm") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getSms, setSms } from '@/api/configs'
export default {
  name: 'ShortMessage',
  data() {
    return {
      btnLoading: false,
      form: {},
      rules: {
        app_id: [
          { required: true, message: 'app_id不能为空', trigger: 'blur' }
        ],
        sign: [{ required: true, message: '签名不能为空', trigger: 'blur' }],
        template: [
          { required: true, message: '模板不能为空', trigger: 'blur' }
        ],
        access_key_id: [
          { required: true, message: 'access_key_id不能为空', trigger: 'blur' }
        ],
        access_key_secret: [
          {
            required: true,
            message: 'access_key_secret	不能为空',
            trigger: 'blur'
          }
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
      getSms()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setSms(this.form)
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
.app-container {
  width: 400px;
}
</style>
