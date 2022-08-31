import request from '@/utils/request'

// 矿机电费包列表
export function dataList(params) {
  return request.get(`/electric-recharges`, {
    params
  })
}

// 确认电费包订单
export function statusPass(id) {
  return request.put(`/electric-recharges/${id}/pass`)
}

// 关闭电费包订单
export function statusReject({ id, reason }) {
  return request.put(`/electric-recharges/${id}/reject`, {
    reason
  })
}

// 导出电费订单
export function exportOrder(params) {
  return request.get('/electric-recharges/export/electric_order', {
    params
  })
}
