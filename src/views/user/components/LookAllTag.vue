<template>
  <el-dialog title="查看标签" :visible.sync="visible" @closed="onClose()">
    <div>
      <el-tag v-for="(item, index) in List" :key="index" style="margin-left: 5px">{{ item.name }}</el-tag>
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
