import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/consignment_price', {
    params
  })
}

// 基准价记录
export function consignmentPriceList(params) {
  return request.get('/consignment_price/logs', {
    params
  })
}

// 修改
export function putData(data) {
  return request.put(`/consignment_price/update`, {
    ...data
  })
}
