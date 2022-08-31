import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/orders', {
    params
  })
}

// 导出订单
export function exportOrder(params) {
  return request.get('/orders/export/order', {
    params
  })
}

// 导入订单
export function importOrder(data) {
  return request.post(`/orders/import`, {
    ...data
  })
}

// 补发借贷
export function setBorrow(data) {
  return request.post(`/orders/borrow`, {
    ...data
  })
}

// 校验订单奖励扣除
export function getOrdersCheck(id) {
  return request.patch(`/orders/${id}/check`)
}

// 获取订单统计列表
export function getOrderCount() {
  return request.get('/orders/count')
}

// 设置矿机订单为工作
export function putComplete(id) {
  return request.patch(`/orders/${id}/complete`)
}

// 确认订单
export function subOrder(id) {
  return request.patch(`/orders/${id}/confirm`)
}

// 关闭订单
export function closeOrder({ id, reason }) {
  return request.patch(`/orders/${id}/close`, {
    reason
  })
}

// 设置订单期数
export function putFilLevel(data) {
  return request.post(`/orders/update/period`, {
    ...data
  })
}

// 矿机电费包列表
export function electricsList(id, params) {
  return request.get(`/orders/${id}/electrics`, {
    params
  })
}

// 确认电费包订单
export function subElectric(id) {
  return request.patch(`/orders/electric/${id}/confirm/`)
}

// 关闭电费包订单
export function closeElectric({ id, reason }) {
  return request.patch(`/orders/electric/${id}/close`, {
    reason
  })
}

// 订单设备详情
export function equipmentList(params) {
  return request.get(`/orders/equipment`, {
    params
  })
}

// 工作流水
export function minerList(params) {
  return request.get(`/orders/miner_log`, {
    params
  })
}

// 导出工作流水
export function minerExportOrder(params) {
  return request.get(`/orders/export/miner_log`, {
    params
  })
}

// 奖励流水
export function salesList(params) {
  return request.get(`/orders/sales_log`, {
    params
  })
}

// 导出奖励流水
export function salesExportOrder(params) {
  return request.get(`/orders/export/sales_log`, {
    params
  })
}

// 利息流水
export function interestList(params) {
  return request.get(`/orders/interest_log`, {
    params
  })
}

// 导出利息励流水
export function interestExportOrder(params) {
  return request.get(`/orders/export/interest_log`, {
    params
  })
}

// 归还流水
export function returnList(params) {
  return request.get(`/orders/return_log`, {
    params
  })
}

// 导出归还流水
export function returnExportOrder(params) {
  return request.get(`/orders/export/return_log`, {
    params
  })
}

// 列表
export function releaseLogList(params) {
  return request.get(`/orders/release_log`, {
    params
  })
}

// 利率设置
export function setInterest({ id, interest_rate }) {
  return request.patch(`/orders/${id}/interest_rate`, {
    interest_rate
  })
}
