<template>
  <el-dialog title="资产操作" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="资产类型" prop="currency">
        <el-select v-model="form.currency" clearable placeholder="请选择">
          <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型" prop="action">
        <el-select v-model="form.action" clearable placeholder="请选择">
          <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="流水标题" prop="name">
        <el-input v-model="form.name" type="text" placeholder="请输入" maxlength="20" show-word-limit clearable />
      </el-form-item>
      <el-form-item v-if="form.currency && form.action" :label="`${form.action === 1 ? '增加' : '扣除'}${$options.filters.paraphrase(form.currency, currencyOptions)}`" prop="num">
        <el-input-number v-model="form.num" :min="0" :precision="form.currency === 'cast'? 0 : 2" placeholder="请输入数量" clearable />
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
import { setWallet } from '@/api/user'
import { validUsername2 } from '@/utils/validate'
import { payTypeOptions } from '@/utils/explain'

export default {
  name: 'SetWallet',
  data() {
    const validateReplace = (rule, value, callback) => {
      if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        callback(new Error('必须是大于0的数字'))
      } else {
        callback()
      }
    }

    const validateUsername = (rule, value, callback) => {
      if (!validUsername2(value)) {
        callback(new Error('不能包含字符空格'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      btnLoading: false,
      form: {
        user_id: 0,
        action: '',
        num: '',
        name: ''
      },
      name: '',
      actionOptions: [
        { label: '增加', value: 1 },
        { label: '扣除', value: 2 }
      ],
      currencyOptions: payTypeOptions.slice(1),
      rules: {
        currency: [
          { required: true, message: '请选择资产类型', trigger: ['blur', 'change'] }
        ],
        action: [
          { required: true, message: '请选择操作类型', trigger: ['blur', 'change'] }
        ],
        num: [
          { required: true, message: '数量不能为空', trigger: ['blur', 'change'] },
          { validator: validateReplace, trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '流水标题不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      if (data.id) {
        this.form.user_id = data.id
        this.visible = true
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确认${this.form.action === 1 ? '增加' : '扣除'}用户[#${this.form.user_id}]${this.$options.filters.paraphrase(this.form.currency, this.currencyOptions)}${this.form.num}？`, `确认操作`, {
            type: this.form.action === 1 ? 'warning' : 'error'
          }).then(() => {
            this.btnLoading = true
            setWallet(this.form)
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.$emit('refreshList')
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
            .catch(() => {})
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

<style scoped>
  .el-input-number ::v-deep {
    width: 200px;
  }
</style>
