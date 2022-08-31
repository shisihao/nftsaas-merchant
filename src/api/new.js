import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/news', {
    params
  })
}

// 资讯库列表
export function dataLibraryList(params) {
  return request.get('/news/library', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/news'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/news/${id}`)
}

// 获取 `资讯评论列表`
export function getCommentsList(id, params) {
  return request.get(`news/${id}/comments`, {
    params
  })
}

// 删除 `资讯评论`
export function deleteComment(newId, commentId) {
  return request.delete(`news/${newId}/comments/${commentId}`)
}

// 置顶 `资讯`
export function setNewTop({id, ...data}) {
  return request.put(`news/top/${id}`, {
    ...data
  })
}

// 一键同步 `资讯`
export function setChecked(data) {
  return request.post('/news/batch/store', {
    ...data
  })
}

