<template>
  <div>
    <i class="el-icon-info" title="操作说明" @click="click" />
  </div>
</template>

<script>
// import screenfull from 'screenfull'

export default {
  name: 'Operateinfo',
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    click() {
      this.$router.push({ path: '/assist' })
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
