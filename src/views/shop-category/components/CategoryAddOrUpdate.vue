<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" append-to-body @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="分类名称" clearable />
      </el-form-item>
      <el-form-item v-if="form.parent_id" label="所属一级分类" prop="parent_id">
        <el-select v-model="form.parent_id" :disabled="!form.id" clearable>
          <el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!form.parent_id" label="图片" prop="image">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.image" :src="domin + form.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">注意：建议图片尺寸 128*128px</div>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :precision="0" />
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
import { addOrUpdate } from '@/api/shop-category'
import { getToken, DominKey } from '@/utils/auth'
import { goodsCategoryList } from '@/api/common'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'CategoryAddOrUpdate',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        name: '',
        image: '',
        parent_id: '',
        sort: 0
      },
      cateOptions: [],
      rules: {
        sort: [
          { required: true, message: '请输入排序', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ],
        image: [
          { required: true, message: '请上传图片', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
        if (data.parent_id) {
          this.getCategorygoodsCategoryList()
        }
      }
    },
    getCategorygoodsCategoryList() {
      goodsCategoryList()
        .then((response) => {
          this.cateOptions = response.data
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          if (!data.parent_id) {
            data.parent_id = 0
          }
          addOrUpdate(data)
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
    handleAvatarSuccess(response, file) {
      this.form.image = response.name
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      cb(true)
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 200px;
}
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
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
</style>
