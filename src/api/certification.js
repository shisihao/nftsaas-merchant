import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/certifications', {
    params
  })
}

// 审核通过
export function statusPass(id) {
  return request.put(`/certifications/${id}/pass`)
}

// 审核驳回
export function statusReject(id, reason) {
  return request.put(`/certifications/${id}/reject`, {
    reason
  })
}
