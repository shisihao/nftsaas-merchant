import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/entityOrders', {
    params
  })
}
// 物流公司列表
export function logisticsList(params) {
  return request.get('/public/logistics', {
    params
  })
}

// 发货
export function goDelivery(data) {
  return request.post('/entityOrders/delivery', {
    ...data
  })
}

// 关闭订单
export function closeDelivery({ id, ...data }) {
  return request.patch(`/entityOrders/${id}/close`, {
    ...data
  })
}

// 导出
export function exportExcel(params) {
  return request.get('/entityOrders/export', {
    params
  })
}

// 批量发货
export function batchDeliver(data) {
  return request.post('/entityOrders/batch_deliver', {
    ...data
  })
}

