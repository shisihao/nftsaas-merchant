<template>
  <div>
    <el-badge :value="msgCount" :hidden="msgCount === 0" :max="99" class="item">
      <i class="el-icon-message-solid" title="消息中心" @click="click" />
    </el-badge>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Whispers',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'msgCount'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('user/getMsgCount')
    },
    click() {
      this.$router.push({ path: '/whisper' })
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
::v-deep .el-badge__content {
  top: 50%;
  margin-top: -10px;
}
</style>
