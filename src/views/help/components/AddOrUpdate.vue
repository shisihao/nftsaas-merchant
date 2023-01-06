<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" top="30px" width="1000px" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title	" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce v-if="visible" v-model="form.content" :classname="info.template_id === 3 ? 'temp3-body' : ''" :height="400" />
        <!-- <el-input v-model="form.content" :rows="10" type="textarea" placeholder="内容" clearable /> -->
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrUpdate } from '@/api/help'
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { Tinymce },
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        title: '',
        content: '',
        sort: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          // 去除异步加载图片
          this.form.content = this.form.content.replace(/crossorigin=\"anonymous\"/g, '')

          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.btnLoading = false
      this.$reset()
    }
  }
}
</script>
