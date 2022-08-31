<template>
  <div>
    <el-dialog title="认证信息" :visible.sync="visible">
      <identy-info :form="form">
        <template v-if="form.type === 1">
          <el-descriptions-item label="营业执照扫描">
            <el-image :src="domin + form.business_license" class="identity" fit="contain"></el-image>
          </el-descriptions-item>
        </template>

        <el-descriptions-item label="身份证正面">
          <el-image :src="domin + form.positive" class="identity" fit="contain"></el-image>
        </el-descriptions-item>
        <el-descriptions-item label="身份证反面">
          <el-image :src="domin + form.other_side" class="identity" fit="contain"></el-image>
        </el-descriptions-item>
      </identy-info>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, DominKey } from '@/utils/auth'
import IdentyInfo from './IdentyInfo'

export default {
  name: 'IdentificationInfo',
  components: { IdentyInfo },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      typeOptions: [
        { label: '个人认证', value: 0 },
        { label: '企业认证', value: 1 }
      ],
      form: {
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
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form = data
    }
  }
}
</script>

<style lang="scss" scoped>
.identity {
  width: 300px;
}
</style>
