<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="购买金额(现金/元)" prop="price">
        <el-input-number v-model="form.price" :precision="2" :step="0.01" />
      </el-form-item>
      <el-form-item label="时限(月)" prop="month">
        <el-input-number v-model="form.month" :precision="0" :step="1" />
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
import { putCollection } from '@/api/configs'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      list: [],
      index: -1,
      form: {
        price: 0,
        my_price: 0,
        month: 0
      },
      rules: {}
    }
  },
  methods: {
    init(list, data, index) {
      this.visible = true
      this.list = list
      this.index = index
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.index >= 0) {
            this.list.splice(this.index, 1 ,this.form)
          } else {
            this.list.push(this.form)
          }

          putCollection({money: this.list})
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
<style scoped>
  .notice {
    color: #909399;
    font-size: 12px;
  }
  .el-input-number {
    width: 200px;
  }
  .app-container {
    width: 800px;
  }
</style>
