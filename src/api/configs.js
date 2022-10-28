import request from '@/utils/request'

// 获取谷歌验证
export function addAuthenticator() {
  return request.post('/configs/google_authenticator')
}

// 删除谷歌验证
export function delAuthenticator(data) {
  return request.delete('/configs/delete_google_png', {
    data
  })
}

// 版本控制状态
export function versionStatus() {
  return request.get('/configs/version')
}

// 修改版本控制状态
export function putVersionStatus(data) {
  return request.put('/configs/version', {
    ...data
  })
}

// 获取邀请配置
export function invite() {
  return request.get('/configs/invite')
}

// 修改邀请配置
export function putInvite(data) {
  return request.put('/configs/invite', {
    ...data
  })
}

// 支付方式开关配置
export function pay() {
  return request.get('/configs/pay_switch')
}

// 修改支付方式开关配置
export function putPay(data) {
  return request.put('/configs/pay_switch', {
    ...data
  })
}

// 支付宝支付配置
export function aliPay() {
  return request.get('/configs/alipay')
}

// 支付宝支付设置
export function setAliPay(data) {
  return request.put('/configs/alipay', {
    ...data
  })
}

// 微信支付配置
export function wxPay() {
  return request.get('/configs/wxpay')
}

// 微信支付设置
export function setWxPay(data) {
  return request.put('/configs/wxpay', {
    ...data
  })
}

// 杉德支付配置
export function sandPay() {
  return request.get('/configs/sandpay')
}

// 杉德支付设置
export function setSandPay(data) {
  return request.put('/configs/sandpay', {
    ...data
  })
}

// 提现配置
export function withdrawal() {
  return request.get('/configs/withdrawal')
}

// 修改提现配置
export function putWithdrawal(data) {
  return request.put('/configs/withdrawal', {
    ...data
  })
}

// 提现配置
export function cnyWithdrawal() {
  return request.get('/configs/cny/withdrawal')
}

// 修改提现配置
export function putCnyWithdrawal(data) {
  return request.put('/configs/cny/withdrawal', {
    ...data
  })
}

// 提现配置
export function usdtWithdrawal() {
  return request.get('/configs/usdt/withdrawal')
}

// 修改提现配置
export function putUsdtWithdrawal(data) {
  return request.put('/configs/usdt/withdrawal', {
    ...data
  })
}

// 提现配置
export function filWithdrawal() {
  return request.get('/configs/fil/withdrawal')
}

// 修改提现配置
export function putFilWithdrawal(data) {
  return request.put('/configs/fil/withdrawal', {
    ...data
  })
}

// 提现配置
export function btcWithdrawal() {
  return request.get('/configs/btc/withdrawal')
}

// 修改提现配置
export function putBtcWithdrawal(data) {
  return request.put('/configs/btc/withdrawal', {
    ...data
  })
}

// 提现配置
export function ethWithdrawal() {
  return request.get('/configs/eth/withdrawal')
}

// 修改提现配置
export function putXchWithdrawal(data) {
  return request.put('/configs/xch/withdrawal', {
    ...data
  })
}

// 提现配置
export function xchWithdrawal() {
  return request.get('/configs/xch/withdrawal')
}

// 修改提现配置
export function putEthWithdrawal(data) {
  return request.put('/configs/eth/withdrawal', {
    ...data
  })
}

// 获取Fil钱包分发比例
export function fil() {
  return request.get('/configs/fil')
}

// 修改Fil钱包分发比例
export function putFil(data) {
  return request.put('/configs/fil', {
    ...data
  })
}

// 获取Fil互转-详情
export function filTransfer() {
  return request.get('/configs/fil/transfer')
}

// 修改Fil互转-详情
export function putFilTransfer(data) {
  return request.put('/configs/fil/transfer', {
    ...data
  })
}
// 获取eth互转-详情
export function ethTransfer() {
  return request.get('/configs/eth/transfer')
}

// 修改eth互转-详情
export function putEthTransfer(data) {
  return request.put('/configs/eth/transfer', {
    ...data
  })
}
// 获取btc互转-详情
export function btcTransfer() {
  return request.get('/configs/btc/transfer')
}

