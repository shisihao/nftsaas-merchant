import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/consignment_order', {
    params
  })
}

// 导出
export function exportOrder(params) {
  return request.get('/consignment_order/export', {
    params
  })
}

// 买方服务商
export function filterPartner() {
  return request.get('/public/filter/partner')
}

// 专区
export function filterIssuer() {
  return request.get('/public/filter/issuer')
}
