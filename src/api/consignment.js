import request from '@/utils/request'

// 广告列表
export function dataList(params) {
  return request.get('/consignment', {
    params
  })
}

// 详情
export function detailList(id, params) {
  return request.get(`/consignment/${id}`, {
    params
  })
}

// 专区
export function filterIssuer() {
  return request.get('/public/filter/issuer')
}

// 寄售藏品下架
export function unsold(consignment) {
  return request.put(`/consignment/${consignment}/unsold`)
}
