<template>
  <div class="app-container">
    <button type="button" class="headerbtn" @click="onCloseLevel"><i class="el-icon el-icon-close"></i></button>
  
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="期数名">
          <el-input v-model="search.keywords" placeholder="期数名" clearable @clear="getList()" @keyup.enter.native="getList()" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList()">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>

    <div class="level-box">
      <div v-if="list.length === 0">
        <el-empty v-loading="loading" description="暂无数据"></el-empty>
      </div>
      <div v-else>
        <div class="level-item" v-for="value in list" :key="value.id">
          <div class="level1">
            <div>
                {{ value.name }}
            </div>
            <div>
                {{ value.zone | paraphrase(zoneOptions) }}
            </div>
          </div>
          <p>
            封装规格：{{ value.spec_name }}
          </p>
          <p>
            期数类型：{{ value.type | paraphrase(catesOptions) }}
          </p>
          <div class="level5">
            <div>
              应还利息比例：{{ value.should_radio }}%
            </div>
            <div>
              欠款利息比例：{{ value.arrears_radio }}%
            </div>
          </div>
          <p>
            利息：{{ value.interest }}%
          </p>
          <div class="level5">
            <div>
              可用数量：{{ value.extend.withdrawable }}%
            </div>
            <div>
              锁仓数量：{{ value.extend.lock }}%
            </div>
            <div>
              抵押数量：{{ value.extend.pawn }}%
            </div>
            <div>
              冻结数量：{{ value.extend.frozen }}%
            </div>
          </div>
        </div>
        <pagination v-show="pages.total > 0" layout="prev, pager, next" :background="false" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" :pagerCount="5" @pagination="getList()" />
      </div>
    </div>
  
  </div>
</template>
<script>
import { zoneOptions, catesOptions } from '@/utils/explain'
import { getAntPeriods } from '@/api/fil-level'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      catesOptions,
      zoneOptions,
      loading: false,
      search: {
        zone: '',
        keywords: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: []
    }
  },
  methods: {
    init(data) {
      this.search.zone = data.type
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      getAntPeriods({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCloseLevel() {
      this.$emit('onCloseBLevel', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100% - 40px);
}
.headerbtn {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
}
.level-box {
  height: 100%;
  overflow-x: auto;
  .level-item {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 6px;
    .level1 {
      display: flex;
      justify-content: space-between;
      div:nth-child(2) {
        font-size: 18px;
      }
    }
    .level5 {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      div {
        width: 50%;
      }
    }
  }
}
</style>