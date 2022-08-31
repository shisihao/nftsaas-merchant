import request from '@/utils/request'

export function getQiniuToken() {
  return request.get('/token')
}
