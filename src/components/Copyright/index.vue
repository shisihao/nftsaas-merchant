<template>
  <div class="footer">
    <div class="copyright">
        Copyright © {{ time }} <a href="https://www.chainone.cloud/" target="_blank">成都链优科技出品</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: new Date().getFullYear()
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.footer {
  padding: 40px 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}
</style>
