/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername1(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername2(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9,，.。]+$/
  return reg.test(str)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validENumber(str) {
  const reg = /^[A-Za-z0-9]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 验证数字
 * @param str
 * @returns {*|boolean}
 */
export function validNumber(str) {
  const reg = /^[1-9]\d*$/
  return reg.test(str)
}

/**
 * 验证金额，保留两位小数
 * @param str
 * @returns {*|boolean}
 */
export function validPrice(str) {
  const reg = /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/
  return reg.test(str)
}

/**
 * 验证手机号
 * @param str
 * @returns {*|boolean}
 */
export function validPhone(str) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(str)
}

/**
 *  包含空格
 * @param {*} str
 * @returns
 */
export function validSpace(str) {
  const reg = /^[^\s]*$/
  return reg.test(str)
}

/**
 *  验证微信
 * @param {*} str
 * @returns
 */
export function validWehcat(str) {
  const reg = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/
  return reg.test(str)
}

/**
 *  验证QQ
 * @param {*} str
 * @returns
 */
export function validQQ(str) {
  const reg = /^[1-9][0-9]{4,11}$/
  return reg.test(str)
}

/**
 *  验证身份证
 * @param {*} str
 * @returns
 */
export function validIdentity(str) {
  const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}
