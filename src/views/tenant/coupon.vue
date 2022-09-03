<template>
  <div class="app-container">
    <el-tabs v-model="search.status" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(v, i) in statusOptions" :key="i" :label="v.label" :name="v.value">
        <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
        <div v-else>
          <div v-for="item in list" :key="item.id" class="voucher-box">
            <div class="voucher" :class="item.status === 0 ? '' : 'voucher-disable'">
              <div class="left">
                <div>
                  ¥<span>{{ (item.amount || 0) | cutZero }}</span>
                </div>
                <div>
                  优惠券
                </div>
              </div>
              <div class="right">
                <div>
                  <div>{{ item.title }}</div>
                  <div>发放时间：{{ item.created_at }}</div>
                  <div>使用说明：当支付金额大于优惠券金额时，剩余金额不返还；每笔订单限用一张</div>
                </div>
                <div>
                  <el-button v-if="item.status === 0" type="primary" @click="onGoto(item)">去使用</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getCoupons } from '@/api/tenant'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Coupon',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      statusOptions: [
        { label: '未使用', value: '0' },
        { label: '已使用', value: '1' }
      ],
      search: {
        status: '0'
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      addOrUpdateVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      getCoupons({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick(tab, event) {
      this.getList()
    },
    onGoto(item) {
      this.$router.push({ path: '/tenants', query: { coupon_id: item.id, path: this.$route.path }})
    }
  }
}
</script>
<style lang="scss" scoped>
.voucher-box {
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 20px;
  .voucher {
    width: 700px;
    height: 100px;
    display: flex;
    .left {
      width: 20%;
      height: 100%;
      background-color: #E6A23C;
      position: relative;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      &::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 6px;
        right: 0;
        top: 0;
        background-image: radial-gradient(circle at right center, #F5F5F5 6px, #E6A23C 6px);
        background-size: 6px 20px;
      }
      & > div:nth-child(1) {
        span {
          font-size: 30px;
        }
      }
      & > div:nth-child(2) {
        margin-top: 2px;
      }
    }
    .right {
      height: 100%;
      flex: 1;
      display: flex;
      background-color: #F5F5F5;
      color: #999999;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      font-size: 12px;
      & > div:nth-child(1) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        & > div {
          margin-top: 6px;
          &:nth-child(1) {
            margin-top: 0;
            color: #303133;
            font-size: 16px;
          }
          &:last-child {
            max-height: 26px;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      & > div:nth-child(2) {
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  .voucher-disable {
    .left {
      background-color: #D8D8D8;
      &::after {
        background-image: radial-gradient(circle at right center, #F5F5F5 6px, #D8D8D8 6px);
      }
    }
  }
}
</style>
