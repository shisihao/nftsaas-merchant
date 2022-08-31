import request from '@/utils/request'

// 广告列表
export function dataList(params) {
  return request.get('/ads', {
    params
  })
}

// 广告列表
export function dataLibraryList(params) {
  return request.get('/ads/template', {
    params
  })
}

// 广告位列表
export function posList(params) {
  return request.get('/ads/pos', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/ads'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/ads/${id}`)
}
