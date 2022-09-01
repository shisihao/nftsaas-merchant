import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/cny_withdrawals', {
    params
  })
}

// 审核通过
export function statusPass(id, data) {
  return request.put(`/cny_withdrawals/${id}/agree`, {
    ...data
  })
}

// 审核驳回
export function statusReject(id, reason) {
  return request.put(`/cny_withdrawals/${id}/reject`, {
    reason
  })
}
