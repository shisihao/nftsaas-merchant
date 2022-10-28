<template>
  <div>
    <el-form-item label="商品详情" prop="detail">
      <tinymce
        v-if="visible"
        v-model="form.detail"
        :height="400"
        placeholder="请输入商品详情"
      />
    </el-form-item>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ShopStep3',
  components: { Tinymce },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {
        return {
          detail: ''
        }
      }
    }
  }
}
</script>
