<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="邀请规则文案配置" prop="url">
        <el-input v-model="form.rule" type="textarea" :rows="10" placeholder="邀请规则文案配置" clearable />
      </el-form-item>
      <el-form-item label="邀请链接文案配置" prop="rule">
        <el-input v-model="form.url_rule" type="textarea" :rows="10" placeholder="邀请链接文案配置" clearable />
      </el-form-item>

      <!--<el-form-item label="二级邀请奖励" prop="power">
        <el-input-number :min='0' :step='1' v-model='form.power' />
        <div class="notice">
          注意：二级邀请奖励为矿力
        </div>
      </el-form-item>
      <el-form-item label="一级邀请奖励" prop="rule">
        <el-input v-model="form.f_power" placeholder="一级邀请奖励" clearable />
      </el-form-item>
      <el-form-item label="二级邀请奖励" prop="rule">
        <el-input v-model="form.s_power" placeholder="二级邀请奖励" clearable />
      </el-form-item>
      <el-form-item label="领取奖励" prop="release_rate">
        <el-input-number v-model="form.release_rate" :min="0" :max="100" label="领取奖励" />
        <div class="notice">注意：领取奖励单位(%)，最大值100</div>
      </el-form-item>
      <el-form-item label="邀请方式" prop="mode">
        <el-input v-model="form.mode" type="textarea" :rows="10" placeholder="邀请方式" clearable />
      </el-form-item>
      <el-form-item label="邀请码填写说明" prop="rule">
        <el-input v-model="form.rule" type="textarea" :rows="10" placeholder="邀请码填写说明" clearable />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { invite, putInvite } from '@/api/configs'
export default {
  name: 'Invite',
  data() {
    return {
      btnLoading: false,
      form: {
        rule: '',
        url_rule: ''
      },
      rules: {
        rule: [
          { required: true, message: '邀请链接不能为空', trigger: 'blur' }
        ],
        url_rule: [
          { required: true, message: '邀请链接不能为空', trigger: 'blur' }
        ]
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
    getList() {
      invite()
        .then(response => {
          this.form = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putInvite(this.form)
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
.notice {
  color: #909399;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
.app-container {
  width: 800px;
}
</style>
