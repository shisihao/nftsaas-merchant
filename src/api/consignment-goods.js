import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/consignment_goods', {
    params
  })
}

// 修改
export function putData(id, data) {
  return request.put(`/consignment_goods/${id}`, {
    ...data
  })
}
