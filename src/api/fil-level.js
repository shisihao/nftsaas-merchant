import request from '@/utils/request'

// 获取 `FIL钱包分发`
export function dataList(params) {
  return request.get('/periods', {
    params
  })
}

// 新增/修改 `FIL钱包分发`
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/periods'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/periods/${id}`)
}

// 无权限限制 获取`期数`
export function powerLevelList(params) {
  return request.get('/period/filter', {
    params
  })
}

// 获取 `分发日志`
export function dataListLogs(params) {
  return request.get('/periods/logs', {
    params
  })
}

// 新增 `分发收益`
export function addPeriod(data) {
  return request.post('/periods/mining/distribution', {
    ...data
  })
}

// 还币流水
export function periodsBackList(id, params) {
  return request.get(`/periods/back/${id}`, {
    params
  })
}

// 获取 `所有期数`
export function dataAllList(params) {
  return request.get('/periods/get_all', {
    params
  })
}

// 根据期数名获取 `规格`
export function specNameList(params) {
  return request.get('/periods/by_name', {
    params
  })
}

export function moreStatus({ id, ...data }) {
  return request.put(`/periods/bonus/${id}`, {
    ...data
  })
}

// 导出
export function exportOrder(params) {
  return request.get('/periods/export/return_period_log', {
    params
  })
}

// B端期数列表
export function getAntPeriods(params) {
  return request.get('/periods/ant_periods', {
    params
  })
}

// B端分发列表
export function getAntPeriodsLogs(params) {
  return request.get('/periods/ant_period_logs', {
    params
  })
}

// B端
export function getAntPeriodsLevel(params) {
  return request.get('/periods/ant_period_filter', {
    params
  })
}
