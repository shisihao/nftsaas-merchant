<template>
  <el-descriptions :column="1" size="medium" title="" labelClassName="label-title">
    <el-descriptions-item label="认证类型">{{ form.type | paraphrase(typeOptions) }}</el-descriptions-item>

    <template v-if="form.type === 0">
      <el-descriptions-item label="真实姓名">{{ form.user_name }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ mask(form.card_number, 6, 14, '*') }}</el-descriptions-item>
    </template>

    <template v-else-if="form.type === 1">
      <el-descriptions-item label="公司名称">{{ form.company_name }}</el-descriptions-item>
      <el-descriptions-item label="所在地">{{ locationName(form.location) }}</el-descriptions-item>
      <el-descriptions-item label="详细地址">{{ form.address }}</el-descriptions-item>
      <el-descriptions-item label="统一社会信用代码">{{ form.social_code }}</el-descriptions-item>
    </template>

    <el-descriptions-item label="手机号">{{ mask(form.phone, 3, 7, '*') }}</el-descriptions-item>
    <el-descriptions-item :label="form.status === 0 ? '申请时间': '认证时间'">{{ form.updated_at }}</el-descriptions-item>

    <slot />
  
  </el-descriptions>
</template>

<script>
import { regionData } from 'element-china-area-data'

export default {
  name: 'IdentyInfo',
  props: {
    form: {
      type: Object,
      default: {
        id: 0,
        type: 0,
        status: '',
        user_name: '',
        company_name: '',
        card_number: '',
        positive: '',
        other_side: '',
        business_license: '',
        social_code: '',
        location: '',
        address: '',
        phone: '',
        code: '',
        reason: ''
      }
    },
  },
  data() {
    return {
      regionOptions: regionData,
      typeOptions: [
        { label: '个人认证', value: 0 },
        { label: '企业认证', value: 1 }
      ]
    }
  },
  methods: {
    mask(st, begin, end, char){
      if (st) {
        let str = st.toString()
        var fstStr = str.substring(0, begin)
        var scdStr = str.substring(begin, end)
        var lstStr = str.substring(end, str.length)
        var matchExp = /./g
        return fstStr + scdStr.replace(matchExp, char) + lstStr
      }
    },
    locationName(value) {
      let region = []
      let str = []
      this.regionOptions.forEach(element => {
        region.push(element)
        if (element.children) {
          element.children.forEach(v1 => {
            region.push(v1)
            if (v1.children) {
              v1.children.forEach(v2 => {
                region.push(v2)
              })
            }
          })
        }
      })
      if (value) {
        value.forEach((element, index) => {
          let data = ''
          data = region.find(v => {
            return element === v.value
          })
          str.push(data?.label)
        })
        return str.join('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-descriptions .label-title {
  width: 150px;
  text-align: right;
}
</style>
