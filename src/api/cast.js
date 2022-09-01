import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/goods/cast/list', {
    params
  })
}

// 详情
export function details(id) {
  return request.get(`/goods/cast/${id}`)
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/goods/cast'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/goods/cast/${id}`)
}

export function castList(params) {
  return request.get('/goods/cast/filter', {
    params
  })
}
