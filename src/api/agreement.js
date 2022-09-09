import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/configs/privacy', {
    params
  })
}

export function addOrUpdate(data) {
  return request.put('/configs/privacy', {
    ...data
  })
}

// 删除
export function deleteData(id) {
  return request.delete(`/agreement/${id}`)
}

