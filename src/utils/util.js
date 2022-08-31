export default {
  install(Vue, options) {
    // dialog重置表单
    Vue.prototype.$reset = function(formRef = 'form', isForm = true, excludeFields) {
      const obj1 = this.$data
      const obj2 = this.$options.data.call(this)
      if (!excludeFields || excludeFields.length === 0) {
        excludeFields = ['rules']
      }
      for (const attrName in obj1) {
        if (excludeFields && excludeFields.includes(attrName)) {
          continue
        }
        obj1[attrName] = obj2[attrName]
      }
      if (isForm) {
        this.$refs[formRef].resetFields()
      }
    }
  }
}