// 修改btc互转-详情
export function putBtcTransfer(data) {
  return request.put('/configs/btc/transfer', {
    ...data
  })
}
// 获取usdt互转-详情
export function usdtTransfer() {
  return request.get('/configs/usdt/transfer')
}

// 修改usdt互转-详情
export function putUsdtTransfer(data) {
  return request.put('/configs/usdt/transfer', {
    ...data
  })
}
// 获取xch互转-详情
export function xchTransfer() {
  return request.get('/configs/xch/transfer')
}

// 修改usdt互转-详情
export function putXchTransfer(data) {
  return request.put('/configs/xch/transfer', {
    ...data
  })
}

// 税点
export function configsTax() {
  return request.get('/configs/tax')
}
export function putConfigsTax(data) {
  return request.put('/configs/tax', {
    ...data
  })
}

// 账户信息配置
export function receivable() {
  return request.get('/configs/account/receivable')
}

// 修改账户信息配置
export function putReceivable(data) {
  return request.put('/configs/account/receivable', {
    ...data
  })
}

// 获取新手福利
export function benefit() {
  return request.get('/configs/novice-benefits')
}

// 修改新手福利
export function putBenefit(data) {
  return request.put('/configs/novice-benefits', {
    ...data
  })
}

// 电费相关
export function electricity() {
  return request.get('/configs/electricity')
}

// 修改电费相关
export function putElectricity(data) {
  return request.put('/configs/electricity', {
    ...data
  })
}

// usdt 兑换 RMB
export function usdt() {
  return request.get('/configs/usdt/price')
}

// 修改usdt 兑换 RMB
export function putUsdt(data) {
  return request.post('/configs/usdt/price', {
    ...data
  })
}

// 获取 `联系方式`
export function contact() {
  return request.get('configs/contact')
}

// 修改 `联系方式`
export function putContact(data) {
  return request.put('configs/contact', data)
}

// 关于
export function about() {
  return request.get('/configs/about')
}

// 修改关于
export function putAbout(data) {
  return request.put('/configs/about', {
    ...data
  })
}

// 注册协议
export function register() {
  return request.get('/configs/register')
}

// 修改注册协议
export function putRegister(data) {
  return request.put('/configs/register', {
    ...data
  })
}

// 购买协议
export function purchase() {
  return request.get('/configs/purchase')
}

// 修改购买协议
export function putPurchase(data) {
  return request.put('/configs/purchase', {
    ...data
  })
}

// 托管协议
export function hosting() {
  return request.get('/configs/hosting')
}

// 修改托管协议
export function putHosting(data) {
  return request.put('/configs/hosting', {
    ...data
  })
}

// 用户协议
export function agreement() {
  return request.get('/configs/agreement')
}

// 修改用户协议
export function putAgreement(data) {
  return request.put('/configs/agreement', {
    ...data
  })
}

// 用户等级默认图标
export function icon() {
  return request.get('/configs/default_icon')
}

// 修改用户等级默认图标
export function putIcon(data) {
  return request.put('/configs/default_icon', {
    ...data
  })
}

// 密钥配置
export function ant() {
  return request.get('/configs/ant_config')
}

// 修改密钥配置
export function putAnt(data) {
  return request.put('/configs/ant_config', {
    ...data
  })
}

// 签名配置
export function sign() {
  return request.get('/configs/sign')
}

// 修改签名配置
export function putSign(data) {
  return request.put('/configs/sign', {
    ...data
  })
}

// 合约地址
export function changeAddress() {
  return request.get('/configs/address')
}

// 修改合约地址
export function putChangeAddress(data) {
  return request.put('/configs/address', {
    ...data
  })
}

// 链上说明配置
export function chainList() {
  return request.get('/configs/chain_query')
}

// 链上说明配置
export function addChainList(data) {
  return request.put('/configs/chain_query', {
    ...data
  })
}

// 订单失信配置
export function orderLimit() {
  return request.get('/configs/order_limit')
}

