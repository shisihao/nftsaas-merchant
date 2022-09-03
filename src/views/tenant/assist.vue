<template>
  <div v-loading="cateLoading" class="app-container">
    <el-empty v-if="noCateData" description="暂无数据" />
    <div v-else>
      <el-tabs v-model="cateActiveName" type="card" @tab-click="handleCateTab">
        <el-tab-pane v-for="(value, index) in cateOptions" :key="index" :label="value.name" :name="`cate_${index}`" />
      </el-tabs>
      <div v-loading="helpLoading">
        <el-empty v-if="noHelpData" description="暂无数据" />
        <div v-else class="app-content">
          <div class="tab-box">
            <el-tabs v-model="activeName" tab-position="left">
              <el-tab-pane v-for="(value, index) in list" :key="index" :label="value.title" :name="`help_${index}`" />
            </el-tabs>
          </div>
          <div class="app-box">
            <div v-html="list[0] ? list[activeName.split('_')[1]].content : ''" />
          </div>
        </div>
      </div>
    </div>
    <back-to-top :visibility-height="300" :back-position="0" transition-name="fade" />
  </div>
</template>

<script>
import { getHelpCate, getHelp } from '@/api/tenant'
import { pickerOptions } from '@/utils/explain'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'Assist',
  components: { BackToTop },
  data() {
    return {
      noCateData: true,
      noHelpData: true,
      cateLoading: false,
      helpLoading: false,
      cateActiveName: 'cate_0',
      activeName: 'help_0',
      cateOptions: [],
      list: [],
      search: {
        cate_id: 0
      },
      pages: {
        total: 0,
        limit: 1000,
        current: 1
      },
      dateRangeValue: [],
      pickerOptions,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCate()
        .then(() => {
          this.getList()
        })
    },
    async getCate() {
      this.cateLoading = true
      await getHelpCate()
        .then(response => {
          if (response.data.length > 0) {
            this.noCateData = false
            this.cateOptions = response.data
            this.search.cate_id = response.data[0].id
          }
        })
        .finally(() => {
          this.cateLoading = false
        })
    },
    getList(page = this.pages.current, loading = true) {
      if (this.helpLoading) return
      this.helpLoading = loading
      this.noHelpData = true
      if (page === 1) this.pages.current = page
      getHelp({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
          if (response.data.data.length > 0) {
            this.noHelpData = false
          }
        })
        .catch(() => {})
        .finally(() => {
          this.helpLoading = false
        })
    },
    handleCateTab() {
      this.search.cate_id = this.cateOptions[this.cateActiveName.split('_')[1]].id
      this.activeName = 'help_0'
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-content {
  display: flex;
  min-height: 400px;
  .tab-box {
    width: 190px;
    .el-tabs {
      position: relative;
      width: 100%;
      height: 100%;
      ::v-deep .el-tabs__header {
        float: none;
        width: 100%;
        .is-active {
          background-color: #E7F7FF;
        }
        .is-left {
          text-align: left;
          margin-right: 0;
        }
      }
    }
  }
  .app-box {
    flex-grow: 1;
    padding: 0 20px;
    overflow: auto;
  }
}
</style>
