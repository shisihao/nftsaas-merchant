<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div>欢迎来到 {{ info.name }}SaaS平台系统</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
  }
}
</script>

<style  scoped>
</style>

