<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="藏品权益" name="interest">
        <interest />
      </el-tab-pane>
      <!-- <el-tab-pane label="藏品赠送" name="give">
        <give />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Interest from './Interest'
// import Give from './Give'

export default {
  name: 'Legal',
  components: { Interest },
  data() {
    return {
      activeName: 'interest'
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
