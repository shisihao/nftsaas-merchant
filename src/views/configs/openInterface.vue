<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="app_id" prop="app_id">
        <el-input
          v-model="form.app_id"
          show-word-limit
          maxlength="50"
          placeholder="请输入app_id"
        />
      </el-form-item>
      <el-form-item label="私钥" prop="private_key">
        <el-input
          v-model="form.private_key"
          type="textarea"
          :rows="5"
          :precision="0"
          show-word-limit
          placeholder="请输入私钥"
        />
      </el-form-item>
      <el-form-item label="公钥" prop="public_key">
        <el-input
          v-model="form.public_key"
          type="textarea"
          :rows="5"
          :precision="0"
          show-word-limit
          placeholder="请输入公钥"
        />
      </el-form-item>
      <el-form-item label="aes_key" prop="aes_key">
        <el-input
          v-model="form.aes_key"
          type="textarea"
          :rows="5"
          :precision="0"
          show-word-limit
          placeholder="请输入aes_key"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t("table.confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGwjOpen, setGwjOpen } from '@/api/configs'
export default {
  name: 'OpenInterface',
  data() {
    return {
      btnLoading: false,
      form: {
        app_id: '',
        private_key: '',
        public_key: '',
        aes_key: ''
      },
      rules: {
        app_id: [
          { required: true, message: 'app_id不能为空', trigger: 'blur' }
        ],
        private_key: [
          { required: true, message: '私钥不能为空', trigger: 'blur' }
        ],
        public_key: [
          { required: true, message: '公钥不能为空', trigger: 'blur' }
        ],
        aes_key: [
          { required: true, message: 'aes_key不能为空', trigger: 'blur' }
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
      getGwjOpen()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setGwjOpen(this.form)
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
