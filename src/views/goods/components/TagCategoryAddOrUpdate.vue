<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="分类名称" clearable />
      </el-form-item>
      <el-form-item label="排序(越大越靠前)" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="form.tags" style="width: 100%;" multiple clearable placeholder="请选择藏品标签">
          <el-option v-for="(item, index) in tagsOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
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
import { addOrUpdate } from '@/api/tagCategory'
import { tagList } from '@/api/common'

export default {
  name: 'CategoryAddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        name: '',
        sort: 0,
        tags: []
      },
      tagsOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        tags: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.tagLists()
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
        this.form.tags = this.form.tags.map(v => {
          return v.id
        })
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
    tagLists() {
      tagList().then(response => {
        this.tagsOptions = response.data.map(v => {
          return {
            label: v.name,
            value: v.id
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.el-input-number {
  width: 200px;
}
</style>
