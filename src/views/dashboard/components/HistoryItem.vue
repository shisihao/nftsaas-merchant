<template>
  <el-row :gutter="20" class="panel-box">
    <el-col :xs="24" :span="12" class="card-panel-col">
      <el-row :gutter="20" class="panel-group">
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              昨日新增用户（人）
            </div>
            <div class="user-num">
              {{ statistics.user.yesterday_increase }}
            </div>
            <div class="user-text">
              其中消费用户数量 <span>{{ statistics.spend_user.yesterday_increase }}</span>
            </div>
            <el-divider />
            <div class="user-title">
              累计用户数量（人）
            </div>
            <div class="user-num">
              {{ statistics.user.total }}
            </div>
            <div class="user-text">
              其中消费用户数量 <span>{{ statistics.spend_user.total }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              昨日新增订单
            </div>
            <div class="user-num">
              <span>{{ statistics.order.yesterday_increase }}</span>
            </div>
            <div class="user-text">
              设备订单数量 <span>{{ statistics.miner_order.yesterday_increase }}</span>
            </div>
            <el-divider />
            <div class="user-title">
              累计订单数量
            </div>
            <div class="user-num">
              {{ statistics.order.total }}
            </div>
            <div class="user-text">
              其中设备订单数量 <span>{{ statistics.miner_order.total }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :xs="24" :span="12" class="card-panel-col">
      <el-row :gutter="20" class="panel-group">
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              昨日销售现金金额（元）
            </div>
            <div class="user-num">
              <b>{{ statistics.sale_cny.yesterday_increase | moneyToFormat }}</b>
            </div>
            <div class="user-text">
              设备订单现金金额 <span>{{ statistics.miner_sale_cny.yesterday_increase | moneyToFormat }}</span>
            </div>
            <el-divider />
            <div class="user-title">
              累计销售现金金额（元）
            </div>
            <div class="user-num">
              {{ statistics.sale_cny.total | moneyToFormat }}
            </div>
            <div class="user-text">
              设备订单现金金额 <span>{{ statistics.miner_sale_cny.total | moneyToFormat }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              昨日销售USDT金额（U）
            </div>
            <div class="user-num">
              <b>{{ statistics.sale_usdt.yesterday_increase | cutZero }}</b>
            </div>
            <div class="user-text">
              设备订单USDT金额 <span>{{ statistics.miner_sale_usdt.yesterday_increase | cutZero }}</span>
            </div>
            <el-divider />
            <div class="user-title">
              累计销售USDT金额（U）
            </div>
            <div class="user-num">
              {{ statistics.sale_usdt.total | cutZero }}
            </div>
            <div class="user-text">
              设备订单USDT金额 <span>{{ statistics.miner_sale_usdt.total | cutZero }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    statistics: {
      type: Object,
      default: () => ({
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
        }
      })
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    init() {
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel-col {
  margin-bottom: 20px;
}
.card-boder {
  border: 0px;
  .el-divider {
    margin: 20px 0;
  }
  .user-title {
    font-size: 14px;
  }
  .user-num {
    font-size: 30px;
    margin: 16px 0;
    span {
      color: #e6a23c;
    }
    b {
      color: #f56c6c;
      font-weight: normal;
    }
  }
  .user-text {
    font-size: 14px;
    color: #8C8C8C;
    span {
      color: #000;
    }
  }
}

@media (min-width: 768px) {
}
</style>
