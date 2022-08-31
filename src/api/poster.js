import request from '@/utils/request'

// 获取 `分享海报`
export function dataList(params) {
  return request.get('poster', {
    params
  })
}

// 获取 `分享海报库`
export function dataLibraryList(params) {
  return request.get('/poster/template', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/poster'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/poster/${id}`)
}
