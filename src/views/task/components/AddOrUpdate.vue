<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="任务名称" clearable />
      </el-form-item>
      <el-form-item label="任务描述" prop="describe">
        <el-input v-model="form.describe" type="textarea" placeholder="任务描述" clearable />
      </el-form-item>
      <el-form-item v-if="form.type !== 'once'" label="可完成次数" prop="number">
        <el-input-number v-model="form.number" class="input-number-box" :min="1" placeholder="可完成次数" />
      </el-form-item>
      <el-form-item label="奖励数量" prop="reward">
        <el-input-number v-model="form.reward" class="input-number-box" :min="1" :precision="4" placeholder="奖励数量" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
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
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/task'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        name: '',
        describe: '',
        type: '',
        number: 1,
        reward: 0,
        status: 0,
        sort: 0
      },
      agentList: [],
      roleOptions: [],
      rules: {
        name: [
          { required: true, message: '任务签到不能为空', trigger: ['blur', 'change'] }
        ],
        describe: [
          { required: true, message: '任务描述不能为空', trigger: ['blur', 'change'] }
        ],
        number: [
          { required: true, message: '次数不能为空', trigger: ['blur', 'change'] }
        ],
        reward: [
          { required: true, message: '奖励数量不能为空', trigger: ['blur', 'change'] }
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
      this.btnLoading = false
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.icon = response
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    }
  }
}
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.input-number-box {
  width: 250px;
}
</style>
