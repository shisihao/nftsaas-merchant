<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="滑块验证开关">
        <el-switch
          v-model="form.open"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSlider, setSlider } from '@/api/configs'

export default {
  name: 'SliderConfig',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        open: '' // on-开启 off-关闭
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
      getSlider()
        .then(response => {
          if (response.code !== 0) return
          this.form = Object.assign({}, response.data.value)
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          setSlider({ ...this.form })
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
    .el-input-number {
        width: 200px;
    }
    .app-container {
        width: 800px;
    }
</style>
