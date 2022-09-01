<template>
  <el-dialog top="30px" width="1000px" :title="form.id && !form.stock ? $t('table.edit') : $t('table.add') + '到我的协议'" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">

      <el-form-item label="所属专区" prop="zone">
        <el-select v-model="form.zone">
          <el-option v-for="(item,index) in zoneOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="协议标题" prop="title">
        <el-input v-model="form.title" placeholder="协议标题" clearable />
      </el-form-item>

      <el-form-item label="协议内容" prop="content">
        <tinymce v-if="visible" v-model="form.content" :classname="info.template_id === 3 ? 'temp3-body' : ''" :height="400" />
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
import { addOrUpdate } from '@/api/agreement'
import Tinymce from '@/components/Tinymce'
import { zoneOptions } from '@/utils/explain'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { Tinymce },
  data() {
    return {
      visible: false,
      btnLoading: false,
      zoneOptions: zoneOptions.concat([{ label: '注册协议', value: 'register' }]).slice(1),
      form: {
        id: 0,
        zone: '',
        title: '',
        content: '',
        stock: false
      },
      rules: {
        zone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
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
        if (data.stock) {
          this.form.id = 0
        }
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
              if (this.form.stock) {
                this.$message.success('已成功添加到 我的协议库')
              } else {
                this.$message.success(msg)
              }

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
      this.$reset()
    }
  }
}
</script>

<style scoped>
</style>
