<template>
  <div>
    <el-dialog :title="`分发收益-${form.zone}`" :visible.sync="visible" @closed="onClose()">
      <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="总T数">
          {{ form.order_count }}
        </el-form-item>
        <el-form-item :label="`单T产量(${form.zone.toUpperCase()}${form.zone === 'fil' ? '/TiB' : ''})`" prop="per_ming_num">
          <el-input-number v-model="form.per_ming_num" :precision="8" :min="0" placeholder="请输入" />
          <div class="notice1" style="color: #f56c6c;">
            注意：当日分发错误可以在分发记录中撤销
          </div>
        </el-form-item>
        <!-- <el-form-item label="分发日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
          <div class="notice">
            提醒：不设置日期为分发当前日期
          </div>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="dataLoading" type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addIssue, getSpecs } from '@/api/group'

export default {
  name: 'AddIssue',
  data() {
    const validateReplace = (rule, value, callback) => {
      if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        callback(new Error('必须是大于0的数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      btnLoading: false,
      dataLoading: false,
      form: {
        id: 0,
        zone: '',
        name: '',
        per_ming_num: 0,
        order_count: 0,
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
      },
      rules: {
        per_ming_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateReplace, trigger: ['blur', 'change'] }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.id = data.id
        this.form.zone = data.zone
        this.form.name = data.name
        this.getSpec()
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确定对[(#${this.form.id})] ${this.form.zone.toUpperCase()} ${this.form.name} 进行操作?`, '分发', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
            .then(() => {
              this.btnLoading = true
              addIssue(this.form)
                .then(({ msg }) => {
                  this.visible = false
                  this.$message.success(msg)
                })
                .catch(() => {
                })
                .finally(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => {})
        }
      })
    },
    getSpec() {
      this.loading = true
      getSpecs(this.form.id)
        .then((response) => {
          this.form.order_count = response.data
          this.dataLoading = true
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style scoped>
.notice {
  color: #E6A23C;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.notice1 {
  color: #909399;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
</style>
