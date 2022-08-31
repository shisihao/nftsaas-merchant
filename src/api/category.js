import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/category', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/category'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/category/${id}`)
}

// 设置商品分类排序
export function sortCategory({ id, data }) {
  return request.patch(`/category/${id}/sort`, {
    ...data
  })
}

// 分类列表
export function powerCategoryList(params) {
  return request.get('/category/filter', {
    params
  })
}
