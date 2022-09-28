import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/refund', {
    params
  })
}

// `通过/驳回`
export function statusWithdraw(data) {
  return request.post(`/refund`, {
    ...data
  })
}
