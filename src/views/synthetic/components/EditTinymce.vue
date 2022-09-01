<template>
  <el-dialog top="30px" width="1000px" append-to-body title="规则说明" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="规则说明" prop="info">
        <tinymce v-if="visible" v-model="form.info" :height="400" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'EditTinymce',
  components: { Tinymce },
  data() {
    return {
      visible: false,
      form: {
        info: ''
      },
      rules: {
        info: [
          { required: true, message: '请输入内容', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.info = data.intro
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 去除异步加载图片
          this.form.info = this.form.info.replace(/crossorigin=\"anonymous\"/g, '')

          this.$emit('info', this.form.info)
          this.visible = false
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style scoped>

</style>
