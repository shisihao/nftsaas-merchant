import request from '@/utils/request'

// 获取 `FIL钱包分发`
export function dataList(params) {
  return request.get('/periods/logs', {
    params
  })
}

// 获取 `specs`
export function getSpecs(params) {
  return request.get('/orders/count/spec', {
    params
  })
}

// 获取 `资产列表`
export function getWithdrawList(params) {
  return request.get('/withdrawals', {
    params
  })
}

// 提现 `通过/驳回`
export function statusWithdraw({ id, ...data }) {
  return request.put(`/withdrawals/${id}/audit`, {
    ...data
  })
}

// 统计
export function getStatistics(params) {
  return request.get('/withdrawals/statistics', {
    params
  })
}

// 撤销分发
export function agreeCancel(id) {
  return request.put(`/periods/cancel/${id}`)
}

// 导出分发记录
export function exportExport(params) {
  return request.get('/periods/export/period_log', {
    params
  })
}

// 获取验证码
export function getCode(params) {
  return request.get('/withdrawals/code', {
    params
  })
}
