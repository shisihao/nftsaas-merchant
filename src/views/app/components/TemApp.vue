<template>
  <div>
    <ul v-if="index === 1" class="app1">
      <li v-for="(value, index) in templateList1">
        <div class="phone-section">
          <el-image class="phone-box" :src="phoneBox" />
          <div class="phone-tabbar">
            <section :style="`color: ${index === 0 ? color : defaultColor}`">
              <div class="iconfont icon-icon_tab_home_pre" />
              首页
            </section>
            <section :style="`color: ${index === 1 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_kuangchi_pre" />
              区块
            </section>
            <section :style="`color: ${index === 2 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_shop_pre" />
              商城
            </section>
            <section :style="`color: ${index === 3 ? color : defaultColor}`">
              <div class="iconfont icon-icon_tab_zixun_pre" />
              资讯
            </section>
            <section :style="`color: ${index === 4 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_me_pre" />
              我的
            </section>
          </div>
          <div class="phone-content" :style="`background-color: ${color}`">
            <img :src="value" alt="">
            <div v-if="index === 0" :style="`color: ${color}`">
              <div class="iconfont icon-home_icon_news1 tem-add icon-message" />
              <div class="iconfont icon-home_icom_notice1 tem-add icon-notice" />
              <div class="tem-add tem-app-name">
                APP名称
              </div>
            </div>
            <div v-if="index === 2">
              <div class="tem-add tem-item" :style="`background-color: ${color}`">
                <span>独立满存算力</span>
              </div>
            </div>
            <div v-if="index === 3" :style="`color: ${color}`">
              <div class="iconfont icon-zixun_icon_more tem-add zixin-item" />
              <div class="tem-add zixin-after" :style="`background-color: ${color}`" />
              <div class="iconfont icon-zixun_icon_like tem-add zixin-good">
                <span>99</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <ul v-if="index === 2" class="app2">
      <li v-for="(value, index) in templateList2">
        <div class="phone-section">
          <el-image class="phone-box" :src="phoneBox" />
          <div class="phone-tabbar">
            <section :style="`color: ${index === 0 ? color : defaultColor}`">
              <div :class="`iconfont ${index === 0 ? 'icon-app2_tab_icon_home2_pre' : 'icon-app2_tab_icon_home2'}`" />
              首页
            </section>
            <section :style="`color: ${index === 1 ? color : defaultColor}`">
              <div :class="`iconfont ${index === 1 ? 'icon-app2_tab_icon_mall2_pre' : 'icon-app2_tab_icon_mall2'}`" />
              商城
            </section>
            <section :style="`color: ${index === 2 ? color : defaultColor}`">
              <div :class="`iconfont ${index === 2 ? 'icon-app2_tab_icon_wallet2_pre' : 'icon-app2_tab_icon_wallet2'}`" />
              钱包
            </section>
            <section :style="`color: ${index === 3 ? color : defaultColor}`">
              <div :class="`iconfont ${index === 3 ? 'icon-app2_tab_icon_nwes2_pre' : 'icon-app2_tab_icon_nwes2'}`" />
              资讯
            </section>
            <section :style="`color: ${index === 4 ? color : defaultColor}`">
              <div :class="`iconfont ${index === 4 ? 'icon-app2_tab_icon_mine2_pre' : 'icon-app2_tab_icon_mine'}`" />
              我的
            </section>
          </div>
          <div class="phone-content" :style="`background-color: ${color}`">
            <img :src="value" alt="">
          </div>
        </div>
      </li>
    </ul>
    <ul v-if="index === 3" class="app3">
      <li v-for="(value, index) in templateList3">
        <div class="phone-section">
          <el-image class="phone-box" :src="phoneBox" />
          <div class="phone-tabbar">
            <section :style="`color: ${index === 0 ? color : defaultColor}`">
              <div class="iconfont icon-app3_tab_icon_home" />
              首页
            </section>
            <section :style="`color: ${index === 1 ? color : defaultColor}`">
              <div class="iconfont icon-app3_tab_icon_shop" />
              商城
            </section>
            <section :style="`color: ${index === 2 ? color : defaultColor}`">
              <div class="iconfont icon-app3_tab_icon_news" />
              资讯
            </section>
            <section :style="`color: ${index === 3 ? color : defaultColor}`">
              <div class="iconfont icon-app3_tab_icon_mine" />
              我的
            </section>
          </div>
          <div class="phone-content" :style="`background-color: ${color}`">
            <img :src="value" alt="">
            <div v-if="index === 3" class="tem-fun" :style="`color: ${color}`">
              <div class="iconfont icon-app3_mine_icon_qb tem-add qb-item">
                <div class="tem-text">我的钱包</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_shebei tem-add qb-item">
                <div class="tem-text">我的设备</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_shichang tem-add qb-item">
                <div class="tem-text">我的市场</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_anquan tem-add qb-item">
                <div class="tem-text">账户安全</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_wenti tem-add qb-item">
                <div class="tem-text">常见问题</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_fankui tem-add qb-item">
                <div class="tem-text">意见反馈</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_kefu tem-add qb-item">
                <div class="tem-text">客服中心</div>
              </div>
              <div class="iconfont icon-app3_mine_icon_guanyu tem-add qb-item">
                <div class="tem-text">关于我们</div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import phoneBox from '@/assets/images/step2_phone_bg2.png'
