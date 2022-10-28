<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="form.name" placeholder="海报名称" clearable />
      </el-form-item>
      <el-form-item label="运费配置">
        <tree-city ref="treeCity" :form.sync="form" />
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
import { addOrUpdate } from '@/api/delivery'
import TreeCity from './treeCity/TreeCity'

export default {
  name: 'AddOrUpdate',
  components: { TreeCity },
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        name: '',
        freight: [],
        no_delivery: []
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$refs.treeCity.onTreeChange()
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
      this.$reset()
      this.$emit('closeAddOrUpdate')
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .freight {
      width: 80px;
      ::v-deep input {
        height: 22px;
        line-height: 22px;
      }
    }
  }
  .spacing {
    margin-bottom: 10px;
  }
</style>
