<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/orders?status=1')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单待审核
          </div>
          <count-to :start-val="0" :end-val="common.order" :duration="2000" :class="common.order > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/coinWithdrawals?status=0')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            提资产待审核
          </div>
          <count-to :start-val="0" :end-val="common.withdrawal" :duration="2000" :class="common.withdrawal > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/withdrawals?status=0')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            提现待审核
          </div>
          <count-to :start-val="0" :end-val="common.cnyWithdrawal" :duration="2000" :class="common.cnyWithdrawal > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/electrics?status=1')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            电费待审核
          </div>
          <count-to :start-val="0" :end-val="common.electric" :duration="2000" :class="common.electric > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/certifications?status=0')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            认证待审核
          </div>
          <count-to :start-val="0" :end-val="common.certification" :duration="2000" :class="common.certification > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/transfers?status=0')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            转账待审核
          </div>
          <count-to :start-val="0" :end-val="common.transfer" :duration="2000" :class="common.transfer > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/feedbacks?status=0')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            反馈未解决
          </div>
          <count-to :start-val="0" :end-val="common.feedback" :duration="2000" :class="common.feedback > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :span="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/aheads')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日提前归还  
          </div>
          <count-to :start-val="0" :end-val="common.todayAheadReturn" :duration="2000" :class="common.todayAheadReturn > 0 ? 'card-panel-warning' : ''" class="card-panel-num" />
        </div>
      </div>
    </el-col> 
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    common: {
      type: Object,
      default: () => ({
        certification: 0,
        cnyWithdrawal: 0,
        electric: 0,
        feedback: 0,
        order: 0,
        transfer: 0,
        withdrawal: 0,
        todayAheadReturn: 0
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
    },
    handleSetLineChartData(path) {
      this.$router.push({ path: path })
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
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 4px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

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
      float: left;
      font-weight: bold;
      margin: 26px 20px;
      text-align: left;
      .card-panel-text {
        line-height: 18px;
        color: #262626;
        font-size: 14px;
        margin-bottom: 12px;
        font-weight: normal;
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

@media (max-width:550px) {

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
</style>
