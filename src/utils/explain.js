export const zoneOptions = [
  { label: '全部', value: '' },
  { label: 'FIL', value: 'fil' },
  { label: 'ETH', value: 'eth' },
  { label: 'BTC', value: 'btc' },
  { label: 'XCH', value: 'xch' }
]

export const zoneSearchOptions = [
  { label: '全部', value: '' },
  { label: 'FIL', value: 'fil' },
  { label: 'ETH', value: 'eth' },
  { label: 'BTC', value: 'btc' },
  { label: 'XCH', value: 'xch' },
  { label: '限时优惠', value: 'discount' }
]

export const currencyOptions = [
  { label: '全部', value: '' },
  { label: 'FIL', value: 'fil' },
  { label: 'ETH', value: 'eth' },
  { label: 'BTC', value: 'btc' },
  { label: 'XCH', value: 'xch' },
  { label: 'USDT', value: 'usdt' }
]

export const currencyReportOptions = [
  { label: '全部', value: '' },
  { label: 'FIL', value: 'fil' },
  { label: 'BTC', value: 'btc' },
  { label: 'ETH', value: 'eth' },
  { label: 'XCH', value: 'xch' },
  { label: 'USDT', value: 'usdt' },
  { label: '电费', value: 'dfb' },
  { label: '现金', value: 'cny' }
]

export const payOptions = [
  { label: '全部', value: '' },
  { label: '银行卡', value: 'bank' },
  /* { label: '支付宝', value: 'alipay' },
  { label: '微信', value: 'wechat' }, */
  { label: 'USDT', value: 'usdt' }
]

export const whetherOptions = [
  { label: '全部', value: '' },
  { label: '否', value: 0 },
  { label: '是', value: 1 }
]

export const orderTypeOptions = [
  { label: '全部', value: '' },
  { label: '自购', value: 0 },
  { label: '导入', value: 1 }
]

export const orderStatusOptions = [
  { label: '全部', value: '' },
  { label: '待付款', value: 0 },
  { label: '已支付(待确认)', value: 1 },
  { label: '已确认(部署中)', value: 2 },
  { label: '工作中', value: 3 },
  { label: '欠电费', value: 4 },
  { label: '已关闭', value: 5 },
  { label: '工作已结束', value: 6 }
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
  { label: '藏豆', value: 'integral' },
  { label: '铸造券', value: 'cast' },
  { label: '兑换券', value: 'voucher' },
  { label: '商品券', value: 'commodity' }
]

export const typeOptions = [
  { label: '全部', value: '' },
  { label: '常规藏品', value: 0, type: 'primary' },
  { label: '盲盒藏品', value: 1, type: 'warning' },
  { label: '合成藏品', value: 3, type: 'success' },
  { label: '专属藏品', value: 4, type: 'info' },
  { label: '资格券', value: 5, type: 'danger' },
  { label: '兑换藏品', value: 6, type: 'danger' },
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
