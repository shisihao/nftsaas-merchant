<template>
  <el-dialog title="查看链上标识" :visible.sync="visible" @closed="onClose()">
    <div>
      <el-tag v-for="(item, index) in List" :key="index" style="margin-left: 5px">{{ item }}</el-tag>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'LookAllTag',
  data() {
    return {
      visible: false,
      List: []
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.List = data
      }
    },
    onClose() {
      this.visible = false
      this.List = []
    }
  }
}
</script>

<style scoped>
    ::v-deep .el-dialog {
        width: 800px;
    }

</style>
