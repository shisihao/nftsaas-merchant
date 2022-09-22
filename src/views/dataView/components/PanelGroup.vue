<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="24" :md="19">
        <el-row :gutter="20">
          <el-col :sm="12" :xs="24" :md="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-description">
                <div class="card-panel-text"> 本月销售额（元） </div>
                <count-to :start-val="0" :end-val="+common.sale.cny.curr_month" :duration="2000" :class="common.order > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
                <div class="card-panel-desc">累计销售额 {{ common.sale.cny.total }}</div>
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :xs="24" :md="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-description">
                <div class="card-panel-text"> 上月销售额（元） </div>
                <count-to :start-val="0" :end-val="+common.sale.cny.last_month" :duration="2000" :class="common.withdrawal > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :xs="24" :md="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月平均峰值 UV
                  <el-popover placement="bottom" width="180" trigger="hover" content="月平均峰值UV1000以下无需缴纳补充费用">
                    <i slot="reference" class="el-icon-question" />
                  </el-popover>
                </div>
                <count-to :start-val="0" :end-val="+common.uv.month" :duration="2000" class="card-panel-num" />
                <div class="card-panel-desc">当前峰值UV {{ common.uv.day || 0 }}</div>
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :xs="24" :md="6" class="card-panel-col">
            <div class="card-panel">
              <div v-if="common.maintenance_fee.curr_month" class="card-panel-description">
                <div class="card-panel-text">
                  本月运维费用预计
                </div>
                <count-to :start-val="0" :end-val="+common.maintenance_fee.curr_month.pay_price" :duration="2000" class="card-panel-num" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :md="5">
        <el-row :gutter="20">
          <el-col :sm="12" :xs="24" :md="24" class="card-panel-col last-card-panel">
            <div class="card-panel">
              <div class="card-panel-description">
                <div class="card-panel-text">
                  上月运维费用（元）
                  <span class="payment" @click="$router.push('/operationsOrder')">缴费记录</span>
                </div>
                <count-to :start-val="0" :end-val="common.maintenance_fee.last_month ? common.maintenance_fee.last_month.pay_price : 0" :duration="2000" class="card-panel-num" />
                <div v-if="common.maintenance_fee.last_month">
                  <el-button v-if="common.maintenance_fee.last_month.status === 0" plain type="info" @click="handleOprate">立即缴纳</el-button>
                  <el-button v-if="common.maintenance_fee.last_month.status === 1" plain type="info">已缴纳</el-button>
                  <el-button v-if="common.maintenance_fee.last_month.status === 2" plain type="info">审核中</el-button>
                  <el-button v-if="common.maintenance_fee.last_month.status === 3" plain type="info">被驳回</el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <PayFee v-if="payVisible" ref="payFee" @refreshList="resetData" />
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import PayFee from '@/views/tenant/components/PayFee.vue'
export default {
  components: {
    CountTo,
    PayFee
  },
  props: {
    common: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      payVisible: false
    }
  },
  created() {},
  methods: {
    handleOprate() {
      this.payVisible = true
      this.$nextTick(() => {
        this.common.maintenance_fee.last_month.bank_info['pay_price'] = this.common.maintenance_fee.last_month.pay_price
        this.$refs.payFee && this.$refs.payFee.init(this.common.maintenance_fee.last_month.bank_info, 'oprate')
      })
    },
    resetData() {
      this.$emit('resetData')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
	.card-panel-col {
		margin-bottom: 20px;
	}
	.card-panel {
		min-height: 117px;
		// cursor: pointer;
		font-size: 12px;
		// position: relative;
		overflow: hidden;
		color: #666;
		background: #fff;
		box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.05);
		border-radius: 4px;

		.card-panel-icon-wrapper {
			float: left;
			margin: 14px 0 0 14px;
			padding: 16px;
			transition: all 0.38s ease-out;
			border-radius: 6px;
		}

		.card-panel-icon {
			float: left;
			font-size: 48px;
		}

		.card-panel-description {
			font-weight: bold;
			margin: 19px;
			text-align: left;
			.card-panel-text {
				line-height: 18px;
				color: #333;
				font-size: 14px;
				margin-bottom: 12px;
				// font-weight: normal;
			}

			.card-panel-num {
				font-size: 20px;
			}
			.card-panel-warning {
				color: red;
			}
		}
	}
}

@media (max-width: 550px) {
	.card-panel-icon-wrapper {
		float: none !important;
		width: 100%;
		height: 100%;
		margin: 0 !important;

		.svg-icon {
			display: block;
			margin: 14px auto !important;
			float: none !important;
		}
	}
}

.card-panel-desc {
	font-weight: normal;
	margin-top: 12px;
}
.el-icon-question {
	width: 10px;
	height: 10px;
	margin-left: 5px;
	cursor: pointer;
}
.last-card-panel {
	.card-panel-text {
		display: flex;
		justify-content: space-between;
		.payment {
			font-weight: normal;
			font-size: 12px;
			color: #333;
			text-decoration: underline;
			cursor: pointer;
			&:hover {
				color: #1f9fff;
			}
		}
	}
}
@media(min-width: 992px) and (max-width: 1200px) {
  .payment{
    display:none;
  }
}

</style>
