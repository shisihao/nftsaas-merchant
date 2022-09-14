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

// 盲盒空投记录
export function airdropLogs(params) {
  return request.get('/box/airdrop/log', {
    params
  })
}

// 盲盒空投失败记录
export function failedLogs(params) {
  return request.get('/box/failed/log', {
    params
  })
}

// 盲盒导出失败空投记录
export function exportOrder(params) {
  return request.get('/box/export/log', {
    params
  })
}
