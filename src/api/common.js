import request from '@/utils/request'

// 登录
export function login(data) {
  return request.post('/login',
    data
  )
}

// 校验是否绑定谷歌验证码
export function checkBind(data) {
  return request.post('/check_bind',
    data
  )
}

// 绑定谷歌验证码
export function setBind(data) {
  return request.post('/bind',
    data
  )
}

// 获取gt验证参数
export function getGt(params) {
  return request.get('/first_register',
    params
  )
}

// 改变是否第一次登录
export function putFirst(params) {
  return request.put('/check-first',
    params
  )
}

// 发送验证码
export function getCode(data) {
  return request.post('/verification-codes', {
    ...data
  })
}

/* export function logout() {
  return request.put('/logout')
} */

// 获取 菜单栏 Sidebar
export function getMenuNav() {
  return request.get('/nav')
}

// 首页数据
export function getHome() {
  return request.get('/home')
}

// 用户充币、提资产
export function getWallet(params) {
  return request.get('/home/wallet_logs', {
    params
  })
}

// 用户充币流水
export function getWalletLogs(params) {
  return request.get('/home/wallet_logs/recharge_list', {
    params
  })
}

// 用户充币流水导出
export function getWalletExport(params) {
  return request.get('/home/wallet_logs/recharge_export', {
    params
  })
}

// 用户资产流水
export function getWithdrawalLogs(params) {
  return request.get('/home/wallet_logs/withdrawal_list', {
    params
  })
}

// 用户资产流水导出
export function getWithdrawalExport(params) {
  return request.get('/home/wallet_logs/withdrawal_export', {
    params
  })
}

// 用户互转流水
export function getTransferLogs(params) {
  return request.get('/home/wallet_logs/transfer_list', {
    params
  })
}

// 用户互转流水导出
export function getTransferExport(params) {
  return request.get('/home/wallet_logs/transfer_export', {
    params
  })
}

// 用户电费
export function getElectric(params) {
  return request.get('/home/electric', {
    params
  })
}

// 用户电费流水
export function getElectricLogs(params) {
  return request.get('/home/electric/list', {
    params
  })
}

// 用户电费流水导出
export function getElectricExport(params) {
  return request.get('/home/electric/export', {
    params
  })
}

// 用户提现
export function getCnyWithdrawal(params) {
  return request.get('/home/cny_withdrawal', {
    params
  })
}

// 用户提现流水
export function getCnyWithdrawalLogs(params) {
  return request.get('/home/cny_withdrawal/list', {
    params
  })
}

// 用户提现流水导出
export function getCnyWithdrawalExport(params) {
  return request.get('/home/cny_withdrawal/export', {
    params
  })
}

// 分类列表
export function publicCategory(params) {
  return request.get('/public/category')
}

// 标签列表
export function tagList(params) {
  return request.get('/public/tag', {
    params
  })
}

// 盲盒分类列表
export function boxCategoryList(params) {
  return request.get('/public/box/category', {
    params
  })
}

// 身份列表
export function identityList(params) {
  return request.get('/public/identity')
}

// 订单数据
export function getHomeOrderCount(params) {
  return request.get('/home/order/count', {
    params
  })
}
// 订单报表
export function homeOrder(params) {
  return request.get('/home/order', {
    params
  })
}
// 销售报表
export function homeSales(params) {
  return request.get('/home/sales', {
    params
  })
}

// 用户报表
export function usersSales(params) {
  return request.get('/home/users', {
    params
  })
}

// 商品分类映射
export function goodsCategoryList(params) {
  return request.get('/public/goodsCategory/filter', {
    params
  })
}

// 运费模板列表
export function filterDelivery() {
  return request.get('public/filter/delivery')
}
