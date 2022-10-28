import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/entityGoods', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/entityGoods'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/entityGoods/${id}`)
}

// 详情
export function getDataItem(id) {
  return request.get(`/entityGoods/${id}`)
}

//  商品上下架
export function setStatus({ id, ...data }) {
  return request.post(`/entityGoods/status/${id}`, {
    ...data
  })
}

//  权益藏品
export function conditionGoodsList() {
  return request.get('/entityGoods/conditionGoods/filter')
}

