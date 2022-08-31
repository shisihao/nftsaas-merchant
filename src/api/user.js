import request from '@/utils/request'

// 用户列表
export function dataList(params) {
  return request.get('/users', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/users'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/users/${id}/delete`)
}

export function moreStatus({ id, ...data }) {
  return request.post(`/users/${id}/switch`, {
    ...data
  })
}

// 查询子集
export function subset(id, params) {
  return request.get(`/users/${id}/subset`, {
    params
  })
}

// 导出用户信息
export function exportOrder(params) {
  return request.get('/users/export/info', {
    params
  })
}

// 钱包详情
export function wallet(id) {
  return request.get(`/wallets/${id}`)
}

// 某用户钱包列表
export function walletList(params) {
  return request.get(`/wallets/logs`, {
    params
  })
}

// 全部用户钱包列表
export function walletsList(params) {
  return request.get('/wallets', {
    params
  })
}

// 资产增加/扣除
export function setWallet({ id, ...data }) {
  return request.post(`wallets/${id}/adjust`, {
    ...data
  })
}

// 数据导出
export function exportExcel(params) {
  return request.get('/wallets/export/recharge', {
    params
  })
}
