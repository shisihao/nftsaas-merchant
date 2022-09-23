<template>
  <div>
    <ul v-if="index === 1" class="app1">
      <li v-for="(value, colorIndex) in templateList1" :key="colorIndex">
        <div class="phone-section">
          <el-image class="phone-box" :src="phoneBox" />
          <div class="phone-tabbar">
            <section :style="`color: ${colorIndex === 0 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_home" />
              首页
            </section>
            <section :style="`color: ${colorIndex === 1 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_cangpin" />
              藏品
            </section>
            <section :style="`color: ${colorIndex === 2 ? color : defaultColor}`">
              <div class="iconfont icon-tab_icon_mine" />
              我的
            </section>
          </div>
          <div class="phone-content">
            <img :src="value" alt="">
            <div v-if="colorIndex === 0" class="one">
              <i class="tab-underline" :style="`background: ${colorIndex === 0 ? color : defaultColor}`" />
              <div class="icon-wrap">
                <i class="iconfont icon-home_icon_xiaoxi" :style="`color: ${colorIndex === 0 ? color : defaultColor}`" />
              </div>
              <i class="underline" :style="`background: ${colorIndex === 0 ? color : defaultColor}`" />
            </div>
            <div v-if="colorIndex === 1" class="two">
              <i class="underline" :style="`background: ${colorIndex === 1 ? color : defaultColor}`" />
              <div class="time iconfont icon-icon_time" :style="`color: ${colorIndex === 1 ? color : defaultColor}`"> 时间</div>
              <i class="iconfont icon-number" :style="`color: ${colorIndex === 1 ? color : defaultColor}`" />
              <i class="iconfont icon-number" :style="`color: ${colorIndex === 1 ? color : defaultColor}`" />
            </div>
            <div v-if="colorIndex === 2" class="three">
              <i class="iconfont icon-commom_icon_copy" :style="`color: ${colorIndex === 2 ? color : defaultColor}`" />
              <div class="bg-wrap">
                <div class="bg1" :style="`background: ${colorIndex === 2 ? color : defaultColor}`">
                  <img src="@/assets/images/app1/desgin_03mine_jifen (1).png" alt="">
                </div>
                <div class="bg2" :style="`background: ${colorIndex === 2 ? color : defaultColor}`">
                  <img src="@/assets/images/app1/desgin_03mine_jifen (2).png" alt="">
                </div>
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
import '@/assets/images/app1/icon2/iconfont.css'

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
      templateList1: [require('@/assets/images/app1/design-01home.png'), require('@/assets/images/app1/design-02cangpin.png'), require('@/assets/images/app1/design-03mine.png')],
      activeName: 'first'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>
<style lang="scss" scoped>
ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
	display: flex;
	justify-content: center;
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
				.one {
					.tab-underline {
						position: absolute;
						font-style: normal;
						top: 110px;
						left: 75px;
						width: 8px;
						height: 2px;
					}
					.icon-wrap {
						position: absolute;
						background: #dde5f3;
						border-radius: 50%;
						width: 20px;
						height: 20px;
						left: 10px;
						top: 125px;
						.icon-home_icon_xiaoxi {
							font-size: 12px;
							position: absolute;
							left: 50%;
							top: 50%;
							transform: translate(-50%, -50%);
						}
					}
					.underline {
						position: absolute;
						font-style: normal;
						top: 176px;
						left: 21px;
						width: 13px;
						height: 2px;
					}
				}
				.two {
					.underline {
						position: absolute;
						font-style: normal;
						top: 110px;
						left: 20px;
						width: 10px;
						height: 2px;
					}
					.time {
						display: inline-block;
						position: absolute;
						font-size: 12px;
						transform: scale(0.7);
						top: 120px;
						right: 5px;
					}
					.icon-number {
						position: absolute;
						top: 234px;
						left: 8px;
						font-size: 12px;
						transform: scale(0.8);
						&:nth-child(4) {
							left: 91px;
						}
					}
				}
				.three {
					.icon-commom_icon_copy {
						position: absolute;
						font-size: 12px;
						top: 103px;
						transform: scale(0.6);
						right: 5px;
					}
					.bg-wrap {
						display: flex;
						justify-content: space-between;
						position: absolute;
						left:7px;
            right: 7px;
						top: 126px;
						.bg1,
						.bg2 {
							width: 48%;
              border-radius: 4px;
              img{
                display: block;
              }
						}
					}
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
			background-color: #2a405c;
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
					color: #8397ac;
				}
			}
		}
	}
}
</style>
