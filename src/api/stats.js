import request from '@/utils/request'

// 创豆总数/糖果总数
export function counts(params) {
  return request.get('/counts', {
    params
  })
}