import '@/assets/images/app1/icon/iconfont.css'
import '@/assets/images/app2/icon/iconfont.css'

export default {
  name: 'App1',
  props: {
    color: {
      type: String,
      default: '#409EFF'
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultColor: '#ccc',
      phoneBox,
      templateList1: [require('@/assets/images/app1/muban1_diy_home.png'), require('@/assets/images/app1/muban1_diy_pool.png'), require('@/assets/images/app1/muban1_diy_mall.png'), require('@/assets/images/app1/muban1_diy_news.png'), require('@/assets/images/app1/muban1_diy_mine.png')],
      templateList2: [require('@/assets/images/app2/muban1_diy_home.png'), require('@/assets/images/app2/muban1_diy_mall.png'), require('@/assets/images/app2/muban1_diy_wallte.png'), require('@/assets/images/app2/muban1_diy_zixun.png'), require('@/assets/images/app2/muban1_diy_mine.png')],
      templateList3: [require('@/assets/images/app3/muban1_diy_home.png'), require('@/assets/images/app3/muban1_diy_mall.png'), require('@/assets/images/app3/muban1_diy_zixun.png'), require('@/assets/images/app3/muban1_diy_mine.png')],
      activeName: 'first'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    li {
      flex-shrink: 0;
      width: 200px;
      margin-left: 20px;
      .phone-section {
        position: relative;
        .phone-box {
          position: relative;
          z-index: 1;
        }
        .phone-tabbar {
          position: absolute;
          z-index: 3;
          width: 174px;
          height: 40px;
          background-color: #fff;
          left: 50%;
          margin-left: -87px;
          bottom: 16px;
          overflow: hidden;
          border-bottom-left-radius: 17px;
          border-bottom-right-radius: 17px;
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          text-align: center;
          section {
            font-size: 12px;
            transform: scale(0.6);
            div {
              margin-bottom: 2px;
            }
          }
        }
        .phone-content {
          width: 174px;
          height: 374px;
          position: absolute;
          z-index: 2;
          left: 50%;
          margin-left: -87px;
          top: 13px;
          overflow-y: hidden;
          border-radius: 17px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .app1 {
    .tem-add {
      position: absolute;
      z-index: 3;
      font-size: 12px;
    }
    .icon-message {
      top: 26px;
      left: 154px;
    }
    .icon-notice {
      top: 156px;
      left: 10px;
    }
    .tem-app-name {
      top: 56px;
      left: 8px;
    }
    .tem-item {
      top: 79px;
      left: -13px;
      border-radius: 14px;
      transform: scale(0.56);
      span {
        display: inline-block;
        padding: 5px 8px;
        color: #fff;
      }
    }
    .zixin-item {
      top: 43px;
      right: 6px;
      transform: scale(0.6);
    }
    .zixin-after {
      top: 56px;
      left: 44px;
      width: 14px;
      height: 1px;
    }
    .zixin-good {
      top: 229px;
      left: 5px;
      transform: scale(0.65);
      span {
        display: inline-block;
        transform: scale(0.7);
      }
    }
  }
  ul.app3 {
    li .phone-section {
      .phone-tabbar {
        background-color: #2A405C;
      }
      .tem-fun {
        width: 120%;
        text-align: center;
        position: absolute;
        z-index: 3;
        font-size: 12px;
        top: 234px;
        left: -10%;
        display: flex;
        flex-wrap: wrap;
        transform: scale(0.75);
        .tem-add {
          width: 25%;
          margin-bottom: 4px;
          .tem-text {
            font-size: 12px;
            color: #8397AC;
          }
        }
      }
    }
  }
</style>
