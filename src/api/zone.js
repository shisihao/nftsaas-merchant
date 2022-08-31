import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/zone', {
    params
  })
}

// 无权限限制 获取`专区`
export function powerZoneList(params) {
  return request.get('/zone/filter', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/category'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 专区隐藏
export function zoneHidden({ id, ...data }) {
  return request.patch(`/zone/${id}/hidden`, {
    ...data
  })
}

// 专区排序
export function zoneSort({ id, ...data }) {
  return request.patch(`/zone/${id}/sort`, {
    ...data
  })
}
