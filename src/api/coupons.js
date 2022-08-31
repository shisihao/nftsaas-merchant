import request from '@/utils/request'

// 优惠券列表
export function dataList(params) {
  return request.get(`/coupons`, {
    params
  })
}

// 删除优惠券
export function deleteData(id) {
  return request.delete(`/coupons/${id}`)
}
