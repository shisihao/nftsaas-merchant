import request from '@/utils/request'

// 活动专区
export function zoneList(params) {
  return request.get('/activity/zone/list', {
    params
  })
}

// 活动专区
export function addOrUpdateZone({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/zone'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 铸造藏品筛选列表
export function castList(params) {
  return request.get('/activity/filter/cast_goods', {
    params
  })
}

// 发行方筛选列表
export function issuerList(params) {
  return request.get('/activity/filter/issuer', {
    params
  })
}

// 藏品筛选列表
export function goodsList(params) {
  return request.get('/activity/filter/goods', {
    params
  })
}

// 盲盒筛选列表
export function boxList() {
  return request.get('/activity/filter/box')
}

// 排行榜活动列表
export function rankingList(params) {
  return request.get('/activity/goods_ranking/list', {
    params
  })
}

// 排行榜活动详情
export function getRankingItem(id) {
  return request.get(`/activity/goods_ranking/${id}`)
}

// // 添加 / 修改 排行榜
export function addOrUpdateRanking({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/goods_ranking'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除排行榜活动
export function deleteRanking(id) {
  return request.delete(`/activity/goods_ranking/${id}`)
}

// 排行榜上下架
export function putRankingStatus({ id, ...data }) {
  return request.put(`/activity/goods_ranking/status/${id}`, {
    ...data
  })
}

// 新人福利活动详情
export function welfareDetail(id) {
  return request.get(`/activity/newcomer_welfare/${id}`)
}

// 添加/更新新人福利活动
export function addOrUpdateWelfare({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/newcomer_welfare'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 新人福利列表
export function welfareList() {
  return request.get('/activity/newcomer_welfare/list')
}

// 新人福利删除
export function deleteWelfare(id) {
  return request.delete(`/activity/newcomer_welfare/${id}`)
}

// 新人福利上下架
export function putWelfareStatus({ id, ...data }) {
  return request.put(`/activity/newcomer_welfare/status/${id}`, {
    ...data
  })
}

// 邀新活动列表
export function inviteList() {
  return request.get('/activity/invite_user/list')
}

// 新人福利删除
export function deleteInvite(id) {
  return request.delete(`/activity/invite_user/${id}`)
}

// 添加/更新邀请新人活动
export function addOrUpdateInvite({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/invite_user'
  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }
  return request({ url, method, data })
}

// 邀请新人详情
export function inviteDetail(id) {
  return request.get(`/activity/invite_user/${id}`)
}

// 邀请新人上下架
export function putInviteStatus({ id, ...data }) {
  return request.put(`/activity/invite_user/status/${id}`, {
    ...data
  })
}

// 分享活动详情
export function shareDetail(id) {
  return request.get(`/activity/share/${id}`)
}

// 添加/更新分享活动
export function addOrUpdateShare({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/share'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 分享活动列表
export function shareList() {
  return request.get('/activity/share')
}

// 分享活动删除
export function deleteShare(id) {
  return request.delete(`/activity/share/${id}`)
}

// 分享活动参加记录列表
export function recordShareList(params) {
  return request.get(`/activity/share/record/list`, {
    params
  })
}

// 新人福利上下架
export function putShareStatus({ id, ...data }) {
  return request.put(`/activity/share/status/${id}`, {
    ...data
  })
}

// 分享活动参加记录 审核
export function recordShareStatus({ id, ...data }) {
  return request.put(`/activity/share/record/${id}/audit`, {
    ...data
  })
}

// 导出藏品排行榜
export function exportRanking(params) {
  return request.get('/activity/goods_ranking/export', {
    params
  })
}

// 导出邀新排行榜
export function exportInvite(params) {
  return request.get('/activity/invite_user/export', {
    params
  })
}

// 刷新排行
export function refreshList(id) {
  return request.put(`/activity/goods_ranking/flush/${id}`)
}

// 抽奖活动列表
export function luckDrawList(params) {
  return request.get('/activity/luck_draw/list', {
    params
  })
}

// // 添加 / 修改 抽奖活动
export function addOrUpdateLuckDraw({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/luck_draw'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 活动抽奖删除
export function deleteLuckDraw(id) {
  return request.delete(`/activity/luck_draw/${id}`)
}

// 抽奖上下架
export function putLuckDrawStatus({ id, ...data }) {
  return request.put(`/activity/luck_draw/status/${id}`, {
    ...data
  })
}

// 抽奖详情
export function luckDrawDetail(id) {
  return request.get(`/activity/luck_draw/${id}`)
}

// 大转盘活动列表
export function turntableList(params) {
  return request.get('/activity/turntable/list', {
    params
  })
}

// // 添加 / 修改 大转盘活动
export function addOrUpdateTurntable({ id, ...data }) {
  let method = 'POST'
  let url = '/activity/turntable'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 活动大转盘删除
export function deleteTurntable(id) {
  return request.delete(`/activity/turntable/${id}`)
}

// 大转盘上下架
export function putTurntableStatus({ id, ...data }) {
  return request.put(`/activity/turntable/status/${id}`, {
    ...data
  })
}

// 大转盘详情
export function turntableDetail(id) {
  return request.get(`/activity/turntable/${id}`)
}

