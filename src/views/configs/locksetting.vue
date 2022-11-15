<template>
  <div class="app-container">
    <el-form ref="form" :model="defaultValue" :rules="rules" label-position="left" label-width="110px">
      <el-form-item label="开关">
        <el-switch
          v-model="defaultValue.switch"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item label="锁单价格">
        <el-input-number v-model="defaultValue.lock_price" :min="0" :precision="2" controls-position="right" />
      </el-form-item>
      <el-form-item label="锁单手机号" prop="account">
        <div class="account-wrap">
          <div v-show="defaultValue.account.length" class="account-container-1">
            <el-tag
              v-for="(tag,accountIndex) in defaultValue.account"
              :key="accountIndex"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="account-container-2">
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model.number.trim="inputValue"
              class="input-new-tag"
              @keyup.enter.native="$event.target.blur"
              @blur="handleInputConfirm"
            />
            <template v-else>
              <el-button class="button-new-tag" size="small" @click="showInput">+ 添加手机号</el-button>
            </template>
          </div>
        </div>
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
import { lock, putLock } from '@/api/configs'
import { validPhone } from '@/utils/validate'
export default {
  name: 'Locksetting',
  data() {
    return {
      btnLoading: false,
      inputVisible: false,
      inputValue: '',
      defaultValue: {
        switch: 'off',
        lock_price: 0,
        account: []
      },
      form: {

      },
      rules: {

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
      lock()
        .then(response => {
          this.form = response.data.value
          this.defaultValue = response.data.value
        })
        .catch(() => {
        })
    },
    handleClose(tag) {
      this.defaultValue.account.splice(this.defaultValue.account.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (!inputValue) {
        this.inputVisible = false
        return
      } else if (!validPhone(inputValue)) {
        this.$message.warning('请输入正确的手机号')
        return
      } else if (inputValue && this.defaultValue.account.indexOf(inputValue) === -1) {
        this.defaultValue.account.push(inputValue)
      } else {
        return this.$message.warning('账号已存在')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onFormSubmit() {
      this.btnLoading = true
      putLock({ value: this.form })
        .then(({ msg }) => {
          this.$message.success(msg)
          this.getList()
        })
        .catch(() => {
          this.getList()
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style  scoped>
.app-container{
  width: 800px;
}
.el-input-number{
  width: 200px;
}

 .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag--mini {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 15px;
}
.account-wrap{
  display: flex;

}
.account-container-1{
flex: 7;
}
.account-container-2{
flex: 2;
}
.el-form{
  padding-left: 10px;
}
</style>
