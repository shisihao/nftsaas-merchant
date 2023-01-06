import request from '@/utils/request'

//
export function dataList(params) {
  return request.get('/activityRank/list', {
    params
  })
}
export function putData(data) {
  return request.post('/activityRank/update', {
    ...data
  })
}

export function dataConfig(params) {
  return request.get('/activityRank/config', {
    params
  })
}
export function putDataConfig(data) {
  return request.post('/activityRank/config', {
    ...data
  })
}

// 导出
export function exportOrder(params) {
  return request.get('/activityRank/export', {
    params
  })
}
