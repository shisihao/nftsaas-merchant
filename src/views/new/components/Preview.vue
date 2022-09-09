<template>
  <el-dialog width="1000px" title="资讯库" :visible.sync="visible" @closed="onClose()">
    <div style="font-size: 18px;">
      {{ form.title }}
    </div>
    <el-divider />
    <div class="dialog-content" v-html="form.content" />
  </el-dialog>
</template>

<script>
import { zoneOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      zoneOptions: zoneOptions.slice(1),
      form: {
        id: 0,
        zone: '',
        title: '',
        content: ''
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
    onClose() {
      this.$reset('data', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  min-height: 400px;
}
</style>
