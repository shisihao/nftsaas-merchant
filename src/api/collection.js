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

// 详情
export function goodsItem(id) {
  return request.get(`/goods/${id}`)
}

// 删除
export function deleteGoodsItem(id) {
  return request.delete(`/goods/${id}`)
}

// 商品上下架
export function setStatus(id, data) {
  return request.put(`/goods/${id}/status`, {
    ...data
  })
}

// 售罄开关
export function setSellOut(id, data) {
  return request.put(`/goods/${id}`, {
    ...data
  })
}

// 列表
export function moreList(params) {
  return request.get('/goods/more/list', {
    params
  })
}

// 添加 / 修改 多次销售
export function moreOrUpdate(data) {
  return request.post(`/goods/more/store`, {
    ...data
  })
}

export function putMoreOrUpdate({ id, ...data }) {
  return request.put(`/goods/more/${id}`, {
    ...data
  })
}

// 资格券列表
export function conditionList(params) {
  return request.get('/goods/condition/filter', {
    params
  })
}

// 库存回收
export function recycle(id) {
  return request.post(`goods/${id}/recycle`)
}
