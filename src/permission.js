import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
import { getMenuNav } from '@/api/common'
import Layout from '@/layout'
import { localMap } from '@/router/modules/components'
import { asyncRoutes as asyncRoutes404 } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/step', '/tenants'] // no redirect whitelist

function generateMenu(routes, data) {
  data.forEach(item => {
    const menu = {
      path: `/${item.alias}`,
      component: item.url ? localMap[item.url] : Layout,
      hidden: item.show === 0,
      children: [],
      name: item.alias,
      meta: {
        title: item.name,
        icon: item.icon
      }
    }
    if (item.list) {
      generateMenu(menu.children, item.list)
    } else {
      delete menu.children
    }
    routes.push(menu)
  })
  return routes
}

if (!store.getters.configInfo) {
  // 获取配置信息
  store.dispatch('deploys/getConfigInfo')
}

if (!store.getters.info) {
  // 获取用户信息
  store.dispatch('user/getTenant')
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  // document.title = getPageTitle(to.meta.title)
  document.title = to.meta.title || ''

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          getMenuNav()
            .then(response => {
              let serverRoute = response.data.menus || []

              if (store.getters.info.wallet_status === 0) {
                // 过滤掉云账号开户费用配置的路由
                serverRoute = serverRoute.map(item => {
                  if (Array.isArray(item.list)) {
                    item.list = item.list.filter(list_item => list_item.alias !== 'openAmount')
                  }
                  return item
                })
              }

              if (store.getters.info.shop_status === 0) {
                // 过滤掉商城相关的路由
                const filterRoutes = ['orderRefund', 'refundTag', 'entityOrders', 'entityGoods', 'goodsCategory', 'delivery', 'integralReward', 'qualification']
                serverRoute = serverRoute.filter(menu => menu.alias !== 'shoppe')
                serverRoute = serverRoute.map(item => {
                  if (Array.isArray(item.list)) {
                    item.list = item.list.filter(list_item => !filterRoutes.includes(list_item.alias))
                  }
                  return item
                })
              }

              const asyncRoutes = generateMenu([], serverRoute)

              store.dispatch('permission/generateRoutes1', { asyncRoutes: asyncRoutes, roles: roles })
                .then((accessedRoutes) => {
                  router.addRoutes(accessedRoutes.concat(asyncRoutes404))
                })
                .catch(() => {
                  next(`/login?redirect=${to.path}`)
                })
            })
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          Message.error((error && error.msg) || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
