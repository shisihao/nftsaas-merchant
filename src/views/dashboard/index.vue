<template>
  <div class="dashboard-container">
    <div class="app-container">

      <tips-item />
      
      <panel-group
        :common="data.common"
      />

      <history-item
        :statistics="data.statistics"
      />

      <assets-item
        :asset="data.asset"
        :statistics="data.statistics"
      />

      <wallet-item />

      <electric-item />

      <withdrawal-item />

      <copyright />

      <vip-tip
        v-if="vipTipVisible"
        ref="vipTip"
      />
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import HistoryItem from './components/HistoryItem'
import AssetsItem from './components/AssetsItem'
import WalletItem from './components/WalletItem'
import ElectricItem from './components/ElectricItem'
import WithdrawalItem from './components/WithdrawalItem'
import TipsItem from './components/TipsItem'
import Copyright from '@/components/Copyright'
import VipTip from '@/components/VipTip'
import { getHome, putFirst } from '@/api/common'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import { addClass, removeClass } from '@/utils'
import { getToken, removeToken } from '@/utils/auth'


export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    HistoryItem,
    AssetsItem,
    WalletItem,
    ElectricItem,
    WithdrawalItem,
    Copyright,
    VipTip,
    TipsItem
  },
  data() {
    return {
      driver: null,
      vipTipVisible: false,
      data: {
        common: {
          certification: 0,
          cnyWithdrawal: 0,
          electric: 0,
          feedback: 0,
          order: 0,
          transfer: 0,
          withdrawal: 0,
          todayAheadReturn: 0
        },
        statistics: {
          user: {
            total: 0,
            yesterday_increase: 0
          },
          spend_user: {
            total: 0,
            yesterday_increase: 0
          },
          order: {
            total: 0,
            yesterday_increase: 0
          },
          miner_order: {
            total: 0,
            yesterday_increase: 0
          },
          sale_cny: {
            total: 0,
            yesterday_increase: 0
          },
          miner_sale_cny: {
            total: 0,
            yesterday_increase: 0
          },
          sale_usdt: {
            total: 0,
            yesterday_increase: 0
          },
          miner_sale_usdt: {
            total: 0,
            yesterday_increase: 0
          },
          eth_miner: {
            total: 0,
            yesterday_increase: 0
          },
          fil_miner: {
            total: 0,
            yesterday_increase: 0
          },
          btc_miner: {
            total: 0,
            yesterday_increase: 0
          },
          xch_miner: {
            total: 0,
            yesterday_increase: 0
          }
        },
        asset: {
          btc: {
            total: 0,
            total_miner: 0
          },
          cny: {
            total: 0
          },
          dfb: {
            total: 0
          },
          eth: {
            total: 0,
            total_miner: 0
          },
          fil: {
            total: 0,
            frozen: 0,
            lock: 0,
            pawn: 0,
            withdrawable: 0,
            total_miner: 0
          },
          usdt: {
            total: 0
          },
          xch: {
            total: 0,
            total_miner: 0
          }
        }
      }
    }
  },
  created() {
    this.init()
    this.onVipTip()
  },
  mounted() {
    this.driver = new Driver({
      allowClose: false,
      stageBackground: 'rgba(255,255,255,0.2)',
      opacity: 0.5,
      padding: 5,
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      doneBtnText: '关闭',
      onReset: (Element) => {
        removeClass(document.querySelector('#app'), 'app-overflow')
        removeToken('is_first')
        putFirst()
      }
    })
    this.$nextTick(() => {
      setTimeout(() => {
        if (document.querySelector('#app .app') && getToken('is_first') === '1') {
          this.driver.defineSteps(steps)
          this.driver.start()
          addClass(document.querySelector('#app'), 'app-overflow')
        }
      }, 1000)
    })
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      getHome()
        .then(response => {
          this.data = response.data
        })
    },
    onVipTip() {
      this.vipTipVisible = true
      this.$nextTick(() => {
        this.$refs.vipTip && this.$refs.vipTip.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  min-height: inherit;
  background-color: #F0F2F5;
}
</style>
