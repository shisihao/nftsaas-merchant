<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <order-chart :order="statistics.order" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <users-chart />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrderChart from './components/OrderChart'
import UsersChart from './components/UsersChart'

export default {
  name: 'OrderItem',
  components: {
    OrderChart,
    UsersChart
  },
  props: {
    statistics: {
      type: Object,
      default: () => ({
        order: {
          yesterday: 0,
          total: 0
        }
      })
    }
  },
  data() {
    return {
      orderTotal: 0,
      search: {
        status: ''
      }
    }
  },
  watch: {
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 80px;
      padding-top: 10px;
      padding-left: 15px;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      color: #333;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      .card-panel-description {
        font-weight: bold;
        margin: 10px 10px 10px 0;
        .card-panel-text {
            line-height: 18px;
            color: rgba(0, 0, 0, 0.8);
            font-size: 14px;
            margin-bottom: 12px;
        }
        .card-panel-num {
            font-size: 20px;
        }
      }
    }
  }
  .card-panel-text{
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }
  .fl {
    float: right;
    margin-right: 20px;
    color: #1890ff;
  }
</style>
