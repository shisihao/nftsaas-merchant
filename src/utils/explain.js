import store from '@/store'
const integral = store.getters.integral
const info = store.getters.info

const init_wallet = (array) => {
  return info.wallet_status === 0 ? array : [...array, { label: '云账号钱包', value: 'sandpay' }]
}

export const payOptions = init_wallet(
  [
    { label: '全部', value: '' },
    { label: integral, value: 'integral' },
    { label: '微信', value: 'wxpay' },
    { label: '支付宝', value: 'alipay' },
    // { label: '农行', value: 'abcpay' },
    // { label: '京东', value: 'jdpay' },
    { label: '银行卡快捷', value: 'bank' }
  ]
)

export const whetherOptions = [
  { label: '全部', value: '' },
  { label: '否', value: 0 },
  { label: '是', value: 1 }
]

export const orderTypeOptions = [
  { label: '全部', value: '' },
  { label: '藏品订单', value: 'goods', type: 'primary' },
  { label: '盲盒订单', value: 'box', type: 'warning' }
  /* { label: '铸造券订单', value: 'cast', type: 'success' } */
]

export const orderStatusOptions = [
  { label: '全部', value: '' },
  { label: '待付款', value: 0, type: 'warning' },
  { label: '待发放', value: 1, type: 'primary' },
  { label: '已完成', value: 2, type: 'success' },
  { label: '已关闭', value: 3, type: 'info' },
  { label: '已退款', value: 4, type: 'info' },
  { label: '异常订单', value: 5, type: 'danger' }
]

export const logOrderStatusOptions = [
  { label: '全部', value: -1 },
  { label: '待支付', value: 0 },
  { label: '待审核', value: 1 },
  { label: '已确认', value: 2 },
  { label: '已驳回', value: 3 }
]

export const payStatusOptions = [
  { label: '全部', value: '' },
  { label: '待付款', value: 0, type: 'primary' },
  { label: '已付款', value: 1, type: 'success' },
  { label: '已关闭', value: 2, type: 'info' }
]

export const electricsStatusOptions = [
  { label: '全部', value: '' },
  { label: '待支付', value: 0 },
  { label: '已支付', value: 1 },
  { label: '已使用', value: 2 },
  { label: '已过期', value: 4 },
  { label: '已取消', value: 5 }
]

export const powerTypeOptions = [
  { label: '全部', value: '' },
  { label: '不要电费', value: 0 },
  { label: '全年电费', value: 1 },
  { label: '全年显卡电费', value: 2 },
  { label: '沣枯转换', value: 3 }
]

export const catesOptions = [
  { label: '全部', value: '' },
  { label: '资本垫付', value: 0 },
  { label: '自付质押', value: 1 },
  { label: '满存算力', value: 2 }
]

export const levelCateOptions = [
  { label: '资本垫付', value: 0 },
  { label: '自出币', value: 1 }
]

export const examineStatusOptions = [
  { label: '全部', value: '', type: '' },
  { label: '待审核', value: 0, type: 'warning' },
  { label: '通过', value: 1, type: 'success' },
  { label: '驳回', value: 2, type: 'danger' }
]

export const payTypeOptions = [
  { label: '全部', value: '' },
  { label: integral, value: 'integral' }
]

export const typeOptions = [
  { label: '全部', value: '' },
  { label: '常规藏品', value: 0, type: 'primary' },
  { label: '盲盒藏品', value: 1, type: 'warning' },
  { label: '合成藏品', value: 3, type: 'success' },
  // { label: '专属藏品', value: 4, type: 'info' },
  { label: '资格券', value: 5, type: 'danger' },
  // { label: '兑换藏品', value: 6, type: 'danger' },
  { label: '活动藏品', value: 7, type: 'danger' }
]

export const statusOptions = [
  { label: '全部', value: '' },
  { label: '上架', value: 0 },
  { label: '下架', value: 1 }
]

export const activityTypeOptions = [
  { label: '指定藏品', value: 'goods', type: 'primary' },
  { label: '指定专区', value: 'issuer', type: 'warning' }
]

