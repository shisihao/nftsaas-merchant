<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="`${integral}单价`" prop="value">
        <el-input-number v-model="form.value" :placeholder="`${integral}单价`" :precision="2" clearable />
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
import { putIntegralPrice, integralPrice } from '@/api/configs'
import { mapGetters } from 'vuex'

export default {
  name: 'OnChain',
  data() {
    return {
      btnLoading: false,
      form: {
        value: 0
      },
      rules: {
        value: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      integralPrice()
        .then(response => {
          this.form.value = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putIntegralPrice(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
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
.el-input-number{
  width: 200px;
}
</style>
