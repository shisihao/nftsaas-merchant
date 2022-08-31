<template>
  <div>
    <span title="联系客服">
      <svg-icon icon-class="kefu" @click="showDialog = true" />
    </span>
    <el-dialog title="联系客服" append-to-body :visible.sync="showDialog">
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import SocialSign from './components/SocialSignin'

export default {
  name: 'kefu',
  components: { SocialSign },
  data() {
    return {
      showDialog: false,
    }
  },
  mounted() {
  },
  methods: {
    click() {
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
