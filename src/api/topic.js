import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/topics', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/topics'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/topics/${id}`)
}

// 解除禁言
export function forbidCancel(id) {
  return request.put(`/${id}/forbid/cancel`)
}
