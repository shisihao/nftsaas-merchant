import request from '@/utils/request'

// 权限列表
export function dataList(params) {
  return request.get('/menus', {
    params
  })
}

// 权限详情
export function menuItem(id) {
  return request.get(`/menus/${id}`)
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/menus'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/menus/${id}`)
}
