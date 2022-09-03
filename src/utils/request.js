import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: (process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : `${location.origin}`) + '/admin/', // url = base url + request url
  // baseURL: process.env.NODE_ENV === 'development' ? `/admin/` : `${location.origin}/admin/`,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1e3 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      // 未登录
      if (res.code === 4001) {
        if (!document.querySelector('.el-popup-parent--hidden .logout-message-box')) {
          MessageBox.alert('登录已失效，请重新登录', '提示', {
            confirmButtonText: '确定',
            showClose: false,
            customClass: 'logout-message-box',
            callback: action => {
              store.dispatch('user/resetToken').then(() => {
                router.replace({ path: '/login' })
              })
            }
          })
        }
      } else {
        // eslint-disable-next-line no-inner-declarations
        function alertError() {
          if (!document.querySelector('.tips-message-box')) {
            Message({
              message: res.msg || 'Error',
              type: 'error',
              customClass: 'tips-message-box',
              duration: 5 * 1000
            })
          }
        }

        if (res.code === 4008) {
          removeToken()
          router.replace({ path: '/tenants' })
          alertError()
          return false
        } else if (res.code === 4009) {
          router.replace({ path: '/step' })
          alertError()
          return false
        }

        Message({
          message: res.msg || 'Error',
          type: 'error',
          customClass: 'tips-message-box',
          duration: 5 * 1000
        })
        if (typeof (res) === 'string' && res.indexOf('404-') >= 0) {
          document.querySelector('html').innerHTML = res
        }
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response && error.response.status === 503) {
      router.replace({ path: '/503' })
    } else {
      Message({
        message: error.message || error,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
