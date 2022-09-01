import request from '@/utils/request'

// 专区列表
export function dataList(params) {
  return request.get('/issuers', {
    params
  })
}
// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/issuers'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 开关
export function patchIssuer(id, data) {
  return request.patch(`/issuers/${id}/hide`, {
    ...data
  })
}

// 删除
export function deleteIssuer(id) {
  return request.delete(`/issuers/${id}`)
}

// 发行方专区列表
export function dataIssuersList() {
  return request.get('/issuers/filter')
}
