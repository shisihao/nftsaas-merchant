import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/wallets/logs', {
    params
  })
}

// 导出订单
export function exportOrder(params) {
  return request.get('/wallets/export/recharge', {
    params
  })
}
