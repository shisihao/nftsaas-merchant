<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="全年电价" prop="year">
        <el-input-number v-model="form.year" placeholder="全年电价" />
      </el-form-item>
      <el-form-item label="显卡全年电价" prop="gpu_year">
        <el-input-number v-model="form.gpu_year" placeholder=" 显卡全年电价" />
      </el-form-item>
      <el-form-item label="枯水电价" prop="low_water">
        <el-input-number v-model="form.low_water" placeholder="枯水电价" />
      </el-form-item>
      <el-form-item label="沣水电价" prop="full_water">
        <el-input-number v-model="form.full_water" placeholder="沣水电价" />
      </el-form-item>
      <el-form-item label="沣水月份范围">
        <el-input-number v-model="form.start_month" controls-position="right" placeholder="开始月" :min="1" :max="12" :precision="0" />
        —
        <el-input-number v-model="form.end_month" controls-position="right" placeholder="结束月" :min="1" :max="12" :precision="0" />
      </el-form-item>
      <el-form-item label="最低充值金额" prop="limit">
        <el-input-number v-model="form.limit" placeholder="最低充值金额" />
      </el-form-item>
      <el-form-item label="提示说明" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="提示说明" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { electricity, putElectricity } from '@/api/configs'
export default {
  name: 'Electricity',
  data() {
    return {
      btnLoading: false,
      inputVisible: false,
      form: {
        year: 0,
        gpu_year: 0,
        low_water: 0,
        full_water: 0,
        start_month: 1,
        end_month: 1,
        limit: 0,
        desc: ''
      },
      rules: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      electricity()
        .then(response => {
          this.form = response.data
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          putElectricity(data)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.app-container ::v-deep {
  width: 800px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  height: 26px;
  line-height: 24px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
