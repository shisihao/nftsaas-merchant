<template>
  <div>
    <el-dialog :title="form.goods_id? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="基准价" prop="price">
          <el-input-number v-model="form.price" placeholder="请输入基准价" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model.trim="form.code" maxlength="6" placeholder="请输入谷歌验证码" clearable />
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
  </div>

</template>

<script>
import { getToken, DominKey } from '@/utils/auth'
import { putData } from '@/api/consignment-price'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      form: {
        goods_id: 0,
        type: '',
        price: '',
        code: ''
      },
      rules: {
        price: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.goods_id = data.data.id
        this.form.type = data.type
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          putData(this.form).then(({ msg }) => {
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
      this.$reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
	display: inline-block;
	::v-deep .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.el-upload:hover {
		border-color: #409eff;
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
		object-fit: contain;
	}
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.el-input-number{
  width: 200px;
}
</style>
