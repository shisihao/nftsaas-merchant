import request from '@/utils/request'

// 获取 `栏目`
export function dataList(params) {
  return request.get('/news-cates', {
    params
  })
}

// 资讯库 `栏目`
export function dataLibraryList(params) {
  return request.get('/news-cates/library', {
    params
  })
}

// 新增/修改 `栏目`
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/news-cates'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/news-cates/${id}`)
}

// 无权限限制 获取 `栏目`
export function powerCateList(params) {
  return request.get('/news-cate/filter', {
    params
  })
}