import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/ores', {
    params
  })
}

// 获取 `用户领取记录`
export function getOresUser(id, params) {
  return request.get(`ores/${id}`, {
    params
  });
}
