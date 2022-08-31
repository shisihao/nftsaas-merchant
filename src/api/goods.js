import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/goods', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/goods'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/goods/${id}`)
}

// 设置商品排序
export function sortGoods({ id, data }) {
  return request.patch(`/goods/${id}/sort`, {
    ...data
  })
}

// 列表
export function powerGoodsList(params) {
  return request.get('/goods/filter', {
    params
  })
}
