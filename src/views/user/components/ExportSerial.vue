<template>
  <el-dialog title="指定藏品导出" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="medium"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="指定藏品" prop="serial">
        <el-tag
          v-for="(item, index) in form.serial"
          :key="index"
          closable
          effect="plain"
          size="medium"
          @close="handleClose(index)"
        >
          {{ item }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          @keyup.enter.native="onAddserial"
          @blur="onAddserial"
        />
        <el-button v-else size="small" @click="showInput">+ 添加</el-button>
      </el-form-item>
      <el-form-item label="藏品编号">
        <el-tag
          v-for="(item, index) in form.goods_num"
          :key="index"
          closable
          effect="plain"
          size="medium"
          type="info"
          @close="handleClose(index, 'num')"
        >
          {{ item }}
        </el-tag>
        <el-input
          v-if="inputNumVisible"
          ref="saveNumInput"
          v-model="inputNumValue"
          class="input-new-tag"
          @keyup.enter.native="onAddNum"
          @blur="onAddNum"
        />
        <el-button v-else size="small" @click="showNumInput">+ 添加</el-button>
      </el-form-item>
      <el-form-item label="满足数量" prop="num">
        <el-input-number
          v-model="form.num"
          :min="1"
          :max="form.serial.length"
          label="满足数量"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onhandleSubmit">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { exportSerialExcel } from '@/api/user'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'ExportSerial',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      inputVisible: false,
      inputNumVisible: false,
      inputValue: '',
      inputNumValue: '',
      form: {
        serial: [],
        goods_num: [],
        num: ''
      },
      rules: {
        serial: [
          { required: true, trigger: ['blur', 'change'], message: '不能为空' }
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
    handleClose(index, type) {
      if (type === 'num') {
        this.form.goods_num.splice(index, 1)
      } else {
        this.form.serial.splice(index, 1)
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    showNumInput() {
      this.inputNumVisible = true
      this.$nextTick(_ => {
        this.$refs.saveNumInput.$refs.input.focus()
      })
    },
    onAddserial() {
      const inputValue = this.inputValue
      if (this.form.serial.includes(inputValue)) {
        return this.$message.warning('该藏品已添加')
      }

      if (inputValue) {
        this.form.serial.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onAddNum() {
      const inputValue = this.inputNumValue
      if (this.form.goods_num.includes(inputValue)) {
        return this.$message.warning('该藏编号已添加')
      }

      if (inputValue) {
        this.form.goods_num.push(inputValue)
      }
      this.inputNumVisible = false
      this.inputNumValue = ''
    },
    onClose() {
      this.$reset()
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
              if (this.form.num > this.form.serial.length) {
                this.form.num = this.form.serial.length
              }
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
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
