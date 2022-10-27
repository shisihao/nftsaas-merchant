<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="云账号开户费用" prop="open_amount">
        <el-input-number v-model="form.open_amount" placeholder="开户费用" :min="0" :precision="2" clearable />
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
import { openAmount, putOpenAmount } from '@/api/configs'
import { mapGetters } from 'vuex'

export default {
  name: 'OpenAmount',
  data() {
    return {
      btnLoading: false,
      form: {
        open_amount: 0
      },
      rules: {
        open_amount: [
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
      openAmount()
        .then(response => {
          this.form.open_amount = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putOpenAmount(this.form)
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
