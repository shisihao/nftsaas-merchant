import request from '@/utils/request'

// 获取空投活动名称
export function airdropList() {
  return request.get('/goods/activities')
}

// 添加 / 修改
export function addAirdrop({ id, ...data }) {
  let method = 'POST'
  let url = '/goods/addAirdropGoods'

  if (id > 0) {
    method = 'PUT'
    url = `/goods/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 空投操作添加
export function addAirdrops(data) {
  return request.post('/goods/airdropGoods', {
    ...data
  })
}

// 空投记录
export function airdropLogs(params) {
  return request.get('/goods/airdropLog', {
    params
  })
}

// 空投失败记录
export function failedLogs(params) {
  return request.get('/goods/failedLog', {
    params
  })
}

// 导出失败空投记录
export function exportOrder(params) {
  return request.get('/goods/exportLog', {
    params
  })
}
