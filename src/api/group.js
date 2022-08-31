import request from '@/utils/request'

// 期数分组
export function dataList(params) {
  return request.get(`/group`, {
    params
  })
}

// 无权限限制 获取 `分组`
export function powerGroupList(params) {
  return request.get('/group/mapping', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/group'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 根据分组id获取期数
export function getLevel(params) {
  return request.get(`/group/periods`, {
    params
  })
}

// 获取 `记录`
export function groupLogs(id, params) {
  return request.get(`/group/${id}/logs`, {
    params
  })
}

// 添加 `分发`
export function addIssue({ id, ...data }) {
  return request.post(`/group/issue/${id}`, {
    ...data
  })
}

// 撤销
export function issueCancel(id) {
  return request.post(`/group/cancel/issue/${id}`)
}

// 根据分组id总T数
export function getSpecs(id, params) {
  return request.get(`/group/${id}/total`, {
    params
  })
}

// 将期数移出分组
export function delLevel(id) {
  return request.patch(`/group/remove/${id}`)
}
