<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="营业执照" prop="business_license">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.business_license" :src="domin + form.business_license" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="机构代码" prop="org_code">
        <el-input v-model="form.org_code" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="负责人" prop="director">
        <el-input v-model="form.director" placeholder="负责人" clearable />
      </el-form-item>
      <el-form-item label="省市区" prop="location">
        <el-cascader
          v-model="form.location"
          :options="regionData"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" placeholder="详细地址" clearable />
      </el-form-item>
      <el-form-item label="合作时间" prop="dateRangeValue">
        <el-date-picker
          v-model="dateRangeValue"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="onChangeDateRange"
        />
      </el-form-item>
      <el-form-item label="合作协议" prop="agreement">
        <el-input v-model="form.agreement" type="textarea" :rows="8" placeholder="合作协议" clearable />
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
import { addOrUpdate } from '@/api/partner'
import { regionData } from 'element-china-area-data'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      regionData,
      pickerOptions,
      form: {
        id: 0,
        dateRangeValue: [],
        name: '',
        org_code: '',
        phone: '',
        business_license: '',
        cooperation_start: '',
        cooperation_end: '',
        director: '',
        agreement: '',
        location: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        org_code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        business_license: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        dateRangeValue: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cooperation_start: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cooperation_end: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        director: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        agreement: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        location: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = data
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
      this.$reset()
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.cooperation_start = value[0]
        this.form.cooperation_end = value[1]
      } else {
        this.form.cooperation_start = ''
        this.form.cooperation_end = ''
        this.getList(1)
      }
    },
    handleAvatarSuccess(response, file) {
      this.form.business_license = response
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
  width: 100px;
  min-height: 100px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  width: 100%;
  height: auto;
}
</style>
