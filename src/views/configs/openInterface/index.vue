<template>
  <div class="app-container">
    <add-or-update v-for="(value, key, index) in form" :key="index" :form="form" :type="key" class="update" @refreshList="getList()" />
  </div>
</template>

<script>
import { getGwjOpen } from '@/api/configs'
import AddOrUpdate from './components/AddOrUpdate.vue'
export default {
  name: 'OpenInterface',
  components: { AddOrUpdate },
  data() {
    return {
      form: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      getGwjOpen()
        .then((response) => {
          this.form = response.data.value
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.update {
  margin-bottom: 30px;
}
</style>
