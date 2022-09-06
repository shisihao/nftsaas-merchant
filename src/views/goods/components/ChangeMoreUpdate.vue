<template>
  <el-dialog title="编辑多次发售" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="100">
      <el-form-item label="开售时间" prop="start_time">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="开售时间"
          :picker-options="pickerOptions0"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否售罄" prop="sell_out">
        <el-select v-model="form.sell_out" clearable>
          <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" style="margin-left: 10px" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { whetherOptions } from '@/utils/explain'
import { putMoreOrUpdate } from '@/api/collection'

export default {
  name: 'ChangeMoreOrUpdate',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      visible: false,
      loading: false,
      btnLoading: false,
      whetherOptions: whetherOptions.slice(1),
      form: {
        id: 0,
        sell_out: 0,
        start_time: new Date()
      },
      rules: {
        sell_out: [
          { required: true, message: '请选择是否售罄', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '请选择开售时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.form.id = data.id
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    onClose() {
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确定对[(#${this.form.id})]进行修改?`, '编辑', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.btnLoading = true
              putMoreOrUpdate(this.form)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                  this.$emit('refreshList')
                })
                .catch(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => {
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input-number {
    width: 200px;
  }
</style>
