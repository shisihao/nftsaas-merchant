import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/feedback', {
    params
  })
}

// 往期回复内容
export function detailList(id, params) {
  return request.get(`/feedback/${id}/detail`, {
    params
  })
}

// 回复
export function setReply({ id, ...data }) {
  return request.post(`/feedback/${id}/reply`, {
    ...data
  })
}

// 反馈确认
export function setSolve(id) {
  return request.patch(`/feedback/${id}/solve`)
}

// 标签列表
export function tagList(params) {
  return request.get('/tag', {
    params
  })
}

// 添加 / 修改 `标签`
export function addOrUpdateTag({ id, ...data }) {
  let method = 'POST'
  let url = '/tag'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除  `标签`
export function deleteDataTag(id) {
  return request.delete(`/tag/${id}`)
}
