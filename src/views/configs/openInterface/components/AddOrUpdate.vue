<template>
  <div>
    <p>{{ typeExplain[type] }}开放接口配置</p>
    <el-form ref="form" :model="form[type]" :rules="rules" label-width="110px">
      <template v-if="form[type]">
        <el-form-item label="appId" prop="appId">
          <el-input
            v-model="form[type].appId"
            show-word-limit
            maxlength="50"
            placeholder="请输入appId"
          />
        </el-form-item>
        <el-form-item label="私钥" prop="private_key">
          <el-input
            v-model="form[type].private_key"
            type="textarea"
            :rows="5"
            :precision="0"
            show-word-limit
            placeholder="请输入私钥"
          />
        </el-form-item>
        <el-form-item label="公钥" prop="public_key">
          <el-input
            v-model="form[type].public_key"
            type="textarea"
            :rows="5"
            :precision="0"
            show-word-limit
            placeholder="请输入公钥"
          />
        </el-form-item>
        <el-form-item label="aes_key" prop="aes_key">
          <el-input
            v-model="form[type].aes_key"
            type="textarea"
            :rows="5"
            :precision="0"
            show-word-limit
            placeholder="请输入aes_key"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t("table.confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { setGwjOpen } from '@/api/configs'
export default {
  name: 'AddOrUpdate',
  props: {
    form: {
      type: Object,
      default: () => { return {} }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      rules: {
        appId: [
          { required: true, message: 'appId不能为空', trigger: 'blur' }
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
      },
      typeExplain: { gwj: '甘文交', qcg: '奇藏果' }
    }
  },
  methods: {
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setGwjOpen({ value: this.form })
            .then(({ msg }) => {
              this.$message.success(msg)
              this.$emit('refreshList')
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
.el-input-number {
  width: 200px;
}
.app-container {
  width: 800px;
}
</style>
