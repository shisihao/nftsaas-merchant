import { login } from '@/api/common'
import { getInfo } from '@/api/tenant'
import { getMessageCount } from '@/api/tenant'
import { getToken, setToken, removeToken, OssKey, DominKey, AppKey } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getIntegralConfig } from '@/api/configs'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  info: '',
  msgCount: '',
  roles: [],
  integral: getToken('integral') || '积分'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CONFIGINFO: (state, data) => {
    state.configInfo = data
  },
  SET_INFO: (state, data) => {
    state.info = data
  },
  SET_MSGCOUNT: (state, data) => {
    state.msgCount = data
  },
  SET_INTEGRAL: (state, data) => {
    state.integral = data
  }
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        dispatch('getIntegral')
        commit('SET_TOKEN', data.admin.admin_token)
        setToken(data.oss.domain, DominKey)
        setToken(data.admin.admin_token)
        setToken(data.admin.is_first, 'is_first')
        setToken(data.security, 'security')
        data.oss && setToken(JSON.stringify(data.oss), OssKey)
        data.app && setToken(JSON.stringify(data.app), AppKey)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = {
        avatar: 'favicon.png',
        introduction: 'I am a super administrator',
        name: 'Super Admin',
        // roles: ['admin'] // 超级权限
        roles: ['normal']
      }

      const { roles, name, avatar, introduction } = data
      if (data) {
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      } else {
        reject('Has error')
      }
    })
  },
  getTenant({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data: { tenant, tip_day }} = response
        if (tenant && tip_day) {
          const info = Object.assign(tenant, tip_day)
          commit('SET_INFO', info)
          resolve(info)
        } else {
          reject('Has error')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMsgCount({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMessageCount()
        .then(response => {
          commit('SET_MSGCOUNT', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getIntegral({ commit, state }) {
    getIntegralConfig().then(res => {
      res.data.value && commit('SET_INTEGRAL', res.data.value.name)
      res.data.value && setToken(res.data.value.name, 'integral')
    }).catch(() => { })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_CONFIGINFO', '')
      removeToken('integral')
      removeToken('is_first')
      removeToken()
      removeToken(OssKey)
      removeToken(DominKey)
      removeToken(AppKey)
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_CONFIGINFO', '')
      removeToken()
      removeToken(OssKey)
      removeToken(DominKey)
      removeToken(AppKey)
      removeToken('integral')
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
