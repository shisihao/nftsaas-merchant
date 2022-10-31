<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="资格卡提示" prop="qualification_card">
        <el-input v-model.trim="form.qualification_card" :rows="10" type="textarea" clearable placeholder="请输入资格卡提示" />
      </el-form-item>
      <el-form-item label="实体商品购买提示" prop="entity_goods">
        <el-input v-model.trim="form.entity_goods" :rows="10" type="textarea" clearable placeholder="请输入资格卡提示" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { qualification, putQualification } from '@/api/configs'
export default {
  name: 'Qualification',
  data() {
    return {
      form: {
        qualification_card: '',
        entity_goods: ''
      },
      btnLoading: false,
      rules: {
        qualification_card: [
          { required: true, message: '请输入资格卡提示', trigger: 'blur' }
        ],
        entity_goods: [
          { required: true, message: '请输入实体商品购买提示', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const data = await qualification()
      this.form = data.data.value
    },
    onSubmit() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          this.btnLoading = true
          putQualification(this.form)
            .then((data) => {
              this.$message.success(data.msg)
              this.getData()
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

<style  scoped>
.app-container {
  width: 800px;
}
</style>
