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

// 用户喜欢的
export function userLikes(id, params) {
  return request.get(`/users/like/${id}`, {
    params
  })
}
// 用户收藏的
export function userCollection(id, params) {
  return request.get(`/users/collection/${id}`, {
    params
  })
}

// 用户关注的
export function userAttention(id, params) {
  return request.get(`/users/attention/${id}`, {
    params
  })
}
// 用户的粉丝
export function userFans(id, params) {
  return request.get(`/users/fans/${id}`, {
    params
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
export function wallet(params) {
  return request.get('/users/wallet', {
    params
  })
}

// 某用户钱包列表
export function walletList(params) {
  return request.get('/users/wallet/logs', {
    params
  })
}

// 资产增加/扣除
export function setWallet({ ...data }) {
  return request.post(`/users/wallet/adjust`, {
    ...data
  })
}

// 数据导出
export function exportExcel(params) {
  return request.get(`/users/wallet/export`, {
    params
  })
}

// 销毁
export function onDestroy(data) {
  return request.put(`/users/collection/destroy`, {
    ...data
  })
}

// 指定藏品导出
export function exportSerialExcel(params) {
  return request.get(`/users/serial/export`, {
    params
  })
}

// 冻结开关
export function setStatus(data) {
  return request.put(`/users/collection/frozen`, {
    ...data
  })
}

// 用户资产空投
export function airBalance(data) {
  return request.post('/users/air_balance', {
    ...data
  })
}

// 导出用户消费金额排名
export function exportSpendExcel(params) {
  return request.get(`/users/spend/export`, {
    params
  })
}
