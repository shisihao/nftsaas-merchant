import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/report/forms', {
    params
  })
}

// 资产列表
export function withdrawaList(params) {
  return request.get('/report/forms/withdrawal', {
    params
  })
}

// 提现列表
export function cnyList(params) {
  return request.get('/report/forms/cny_withdrawal', {
    params
  })
}

// 导出
export function exportOrder(params) {
  return request.get('/report/forms/export', {
    params
  })
}
