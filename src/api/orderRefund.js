import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/orderRefund', {
    params
  })
}

// 退货审核
export function refundAudit(data) {
  return request.post('/orderRefund/audit', {
    ...data
  })
}

// 退货完成，确认收货
export function refundSuccess(data) {
  return request.post('/orderRefund/success', {
    ...data
  })
}
