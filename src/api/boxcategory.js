import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/boxcategory', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/boxcategory'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/boxcategory/${id}`)
}

// 设置商品分类排序
export function sortCategory({ id, data }) {
  return request.patch(`/boxcategory/${id}/sort`, {
    ...data
  })
}
