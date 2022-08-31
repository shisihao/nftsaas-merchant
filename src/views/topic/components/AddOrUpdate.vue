<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="话题" prop="name">
        <el-input v-model="form.name" placeholder="话题" clearable />
      </el-form-item>
      <el-form-item label="热门" prop="hot">
        <el-radio-group v-model="form.hot">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
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
import { addOrUpdate } from '@/api/topic'
import { validUsername } from '@/utils/validate'

export default {
  name: 'AddOrUpdate',
  data() {
    const validateName = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('名称只能是中英文及数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        name: '',
        hot: 0,
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入话题', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({},data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
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
    clearForm() {
      this.form = {
        id: 0,
        name: '',
        hot: 0,
        sort: 0
      }
    },
    onClose() {
      this.btnLoading = false
      this.clearForm()
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.img-cover {
  width: 200px;
  height: auto;
}

</style>
