import request from '@/utils/request'

// 退货列表
export function dataList() {
  return request.get('/refundTag')
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  const method = 'POST'
  let url = '/refundTag/add'

  if (id > 0) {
    url = '/refundTag/update'
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/refundTag/delete/${id}`)
}
