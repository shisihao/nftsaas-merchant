import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/box', {
    params
  })
}

// 详情
export function details(id) {
  return request.get(`/box/${id}`)
}

// 创作者列表
export function authorList(params) {
  return request.get('box/author/list', {
    params
  })
}

// 创作者盲盒商品列表
export function goodsList(params) {
  return request.get('box/goods/list', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/box'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/box/${id}`)
}

// 盲盒上下架
export function setStatus(id, data) {
  return request.put(`/box/${id}/status`, {
    ...data
  })
}

// 盲盒空投
export function addAirdrops(data) {
  return request.post('/box/air_drop', {
    ...data
  })
}
