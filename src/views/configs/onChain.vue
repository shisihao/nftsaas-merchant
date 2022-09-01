<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="链上说明" prop="chain_query">
        <el-input v-model="form.chain_query" type="textarea" :rows="10" placeholder="链上说明配置" style="width: 600px" clearable />
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
import { chainList, addChainList } from '@/api/configs'
export default {
  name: 'OnChain',
  data() {
    return {
      btnLoading: false,
      form: {
        chain_query: ''
      },
      rules: {
        chain_query: [
          { required: true, message: '链上说明配置', trigger: 'blur' }
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
      chainList()
        .then(response => {
          this.form.chain_query = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addChainList(this.form)
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

</style>
