import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/transfer', {
    params
  })
}

// 审核通过
export function statusPass(id) {
  return request.put(`/transfer/${id}/confirm`)
}

// 审核驳回
export function statusReject(id, reason) {
  return request.put(`/transfer/${id}/reject`,{
    reason
  })
}