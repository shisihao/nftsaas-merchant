import request from '@/utils/request'

// 奖励流水列表
export function dataList(params) {
  return request.get('/sales', {
    params
  })
}

// 批量结算
export function setSettlement({ ...data }) {
  return request.post('/sales/settlement', {
    ...data
  })
}

// 导出订单
export function exportOrder(params) {
  return request.get('/sales/export', {
    params
  })
}
