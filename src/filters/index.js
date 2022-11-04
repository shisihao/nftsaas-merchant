
// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
import { BigNumber } from 'bignumber.js'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 1000.123456 => "1,000.123456"
 * @param num
 * @returns {*|string}
 */
export function toThousandBitFilter(num) {
  return num && (num.toString().indexOf('.') !== -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
    return $1 + ','
  }) : toThousandFilter(num))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 类型解释
 * @param value
 * @param options
 * @param v
 * @param l
 * @returns {string|*}
 */
export function paraphrase(value, options = [], v = 'value', l = 'label') {
  const newData = options.filter(x => {
    return x[v] === value
  })
  if (newData.length > 0) {
    return newData[0][l]
  }
  return ''
}

/**
 * 过滤小数多余 0
 * @param {*} value
 * @param {*} decimalLength
 * @returns
 */
export function cutZero(value = 0, decimalLength = 8) {
  const val = typeof (value) === 'number' ? value : parseFloat(value)
  const valArray = val.toFixed(decimalLength).split('.')
  const decimalArray = valArray[1].split('').reverse()
  const result = []
  for (let i = 0; i < decimalArray.length; i++) {
    if ((decimalArray[i] > 0 && result.length === 0) || result.length > 0) {
      result.push(decimalArray[i])
    }
  }

  return result.length > 0 ? `${valArray[0]}.${result.reverse().join('')}` : valArray[0]
}

/**
 * 金额格式化 1,000.00
 * @param {*} value
 * @param {*} length
 * @returns
 */
export function moneyToFormat(value, length = 2) {
  const x = new BigNumber(`${value}`)
  return x.toFormat(length)
}

/**
 * 注销用户手机号格式化
 * @param {*} value
 * @returns
 */
export function cancelPhone(value) {
  return value.split('DEL').reverse()[0]
}
