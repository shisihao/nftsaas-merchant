<template>
  <div>
    <el-dialog
      width="900px"
      top="30px"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :visible.sync="addOrUpdateVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleBeforeClose"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" controls-position="right" placeholder="请输入" :min="0" />
        </el-form-item>
        <el-form-item label="内容">
          <tinymce ref="tinymce" v-model="form.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="handleBeforeClose()">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdate } from '@/api/helps'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AddOrUpdate',
  components: { Tinymce },
  props: {
    addOrUpdateVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      form: {
        id: 0,
        title: '',
        sort: 0,
        content: ''
      }
    }
  },
  methods: {
    init(data) {
      if (data) {
        this.form = { ...data }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.handleBeforeClose()
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleBeforeClose() {
      this.$emit('update:addOrUpdateVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

.el-input-number {
  width: 200px;
}
</style>