// 修改订单失信配置
export function putOrderLimit(data) {
  return request.put('/configs/order_limit', {
    ...data
  })
}

// 转移配置
export function putDestroy(data) {
  return request.put('/configs/user_goods/destroy', {
    ...data
  })
}

// 转移配置
export function destroy() {
  return request.get('/configs/user_goods/destroy')
}

// 解除失信
export function blacklistCancel(data) {
  return request.post('/configs/blacklist/cancel', {
    ...data
  })
}

// 订单失信列表
export function blacklist(params) {
  return request.get('/configs/blacklist', {
    params
  })
}

// 顶象开关配置
export function dxConfig() {
  return request.get('/configs/dx_config')
}

// 顶象开关配置
export function putDxConfig(data) {
  return request.put('/configs/dx_config', {
    ...data
  })
}

// 奇藏果转赠配置
export function qcgGive() {
  return request.get('/configs/qcg_give')
}

// 奇藏果转赠配置
export function putQcgGive(data) {
  return request.put('/configs/qcg_give', {
    ...data
  })
}

// 铸造藏品列表
export function castGoodsList(params) {
  return request.get('/public/filter/cast_goods', {
    params
  })
}

// 赠送配置
export function giveList() {
  return request.get('/configs/give')
}

// 赠送配置
export function addGiveList(data) {
  return request.put('/configs/give', {
    ...data
  })
}

// 获取积分配置
export function getIntegralConfig() {
  return request.get('/configs/integral')
}

// 设置积分配置
export function integralConfig(data) {
  return request.put('/configs/integral', {
    ...data
  })
}

// 获取展台配置
export function getBackImage() {
  return request.get('/configs/back_image')
}
// 设置展台配置
export function setBackImage(data) {
  return request.put('/configs/back_image', {
    ...data
  })
}

// 获取三要素配置
export function getCert() {
  return request.get('/configs/cert')
}
// 设置三要素配置
export function setCert(data) {
  return request.put('/configs/cert', {
    ...data
  })
}

// 获取短信配置
export function getSms() {
  return request.get('/configs/sms')
}
// 设置短信配置
export function setSms(data) {
  return request.put('/configs/sms', {
    ...data
  })
}

// 获取滑块验证配置
export function getSlider() {
  return request.get('/configs/cvm_config')
}
// 设置滑块验证配置
export function setSlider(data) {
  return request.put('/configs/cvm_config', {
    ...data
  })
}

// 获取藏品编号前缀配置
export function getPrefix() {
  return request.get('/configs/serial')
}
// 设置藏品编号前缀配置
export function setPrefix(data) {
  return request.put('/configs/serial', {
    ...data
  })
}

// 视频藏品配置
export function videoSeconds() {
  return request.get('/configs/video_seconds')
}

// 视频藏品配置
export function putVideoSeconds(data) {
  return request.put('/configs/video_seconds', {
    ...data
  })
}

// 视频藏品配置
export function downloadImage() {
  return request.get('/configs/download_image')
}

// 视频藏品配置
export function putDownloadImage(data) {
  return request.put('/configs/download_image', {
    ...data
  })
}

// 闪汇配置
export function getGwjOpen() {
  return request.get('/configs/gwj_open')
}

// 闪汇配置
export function setGwjOpen(data) {
  return request.put('/configs/gwj_open', {
    ...data
  })
}

// 积分单价配置
export function integralPrice() {
  return request.get('/configs/integral_unit_price')
}

// 积分单价配置
export function putIntegralPrice(data) {
  return request.put('/configs/integral_unit_price', {
    ...data
  })
}

// 云账号开户费用配置
export function openAmount() {
  return request.get('/configs/open_amount')
}

// 云账号开户费用配置
export function putOpenAmount(data) {
  return request.put('/configs/open_amount', {
    ...data
  })
}

// 奖励积分有效期配置
export function integralReward() {
  return request.get('/configs/integral_reward')
}

export function putIntegralReward(data) {
  return request.put('/configs/integral_reward', {
    ...data
  })
}
