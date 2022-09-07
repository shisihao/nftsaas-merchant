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

// 导出订单
export function exportOrder(params) {
  return request.get('/certifications/export', {
    params
  })
}

// 解除认证次数限制
export function relieve(data) {
  return request.post('/certifications/relieve', {
    ...data
  })
}
