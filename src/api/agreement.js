import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/agreement', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/agreement'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/agreement/${id}`)
}

// 协议库列表
export function dataLibraryList(params) {
  return request.get('/public/agreement/library', {
    params
  })
}

// 无权限限制 获取`协议`
export function powerAgreementList(params) {
  return request.get('/agreement/filter', {
    params
  })
}
