<template>
  <el-dialog
    title="谷歌验证码"
    width="500px"
    :visible.sync="visible"
    @closed="onClose()"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="medium"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="谷歌验证码" prop="code">
        <el-input
          v-model="form.code"
          maxlength="6"
          placeholder="请输入谷歌验证码"
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onhandleDestroy">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { onDestroy } from '@/api/user'

export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        user_goods_id: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, trigger: ['blur', 'change'], message: '不能为空' }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.form.user_goods_id = data.id
      this.visible = true
    },
    onClose() {
      this.$reset()
    },
    onhandleDestroy() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(`确定进行[转移]操作?`, '转移', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
            cancelButtonClass: 'btn-custom-cancel'
          })
            .then(() => {
              this.btnLoading = true
              onDestroy(this.form)
                .then(({ msg = '转移成功' }) => {
                  this.visible = false
                  // 此处服务端是异步操作，暂延迟1s刷新
                  setTimeout(() => {
                    this.$emit('refreshList')
                  }, 1000)
                })
                .catch(() => {})
                .finally(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
