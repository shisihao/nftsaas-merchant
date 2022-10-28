<template>
  <el-dialog append-to-body title="批量编辑运费" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="范围" prop="type">
        <el-select v-model="form.type" clearable placeholder="请选择">
          <el-option v-for="(item, index) in rangeOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="运费">
        <el-input v-model.number="form.amount" type="number" placeholder="运费" clearable />
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

export default {
  name: 'Freight',
  data() {
    return {
      visible: false,
      btnLoading: false,
      rangeOptions: [
        { label: '全部', value: '' },
        { label: '已勾选', value: 1 },
        { label: '省', value: 2 },
        { label: '市', value: 3 },
        { label: '县(区)', value: 4 }
      ],
      form: {
        type: '',
        amount: ''
      },
      rules: {
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('freightValue', this.form)
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

<style lang="scss" scoped>
  .el-input ::v-deep input::-webkit-outer-spin-button,
  .el-input ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .el-input ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
