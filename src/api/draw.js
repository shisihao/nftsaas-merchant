import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/activities', {
    params
  })
}

export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/activities'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除活动
export function deleteData(id) {
  return request.delete(`/activities/${id}`)
}

// 商品列表
export function activitiesList(params) {
  return request.get('/activities/goods/filter', {
    params
  })
}
export function openData(id) {
  return request.put(`/activities/open/${id}`)
}
//
export function openStatus(id) {
  return request.put(`/activities/open/status/${id}`)
}
