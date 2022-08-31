<template>
  <el-dialog title="设备详情" width="1000px" :visible.sync="visible" @closed="onClose()">
    <div v-loading="loading">
      <div v-if="['fil'].includes(data.goods_order.zone)">
        <el-button type="primary" v-for="(value, index) in typeTabOptions" :key="index" @click="onFlowing(value.value)">{{ value.label }}</el-button>
      </div>
      <div v-else>
        <el-button type="primary" v-for="(value, index) in typeTabOptions.slice(0, 2)" :key="index" @click="onFlowing(value.value)">{{ value.label }}</el-button>
      </div>
      
      <el-divider />

      <div v-if="['fil'].includes(data.goods_order.zone)">
        <el-descriptions size="medium" title="">
          <el-descriptions-item label="设备期数名">{{ data.goods_order.period.name }}</el-descriptions-item>
          <el-descriptions-item label="算力数量(T)">{{ multipliedByNum(data.num, data.goods_order.spec_num) }}</el-descriptions-item>
          <el-descriptions-item label="封装状态">
            <div v-if="data.goods_order.extend.cate === 0">
              <el-link v-if="data.status === 2" type="primary" :underline="false">部署中</el-link>
              <el-link v-if="data.status === 3 && multipliedByNum(dividedByNum(data.assets.fz_num, multipliedByNum(data.num, data.goods_order.spec_num)), 100) < 73" type="warning" :underline="false">进行中</el-link>
              <el-link v-if="data.status === 3 && multipliedByNum(dividedByNum(data.assets.fz_num, multipliedByNum(data.num, data.goods_order.spec_num)), 100) >= 73" type="success" :underline="false">已完成</el-link>
            </div>
            <div v-else>
              <el-link type="success" :underline="false">已完成</el-link>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="设备专区"><span class="uppercase">{{ data.goods_order.zone }}</span></el-descriptions-item>

          <el-descriptions-item v-if="data.goods_order.extend.cate === 0" label="封装数量(T)">{{ (data.assets.fz_num || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item v-else label="封装数量(T)">{{ multipliedByNum(data.num, data.goods_order.spec_num) | cutZero }}</el-descriptions-item>

          <el-descriptions-item label="收益总数(个)">{{ (data.assets.total_ming || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item v-if="['fil'].includes(data.goods_order.zone)" label="设备类型">{{ data.goods_order.extend.cate | paraphrase(catesOptions) }}</el-descriptions-item>
          
          <el-descriptions-item v-if="data.goods_order.extend.cate === 0" label="封装比例">{{ multipliedByNum(dividedByNum(data.assets.fz_num, multipliedByNum(data.num, data.goods_order.spec_num)), 100) <= 100 ? multipliedByNum(dividedByNum(data.assets.fz_num, multipliedByNum(data.num, data.goods_order.spec_num)), 100) : 100 }}%</el-descriptions-item>
          <el-descriptions-item v-else label="封装比例">100%</el-descriptions-item>

          <el-descriptions-item v-if="data.goods_order.extend.cate === 0" label="利率">{{ data.assets.interest_rate }}% <el-button type="text" @click="onSetInterest(data)">编辑</el-button></el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="medium" :column="2" title="设备封装详情：">
          <el-descriptions-item label="使用质押数量(个)">{{ (data.assets.use_pledge || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="GAS消耗数量(个)">{{ (data.assets.use_gas || 0) | cutZero }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="medium" :column="2" title="设备资产概况：">
          <el-descriptions-item label="可用数量(个)">{{ (data.assets.available || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="抵押数量(个)">{{ (data.assets.pawn || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="锁仓数量(个)">{{ (data.assets.lock || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="冻结数量(个)">{{ (data.assets.frozen || 0) | cutZero }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="medium" :column="2" title="总借贷数量：">
          <el-descriptions-item label="借贷质押数量(个)">{{ (data.assets.pledge || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="借贷GAS消耗数量(个)">{{ (data.assets.gas || 0) | cutZero }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="medium" :column="2" title="已归还借贷：">
          <el-descriptions-item label="质押数量(个)">{{ minusNum(data.assets.pledge, data.assets.per_pledge) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="GAS消耗数量(个)">{{ minusNum(data.assets.gas, data.assets.per_gas) | cutZero }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="medium" :column="2" title="待归还借贷：">
          <el-descriptions-item label="质押数量(个)">{{ (data.assets.per_pledge || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="GAS消耗数量(个)">{{ (data.assets.per_gas || 0) | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="累计欠款利息(个)">{{ (data.assets.per_interest || 0) | cutZero }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else>
        <el-descriptions size="medium" title="">
          <el-descriptions-item label="设备期数名">{{ data.goods_order.period.name }}</el-descriptions-item>
          <el-descriptions-item :label="`算力数量(${['eth'].includes(data.goods_order.zone) ? 'M' : 'T' })`">{{ multipliedByNum(data.num, data.goods_order.spec_num) }}</el-descriptions-item>
          <el-descriptions-item label="设备专区"><span class="uppercase">{{ data.goods_order.zone }}</span></el-descriptions-item>
          <el-descriptions-item label="收益总数(个)">{{ data.assets.total_ming | cutZero }}</el-descriptions-item>
          <el-descriptions-item label="回本状态">
            <el-link v-if="data.recovery === 1" type="success" :underline="false">已完成</el-link>
            <el-link v-else type="primary" :underline="false">未完成</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="回本进度">{{ dividedByNum(data.recovery_num, data.total_price) | cutZero }}%</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <el-dialog
      append-to-body
      width="1020px"
      :title="activeName.label"
      :visible.sync="dialogVisible"
    >
      <miner-log v-if="activeName.value === 'miner' && dialogVisible" :id="search.order_id" :type="data.goods_order.zone"/>
      <sales-log v-else-if="activeName.value === 'sales' && dialogVisible" :id="search.order_id" :data="data"/>
      <return-log v-else-if="activeName.value === 'return' && dialogVisible" :id="search.order_id"/>
      <interest-log v-else-if="activeName.value === 'interest' && dialogVisible" :id="search.order_id"/>
      <release-log v-else-if="activeName.value === 'release' && dialogVisible" :id="search.order_id"/>
    </el-dialog>

    <!-- 设置利率 -->
    <interest
      v-if="interestVisible"
      ref="interest"
      @refreshList="getList()"
    />

  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { equipmentList } from '@/api/order'
import { catesOptions } from '@/utils/explain'
import { BigNumber } from 'bignumber.js'
import MinerLog from './MinerLog'
import InterestLog from './InterestLog'
import SalesLog from './SalesLog'
import ReturnLog from './ReturnLog'
import ReleaseLog from './ReleaseLog'
import Interest from './Interest'

export default {
  name: 'dasda',
  components: { Pagination, MinerLog, InterestLog, SalesLog, ReturnLog, ReleaseLog, Interest },
  data() {
    return {
      loading: false,
      catesOptions,
      tableLoading: false,
      downloadLoading: false,
      dialogVisible: false,
      interestVisible: false,
      activeName: {},
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: [],
      search: {
        order_id: 0
      },
      data: {
        recovery: 0,
        recovery_num: 0,
        total_price: 1,
        num: 0,
        status: 0,
        goods_order: {
          spec_num: 0,
          extend: {
            cate: ''
          },
          period: {
            name: '',
            specs: {
              name: ''
            }
          },
          zone: ''
        },
        assets: {
            // 收益总数
            total_ming: 0,
            // 可用
            available: 0,
            // 锁仓
            lock: 0,
            // 冻结
            frozen: 0,
            // 抵押
            pawn: 0,
            // 封装数量
            fz_num: 0,
            // 使用质押数量
            use_pledge: 0,
            // 使用gas数量
            use_gas: 0,
            // 总借贷抵押
            pledge: 0,
            // 总借贷gas
            gas: 0,
            // 已归还抵押
            return_pledge: 0,
            // 已归还gas
            return_gas: 0,
            // 累计欠款利息
            interest: 0,
            // 利率
            interest_rate: 0
        }
      },
      typeTabOptions: [
        { label: '收益流水', value: 'miner' },
        { label: '奖励流水', value: 'sales' },
        { label: '归还流水', value: 'return' },
        { label: '归还流水明细', value: 'interest' },
        { label: '释放流水', value: 'release' }
      ],
      loading: false,
      visible: false
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.search.order_id = row.id
      this.getList()
    },
    getList() {
      this.loading = true
      equipmentList(this.search)
        .then(response => {
          this.data = response.data
          this.loading = false
        })
        .catch()
    },
    multipliedByNum(num1, num2) {
      return new BigNumber(num1).multipliedBy(num2)
    },
    dividedByNum(num1, num2) {
      return new BigNumber(num1).dividedBy(num2)
    },
    minusNum(num1, num2) {
      return new BigNumber(num1).minus(num2)
    },
    onClose() {
      this.$reset('data', false)
    },
    onFlowing(value) {
      this.activeName = this.typeTabOptions.find(v => {
        return v.value === value
      })
      this.dialogVisible = true
    },
    onSetInterest(data) {
      this.interestVisible = true
      this.$nextTick(() => {
        this.$refs.interest && this.$refs.interest.init(Object.assign({}, data, { order_id: this.search.order_id }))
      })
    }
  }
}
</script>