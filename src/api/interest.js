import request from '@/utils/request'

// 藏品权益列表
export function goodsdDataList(params) {
  return request.get('/interest/goods_interest', {
    params
  })
}

// 添加 / 修改权益
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/interest/goods_interest'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 选择权益列表
export function interestList() {
  return request.get('/interest/goods_interest/interest/filter')
}

// 选择藏品列表
export function goodsList() {
  return request.get('/interest/goods_interest/goods/filter')
}

// 选择实体商品列表
export function entityGoodsList() {
  return request.get('interest/goods_interest/entity_goods/filter')
}

// 详情
export function details(id) {
  return request.get(`/interest/goods_interest/${id}`)
}

// 权益列表
export function dataList() {
  return request.get('/interest')
}

// 编辑权益
export function addDataList(id, data) {
  return request.put(`/interest/${id}`, {
    ...data
  })
}

// 权益赠送列表
export function giveDataList(params) {
  return request.get('/interest/goods_interest_give', {
    params
  })
}

// 权益藏品列表
export function giveList(params) {
  return request.get('/interest/goods_interest_give/goods/filter', {
    params
  })
}

// 添加 / 修改权益赠送
export function addOrUpdateGive({ id, ...data }) {
  let method = 'POST'
  let url = '/interest/goods_interest_give'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 权益赠送详情
export function giveDetails(id) {
  return request.get(`/interest/goods_interest_give/${id}`)
}

// 权益等级映射列表
export function gradeList() {
  return request.get('/public/interest/grade/filter')
}

// 指定发行方列表
export function issuerList() {
  return request.get('/public/filter/issuer')
}
