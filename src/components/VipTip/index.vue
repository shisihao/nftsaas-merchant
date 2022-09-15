<template>
  <el-dialog
    title="提示"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
    width="400px"
  >
    <span>
      您的服务器距离到期还剩 <b style="color: #f56c6c;">{{ info.due_day }}</b> 天
      <p>为了避免过期无法正常使用本产品，请尽快续费</p>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onGoRenew">去续费</el-button>
      <el-button @click="onKnow">知道了</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'VipTip',
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  methods: {
    init() {
      if (!this.info) {
        this.$store.dispatch('user/getTenant')
          .then(data => {
            if (data.day > data.due_day) {
              this.showTip()
            }
          })
      } else {
        if (this.info.day > this.info.due_day) {
          this.showTip()
        }
      }
    },
    onGoRenew() {
      this.onKnow()
      this.$router.push({ path: '/tenants' })
    },
    onKnow() {
      this.dialogVisible = false
      sessionStorage.setItem('token', getToken())
    },
    showTip() {
      if (sessionStorage.getItem('token') === getToken()) {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>
