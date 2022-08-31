import Cookies from 'js-cookie'

export const TokenKey = 'Merchant-Token'
export const OssKey = 'Oss-Token'
export const DominKey = 'Domin-Token'
export const AppKey = 'App-info'

export function getToken(key = TokenKey) {
  return Cookies.get(key)
}

export function setToken(token, key = TokenKey) {
  return Cookies.set(key, token)
}

export function removeToken(key = TokenKey) {
  return Cookies.remove(key)
}
