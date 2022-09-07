<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule" label-width="220px">
      <el-form-item label="赠送开关">
        <el-switch
          v-model="form.switch"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item label="购买后赠送限制天数" prop="buy">
        <el-input-number v-model="form.buy" :min="0" />
      </el-form-item>
      <el-form-item label="再次赠送限制天数" prop="again">
        <el-input-number v-model="form.again" :min="0" />
      </el-form-item>
      <!-- <el-form-item label="铸造藏品购买后赠送限制天数" prop="cast_buy">
        <el-input-number v-model="form.cast_buy" :min="0" />
      </el-form-item>
      <el-form-item label="铸造藏品再次赠送限制天数" prop="cast_again">
        <el-input-number v-model="form.cast_again" :min="0" />
      </el-form-item> -->
      <el-form-item label="温馨提示">
        <el-input v-model="form.reminder" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { giveList, addGiveList } from '@/api/configs'

export default {
  name: 'Give',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        buy: 0,
        again: 0,
        airdrop_buy: 0,
        airdrop_again: 0,
        reminder: '',
        switch: ''
        // on-开启 off-关闭
      },
      rule: {
        buy: [{ required: true, message: '请输入购买后赠送限制天数', trigger: 'blur' }],
        again: [{ required: true, message: '请输入再次赠送限制天数', trigger: 'blur' }],
        airdrop_buy: [{ required: true, message: '请输入空投后赠送限制天数', trigger: 'blur' }],
        airdrop_again: [{ required: true, message: '请输入空投后再次赠送限制天数', trigger: 'blur' }]
        // cast_buy: [{ required: true, message: '请输入铸造藏品购买后赠送限制天数', trigger: 'blur' }],
        // cast_again: [{ required: true, message: '请输入铸造藏品再次赠送限制天数', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      giveList({ ...this.form })
        .then(response => {
          if (response.code !== 0) return
          this.form = Object.assign({}, response.data.value)
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addGiveList({ ...this.form })
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
    .app-container {
        width: 800px;
    }
</style>
