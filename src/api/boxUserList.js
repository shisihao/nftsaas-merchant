import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/userBlindBox', {
    params
  })
}

// 指定开启
export function setBlindBox(data) {
  return request.post('/userBlindBox/set', {
    ...data
  })
}
