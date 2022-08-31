<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="所属专区" prop="zone">
        <el-select v-model="form.zone" :disabled="form.id > 0" clearable>
          <el-option v-for="item in zoneOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="['fil', 'bzz'].includes(form.zone) ? '节点号' : '分组名称'" prop="name">
        <el-input v-model="form.name" :placeholder="['fil', 'bzz'].includes(form.zone) ? '节点号' : '分组名称'" clearable />
      </el-form-item>
      <div class="notice">
        注意：创建期数分组之后，可到期数编辑中做期数分组，分组专区确认之后无法更改
      </div>
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
import { addOrUpdate } from '@/api/group'
import { zoneOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      zoneOptions: zoneOptions.slice(1),
      form: {
        id: 0,
        zone: '',
        name: ''
      },
      rules: {
        zone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
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
        this.form = Object.assign({}, data)
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
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style>
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
</style>
