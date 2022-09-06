<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- <tips-item /> -->
      <panel-group :common="data" @resetData="init()" />
      <history-item :statistics="data" />
      <order-item :statistics="data" />
      <assets-item :asset="data.asset" :statistics="data.statistics" />
    </div>
  </div>
</template>

<script>

import HistoryItem from './components/HistoryItem'
import OrderItem from './components/OrderItem'
import AssetsItem from './components/AssetsItem'
// import TipsItem from './components/TipsItem'
import PanelGroup from './components/PanelGroup'
import { getHome, putFirst } from '@/api/common'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import { addClass, removeClass } from '@/utils'
import { getToken, removeToken } from '@/utils/auth'

export default {
  name: 'Dashboard',
  components: {
    HistoryItem,
    OrderItem,
    AssetsItem,
    PanelGroup
  },
  data() {
    return {
      driver: null,
      data: {
        uv: {
          day: 0,
          month: 0
        },
        maintenance_fee: {
        },
        order: {
          total: 0,
          yesterday: 0
        },
        user: {
          total: 0,
          total_buy: 0,
          yesterday: 0,
          yesterday_buy: 0
        },
        sale: {
          cny: {
            yesterday: 0,
            total: 0
          },
          integral: {
            total: 0,
            yesterday: 0
          }
        },
        collect: {
          on: 0,
          off: 0,
          sell_out: 0,
          total: 0
        },
        box: {
          on: 0,
          off: 0,
          sell_out: 0,
          total: 0
        },

        integral: {
          income: 0,
          balance: 0.00,
          expend: 0.00
        }
      }
    }
  },
  created() {
    this.init()
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
      // this.getHomeOrder()
    },
    getList() {
      getHome()
        .then(response => {
          this.data = response.data
        })
    }
    // getHomeOrder() {
    //   getHomeOrderCount().then(response => {

    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  min-height: inherit;
  background-color: #F0F2F5;
}
</style>
