import request from '@/utils/request'

// 获取用户信息
export function getInfo(params) {
  return request.get('/public/tenant/info', {
    params
  })
}

// 续费配置信息
export function getConfig(params) {
  return request.get('/public/tenant/config', {
    params
  })
}

// 续费套餐列表
export function getMeals(params) {
  return request.get('/public/tenant/set-meals', {
    params
  })
}

// 续费下单
export function postStore(data) {
  return request.post('/public/tenant/order/store', {
    ...data
  })
}

// 未读消息总数
export function getMessageCount(params) {
  return request.get('/tenant/messages-count', {
    params
  })
}

// 消息列表
export function getMessage(params) {
  return request.get('/tenant/messages', {
    params
  })
}

// 删除消息
export function delMessage(id) {
  return request.delete(`/tenant/messages-delete/${id}`)
}

// 操作说明-分类
export function getHelpCate(params) {
  return request.get('/public/tenant/help-cate', {
    params
  })
}

// 操作说明-详情
export function getHelp(params) {
  return request.get('/public/tenant/help', {
    params
  })
}

// 续费订单详情
export function getRenew(id, params) {
  return request.get(`/tenant/order/${id}`, {
    params
  })
}

// 续费订单列表
export function getRenewList(params) {
  return request.get('/tenant/order', {
    params
  })
}

// 优惠券列表
export function getCoupons(params) {
  return request.get('/public/tenant/coupons', {
    params
  })
}

// 获取认证信息
export function getIdentification(params) {
  return request.get('/public/tenant/identification', {
    params
  })
}

// 添加认证信息
export function postIdentification(data) {
  return request.post('/public/tenant/identification/store', {
    ...data
  })
}

// 添加认证信息
export function putIdentification(data) {
  return request.put('/public/tenant/identification/update', {
    ...data
  })
}