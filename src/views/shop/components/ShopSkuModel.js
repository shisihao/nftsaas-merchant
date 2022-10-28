export default class GoodsSku {
  // 规格图
  image = ''
  // 人民币价格
  cny_price = 0
  // 积分价格
  integral_price = 0
  // 库存
  stock = 0
  // 商品劵数量
  commodity_price = 0
  // 藏品数量
  goods_num=0
  // sku规格属性
  specs_properties = []

  constructor(options = {}) {
    [
      'image',
      'cny_price',
      'integral_price',
      'goods_num',
      'stock',
      'commodity_price',
      'specs_properties'
    ].forEach(key => {
      this[key] = options[key] || this[key]
    })
  }
}
