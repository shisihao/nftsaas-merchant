<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <sales-chart />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import SalesChart from './components/SalesChart'
export default {
  components: {
    SalesChart
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.panel-box {
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-boder {
    border: 0px;
    .el-card__header > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 28px;
      .card-header-left {
        font-size: 14px;
      }
      .card-header-left {
        font-size: 14px;
        .el-select {
          width: 100px;
        }
      }
    }
    .card-total {
      margin-top: 34px;
      margin-bottom: 34px;
      b {
        display: block;
        color: #409EFF;
        font-size: 24px;
        margin-bottom: 6px;
        font-weight: normal;
      }
      &>div {
        font-size: 14px;
      }
    }
  }
  .card-boder-sale {
    ::v-deep .el-card__body {
      padding: 0;
    }
  }
}

.card-sale {
  display: flex;
  flex-wrap: wrap;
  section {
    box-sizing: border-box;
    padding: 20px;
    width: 50%;
    position: relative;
    &>div {
      margin-top: 10px;
    }
    &>div:nth-child(1) {
      margin-top: 0;
    }
    &::before {
      content: '';
      width: calc(100% - 40px);
      height: 1px;
      position: absolute;
      left: 20px;
      bottom: 0;
      background-color: #DCDFE6;
    }
    &:after {
      content: '';
      width: 1px;
      height: calc(100% - 40px);
      position: absolute;
      right: 0;
      top: 20px;
      background-color: #DCDFE6;
    }
    &:nth-last-child(-n+2)::before {
      background-color: transparent;
    }
    &:nth-child(2n)::after {
      background-color: transparent;
    }
    .sale-header {
      font-size: 18px;
    }
    .sale-content {
      font-size: 14px;
      span {
        font-size: 24px;
        vertical-align: sub;
      }
    }
  }
}

@media (min-width: 768px) {
}
</style>
