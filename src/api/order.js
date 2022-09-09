import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/order', {
    params
  })
}

// 导出订单
export function exportOrder(params) {
  return request.get('/order/export', {
    params
  })
}

// 关闭订单
export function closeOrder({ id, reason }) {
  return request.patch(`/order/${id}/close`, {
    reason
  })
}

// 退款
export function getOrdersRefund(id) {
  return request.patch(`/order/${id}/refund`)
}

// 发起积分交易
export function getOrdersIntegral(id) {
  return request.patch(`/order/${id}/integral_transfer`)
}

// 发起藏品交易
export function getOrdersSafe(id) {
  return request.patch(`/order/${id}/safe_transfer`)
}

// 待发放
export function getOrdersIssued(id) {
  return request.patch(`/order/${id}/send`)
}
