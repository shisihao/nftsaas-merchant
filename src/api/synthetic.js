import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/synthesis', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/synthesis'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除合成活动
export function deleteData(id) {
  return request.delete(`/synthesis/${id}`)
}

// 合成活动详情
export function details(id) {
  return request.get(`/synthesis/${id}`)
}

// 合成藏品列表
export function synthesisList(params) {
  return request.get('/synthesis/synthesis/list', {
    params
  })
}

// 材料列表
export function formulaList(params) {
  return request.get('/synthesis/formula/list', {
    params
  })
}

// 合成记录
export function synthesisLog(id, params) {
  return request.get(`/synthesis/${id}/log`, {
    params
  })
}

// 回收库存
export function recycleStock(id) {
  return request.post(`synthesis/${id}/recycle`)
}

// 合成记录导出
export function synthesisLogExport(id, params) {
  return request.get(`/synthesis/${id}/log/export`, {
    params
  })
}
