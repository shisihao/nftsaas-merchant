import request from '@/utils/request'

// 提前还币流水
export function dataList(params) {
  return request.get(`/return_logs/ahead`, {
    params
  })
}

// 导出提前还币流水
export function aheadExportOrder(params) {
  return request.get(`/return_logs/ahead/export`, {
    params
  })
}
