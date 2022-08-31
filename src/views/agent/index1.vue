<template>
  <div class="app-container">

    <div class="ginner clearfix">
      <el-card class="box-card" v-for="(item, $index) in list" :key="$index" shadow="hover">
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onAddOrUpdate(item)">编辑</el-button>
        </div>
        <el-divider v-if="item.condition.length > 0" content-position="left">晋升条件</el-divider>
        <ul class="text">
          <li v-for="(i,$index) in item.condition" :key="$index">
            <span v-if="['novice'].includes(item.level) && i.key === 'buy:sale'">自购 <el-link type="warning" :underline="false">{{ i.value }}</el-link> 台以上设备</span>
            <span v-if="['bronze'].includes(item.level) && i.key === 'buy:sale'">直推 <el-link type="warning" :underline="false">{{ i.value }}</el-link> 个矿工(有效用户)</span>
            <span v-if="['bronze'].includes(item.level) && i.key === 'total:performance'">销售业绩大于等于 <el-link type="warning" :underline="false">{{ i.value | toThousandBitFilter }}</el-link> </span>
          </li>
        </ul>
        <el-divider v-if="item.equities.length > 0" content-position="left">拥有权益</el-divider>
        <ul class="text">
          <li v-for="(i,$index) in item.equities" :key="$index">
            <span v-if="['copartner'].includes(item.level) && i.key === 'eth_sale_commission'">ETH工作收益提成 <el-link type="warning" :underline="false">{{ i.value }}%</el-link></span>
            <span v-if="['copartner'].includes(item.level) && i.key === 'fil_sale_commission'">FIL工作收益提成 <el-link type="warning" :underline="false">{{ i.value }}%</el-link></span>
            <span v-if="['copartner'].includes(item.level) && i.key === 'btc_sale_commission'">BTC工作收益提成 <el-link type="warning" :underline="false">{{ i.value }}%</el-link></span>
            <span v-if="['copartner'].includes(item.level) && i.key === 'team_commission'">工作平级奖励 <el-link type="warning" :underline="false">{{ i.value }}%</el-link></span>
          </li>
        </ul>
      </el-card>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { dataList } from '@/api/agent'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'

export default {
  name: 'Agent',
  components: { AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      addOrUpdateVisible: false,
      loading: false,
      scheme: 0,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList()
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    }
  }
}
</script>
<style scoped>
.ginner {
  width: calc(100% + 10px);
}
.box-card {
  width: 320px;
  float: left;
  margin-right: 10px;
  margin-bottom: 20px;
}
.text {
  font-size: 14px;
  padding-left: 20px;
}
</style>
