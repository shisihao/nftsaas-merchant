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
              {{ statistics.user.yesterday }}
            </div>
            <div class="user-text">
              其中消费用户数量 <span>{{ statistics.user.yesterday_buy }}</span>
            </div>
            <el-divider />
            <div class="user-title">
              累计用户数量（人）
            </div>
            <div class="user-num">
              {{ statistics.user.total }}
            </div>
            <div class="user-text">
              其中消费用户数量 <span>{{ statistics.user.total_buy }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              昨日销售额（元）
            </div>
            <div class="user-num">
              <span>{{ statistics.sale.cny.yesterday | moneyToFormat }}</span>
            </div>
            <div class="user-text">
              累计销售额 <span> {{ statistics.sale.cny.total | moneyToFormat }}</span>
            </div>
            <el-divider />
            <template v-if="integral_use">
              <div class="user-title">
                昨日销售{{ integral }}（个）
              </div>
              <div class="user-num">
                <span>{{ statistics.sale.integral.yesterday }}</span>
              </div>
              <div class="user-text">
                累计销售{{ integral }} <span> {{ statistics.sale.integral.total }}</span>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :xs="24" :span="12" class="card-panel-col">
      <el-row :gutter="20" class="panel-group">
        <el-col v-if="integral_use" :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <div class="user-title">
              用户剩余{{ integral }}数量（个）
            </div>
            <div class="user-num">
              <b>{{ statistics.integral.balance }}</b>
            </div>
            <div class="user-text" />
            <el-divider />
            <div class="user-title">
              支出(个)
            </div>
            <div class="user-num">
              <b>{{ statistics.integral.expend | cutZero }}</b>
            </div>
            <div class="user-text">
              用户{{ integral }}数量累计(个) <b>{{ statistics.integral.income }}</b>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="12">
          <el-card shadow="never" class="card-boder">
            <el-row>
              <el-col :xs="12" :span="12">
                <div class="user-title">
                  藏品上架
                </div>
                <div class="user-num">
                  <b>{{ statistics.collect.on }}</b>
                </div>
                <div class="user-text">
                  藏品下架 <span>{{ statistics.collect.off }}</span>
                </div>
                <el-divider />
                <div class="user-title">
                  藏品累计
                </div>
                <div class="user-num">
                  <b>{{ statistics.collect.total }}</b>
                </div>
                <div class="user-text">
                  藏品售罄<span> {{ statistics.collect.sell_out }}</span>
                </div>
              </el-col>
              <el-col :xs="12" :span="12">
                <div class="user-title">
                  盲盒上架
                </div>
                <div class="user-num">
                  <b>{{ statistics.box.on }}</b>
                </div>
                <div class="user-text">
                  盲盒下架 <span>{{ statistics.box.off }}</span>
                </div>
                <el-divider />
                <div class="user-title">
                  盲盒累计
                </div>
                <div class="user-num">
                  <b>{{ statistics.box.total }}</b>
                </div>
                <div class="user-text">
                  盲盒售罄<span> {{ statistics.box.sell_out }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    statistics: {
      type: Object,
      default: () => ({
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
            yesterday: 0,
            total: 0
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
          income: 0.00,
          balance: 0.00,
          expend: 0.00
        }
      })
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['integral', 'integral_use'])
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
  min-height: 280px!important;
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
    height: 16px;
    color: #8C8C8C;
    b {
      color: #f56c6c;
      font-weight: normal;
    }
    span {
      color: #000;
    }
  }
}

</style>
