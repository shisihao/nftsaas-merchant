<template>
  <div class="app-container">
    <label class="label">实名要素设置：</label>
    <el-radio-group v-model="radio">
      <el-radio :label="3">二要素</el-radio>
      <el-radio :label="6">三要素</el-radio>
      <el-radio :label="9">实人认证</el-radio>
    </el-radio-group>
    <div class="desc">
      <p>说明</p>
      <p>二要素：身份证+姓名 ；</p>
      <p>三要素：手机号+身份证+姓名</p>
      <p>实人认证：阿里实人认证</p>
    </div>
    <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
      {{ $t("table.confirm") }}
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: '',
      btnLoading: false
    }
  },
  methods: {
    onFormSubmit() {
      this.btnLoading = true
      // api(this.form)
      //   .then(({ msg }) => {
      //     this.$message.success(msg)
      //     this.getList()
      //   })
      //   .catch(() => {})
      //   .finally(() => {
      //     this.btnLoading = false
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.label {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}
.desc {
  margin-top: 30px;
  font-size: 14px;
  color: #333;
}
</style>
