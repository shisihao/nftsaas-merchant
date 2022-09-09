<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="隐私协议" prop="privacy">
        <tinymce v-model="form.privacy" :height="400" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :loading="btnLoading" @click="onAddOrUpdate()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dataList, addOrUpdate } from '@/api/agreement'
import Tinymce from '@/components/Tinymce/index'
export default {
  name: 'Agreement',
  components: { Tinymce },
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        privacy: ''
      },
      rules: {
        privacy: [
          { required: true, message: '协议不能为空', trigger: 'blur' }
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList().then(response => {
        this.form.privacy = response.data.value
      })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate() {
      this.btnLoading = true
      addOrUpdate(this.form).then(({ msg }) => {
        this.$message.success(msg)
      })
        .catch(() => {})
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  width: 1000px;
}
.all-card {
  display: flex;
  flex-wrap: wrap;
}
.box-card {
  width: 260px;
  height: 300px;
  margin: 10px;
  ::v-deep .el-card__header{
    height: 55px;
    position: relative;
    .use-tips {
      vertical-align: text-top;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  ::v-deep .el-card__body {
    height: calc(100% - 55px);
    padding: 0;
    .card-content {
      width: 100%;
      height: calc(100% - 60px);
      padding: 20px;
      margin-bottom: 19px;
      overflow: hidden;
      box-sizing: border-box;
      .el-empty__image {
        width: 60px;
      }
    }
    .card-footer {
        width: 100%;
        height: 40px;
        display: flex;
        border-top: 1px solid #e6ebf5;
        section {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:nth-child(2) {
            width: calc(50% - 1px);
            border-left: 1px solid #e6ebf5;
          }
        }
      }
  }
}
</style>
