<template>
  <el-dialog
    title="导出消费金额排名"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClose()"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.native.prevent
    >
      <el-form-item label="选择时间周期" prop="dateRangeValue">
        <el-date-picker
          v-model="dateRangeValue"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onChangeDateRange"
        />
      </el-form-item>
      <el-form-item label="用户数量" prop="num">
        <el-input-number v-model="form.num" :min="1" label="用户数量" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onhandleSubmit">
        {{ $t("table.confirm") }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t("table.cancel") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { exportSerialExcel } from '@/api/user'
import { pickerOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'FeeRank',
  data() {
    const validateTime = (rule, value, callback) => {
      if (this.form.start_time === '' || this.form.end_time === '') {
        callback(new Error('请选择时间周期'))
      } else {
        callback()
      }
    }
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      pickerOptions,
      dateRangeValue: [],
      form: {
        num: '',
        start_time: '',
        end_time: ''
      },
      rules: {
        dateRangeValue: [
          { required: true, validator: validateTime, trigger: ['blur', 'change'] }
        ],
        num: [
          { required: true, trigger: ['blur', 'change'], message: '不能为空' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    onClose() {
      this.$reset()
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.start_time = value[0]
        this.form.end_time = value[1]
      } else {
        this.form.start_time = this.form.end_time = ''
      }
    },
    onhandleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(`确定进行[导出]操作?`, '导出', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
            cancelButtonClass: 'btn-custom-cancel'
          })
            .then(() => {
              this.btnLoading = true
              exportSerialExcel(this.form)
                .then((response) => {
                  this.visible = false
                  location.href = this.domin + response.data.filename
                })
                .catch(() => {})
                .finally(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
}
</style>
