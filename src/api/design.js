import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/design', {
    params
  })
}

// 模版列表
export function temList(params) {
  return request.get('/design/template_list', {
    params
  })
}

// 添加主题
export function setTem(data) {
  return request.post(`/design`, {
    ...data
  })
}

// 编辑主题
export function putTem(data) {
  return request.put(`/design`, {
    ...data
  })
}
