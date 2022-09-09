const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  info: state => state.user.info,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  configInfo: state => state.deploys.configInfo,
  msgCount: state => state.user.msgCount,
  integral: state => state.user.integral
}
export default getters
