import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/roles', {
    params
  })
}

// 详情
export function roleItem(id) {
  return request.get(`/roles/${id}`)
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/roles'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/roles/${id}`)
}

