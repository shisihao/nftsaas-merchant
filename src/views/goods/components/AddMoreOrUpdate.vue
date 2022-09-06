<template>
  <el-dialog title="添加" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="本期发售数量" prop="total_stock">
        <el-input-number v-model="form.total_stock" :precision="0" :min="1" />
      </el-form-item>
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
import { moreOrUpdate } from '@/api/collection'

export default {
  name: 'AddMoreOrUpdate',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      btnLoading: false,
      visible: false,
      form: {
        goods_id: 0,
        total_stock: 0,
        start_time: new Date()
      },
      rules: {
        total_stock: [
          { required: true, message: '请输入本期发售数量', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '请选择开售时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.form.goods_id = id
      this.visible = true
    },
    onClose() {
      this.visible = false
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm('确认添加本期发售数量吗？', '添加', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              moreOrUpdate(this.form)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.$emit('refreshList')
                })
                .catch(() => {
                })
                .finally(() => {
                  this.btnLoading = false
                  this.visible = false
                })
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-input-number{
    width: 200px;
  }
</style>
