<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="期数/规格">
          <el-cascader
            clearable
            filterable
            :options="levelOptions"
            @change="onhandleChangeZone"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
    </div>

    <div class="level-box">
      <div v-if="list.length === 0">
        <el-empty v-loading="loading" description="暂无数据"></el-empty>
      </div>
      <div v-else>
        <div class="level-item" v-for="value in list" :key="value.id">
          <div>
            {{ value.created_at }}
          </div>
          <div>
            期数名：{{ search.period_name }}
          </div>
          <div>
            规格：{{ search.spec_name }}
          </div>
          <div>
            分发收益：{{ value.amount | cutZero }}
          </div>
          <div>
            封装数：{{ value.extend ? value.extend.fz_num : 0 | cutZero }}
          </div>
          <div>
            借贷质押：{{ value.extend ? value.extend.pledge_amount : 0 | cutZero }}
          </div>
          <div>
            借贷GAS：{{ value.extend ? value.extend.gas_amount : 0 | cutZero }}
          </div>
        </div>
        <pagination v-show="pages.total > 0" layout="prev, pager, next" :background="false" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" :pagerCount="5" @pagination="getList()" />
      </div>
    </div>
  </div>
</template>
<script>
import { zoneOptions, catesOptions } from '@/utils/explain'
import { getAntPeriodsLogs, getAntPeriodsLevel } from '@/api/fil-level'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: {
    zone: {
      type: String,
      default: 'fil'
    }
  },
  data() {
    return {
      catesOptions,
      zoneOptions,
      loading: false,
      levelOptions: [],
      search: {
        zone: '',
        period_name: '',
        spec_name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAntPeriodsLevel()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      this.search.zone = this.zone
      getAntPeriodsLogs({ page, ...this.search, limit: this.pages.limit })
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
    getAntPeriodsLevel() {
      getAntPeriodsLevel()
        .then(response => {
            this.levelOptions = []
            Object.keys(response.data).forEach(v => {
              let c = []
              response.data[v].forEach(i => {
                c.push({
                  value: i,
                  label: i,
                })
              })
              this.levelOptions.push({
                value: v,
                label: v,
                children: c
              })
            })
          })
          .catch(() => {
          })
          .finally(() => {
          })
    },
    onhandleChangeZone(val) {
      this.search.period_name = val[0] || ''
      this.search.spec_name = val[1] || ''
      this.getList(1)
    },
    onCloseLevel() {
      this.$emit('onCloseBLevel', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
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
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    div:nth-child(1) {
      color: #999;
      margin-bottom: 6px;
    }
  }
}
</style>