export const interestsGiveOptions = [
  { label: '长期', value: 'long' },
  { label: '一次性', value: 'once' }
]

export const interestsOptions = [
  { label: '一次性', value: 'once', type: 'warning' },
  { label: '长期', value: 'long', type: 'success' },
  { label: '指定藏品', value: 'appoint', type: 'primary' }
]

export const goodShowTypeOptions = [
  { label: '普通', value: 0, type: 'info' },
  { label: '3D', value: 1, type: 'primary' },
  { label: '视频', value: 2, type: 'warning' }
]

export const interestOptions = [
  { label: '优先购', value: 'prior' },
  { label: '转赠', value: 'give' },
  { label: `免${integral}`, value: 'free_integral' },
  { label: '零元购', value: 'free_cny' },
  { label: '折扣购', value: 'rebate' }
]

export const streamTypeOptions = [
  { label: '全部', value: '' },
  { label: '充值', value: 'recharge' },
  { label: '转账', value: 'transfer' },
  { label: '分红奖励', value: 'miner_bonus' },
  { label: '电费充值', value: 'electric_recharge' },
  { label: '收益分发', value: 'miner_release' },
  { label: '销售奖励', value: 'sales_commission' },
  { label: '团队销售奖励', value: 'team_sales_commission' },
  { label: '提资产', value: 'withdrawal' },
  { label: '提现', value: 'cny_withdrawal' },
  { label: '工作扣除电费', value: 'miner_electric' },
  { label: '其它(资产调整流水)', value: 'admin_assets' }
]

export const withdrawOptions = [
  {
    currency: [
      'fil',
      'eth',
      'usdt',
      'usdt_trx',
      'xch'
    ]
  },
  {
    to_address: [
      { type: 'fil', address: 'https://filfox.info/en/address/' },
      { type: 'eth', address: 'https://cn.etherscan.com/address/' },
      { type: 'usdt', address: 'https://cn.etherscan.com/address/' },
      { type: 'usdt_trx', address: 'https://trx.tokenview.com/cn/address/' },
      { type: 'xch', address: 'https://www.chiaexplorer.com/blockchain/address/' }
    ]
  },
  {
    hash: [
      { type: 'fil', hash: 'https://filfox.info/en/message/' },
      { type: 'eth', hash: 'https://cn.etherscan.com/tx/' },
      { type: 'usdt', hash: 'https://cn.etherscan.com/tx/' },
      { type: 'usdt_trx', hash: 'https://trx.tokenview.com/cn/tx/' },
      { type: 'xch', hash: 'https://www.chiaexplorer.com/blockchain/coin/' }
    ]
  }
]

export const pickerOptions = {
  shortcuts: [{
    text: '最近24小时',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}

export const shopCateOptions = [
  { label: '全部', value: '' },
  { label: '普通专区', value: 1, type: 'primary' },
  { label: '专属专区', value: 2, type: 'warning' },
  { label: '兑换专区', value: 3, type: 'success' }
]

export const shopTypeOptions = [
  { label: '全部', value: '' },
  { label: '常规', value: 'common', type: 'primary' },
  { label: '兑换', value: 'voucher', type: 'danger' }
  // { label: '商品劵', value: 'commodity', type: 'success' }
]

export const handleOptions = [
  { label: '待处理', value: 0, type: 'primary' },
  { label: '处理中', value: 1, type: 'warning' },
  { label: '退货成功', value: 2, type: 'success' },
  { label: '已拒绝', value: 3, type: 'danger' },
  { label: '已撤销', value: 4, type: 'info' }
]

export const shopStatusOptions = [
  { label: '全部', value: '' },
  { label: '待付款', value: 0, count: 'wait_count', type: 'warning' },
  { label: '待发货', value: 1, count: 'paid_count', type: 'primary' },
  { label: '已发货', value: 2, count: 'delivery_count', type: 'success' },
  { label: '已收货', value: 3, count: 'receipt_count', type: 'success' },
  { label: '售后中', value: 6, count: 'close_count', type: 'danger' },
  { label: '已完成', value: 4, count: 'success_count', type: 'info' },
  { label: '已关闭', value: 5, count: 'close_count', type: 'danger' }
]
