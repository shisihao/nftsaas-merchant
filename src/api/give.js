import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/give', {
    params
  })
}
