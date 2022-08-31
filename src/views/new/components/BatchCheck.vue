<template>
  <el-dialog title="一键同步" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="栏目" prop="cate_id">
        <el-select v-model="form.cate_id" placeholder="请选择">
          <el-option
            v-for="item in newsCateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="已选资讯ID">
        {{ `${form.ids.join(', ')}，共${form.ids.length}篇` }}
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
import { setChecked } from '@/api/new'

export default {
  name: 'BatchCheck',
  data() {
    return {
      visible: false,
      btnLoading: false,
      newsCateOptions: [],
      form: {
        cate_id: '',
        ids: []
      },
      rules: {
        cate_id: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data, newsCateOptions) {
      this.visible = true
      if (data) {
        this.form.ids = data
        this.newsCateOptions = newsCateOptions.slice(1)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          setChecked(this.form)
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
      this.$reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  min-height: 400px;
}
</style>
