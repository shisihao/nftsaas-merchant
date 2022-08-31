<template>
  <el-dialog :title="setType ? '批量结算' : '奖励结算'" :visible.sync="visible" @closed="onClose()">
    
    <p>
      奖励类型：{{ data.type | paraphrase(typeOptions) }}
    </p>
    <p>
      资产类型：{{ data.currency | paraphrase(currencyReportOptions) }}
    </p>
    <p>
      数量：{{ data.amount }}
    </p>
    <p v-if="setType">
      时间：{{ data.time }}
    </p>
    <div v-else>
      <p>
        奖励用户：
        <div v-if="data.user">
          <el-avatar :key="data.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="data.user.avatar ? (domin + data.user.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              #{{ data.user.id }}
              <el-divider direction="vertical"></el-divider>
              {{ data.user.name }}
              <span v-if="data.user.certification">
                <el-divider direction="vertical"></el-divider>
                <el-tag effect="plain">{{ data.user.certification.name }}</el-tag>
              </span>
            </div>
            <div>
              {{ data.user.phone || data.user.email}}
            </div>
            <div>
            </div>
          </div>
        </div>
      </p>
      <p>
        来源订单：
        <div v-if="data.order">
          <div>
            {{ data.order.order_no }}
          </div>
          <div>
            <svg-icon :icon-class="data.order.pay_type" /> {{ data.order.pay_price }}
          </div>
        </div>
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>

</template>
<script>
import { setSettlement } from '@/api/sale'
import { getToken, DominKey } from '@/utils/auth'
import { currencyReportOptions } from '@/utils/explain'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'Settlement',
  data() {
    return {
      visible: false,
      btnLoading: false,
      setType: false,
      form: {
        selectValue: []
      },
      data: {},
      currencyReportOptions,
      domin: getToken(DominKey),
      typeOptions: [
        { label: '全部', value: '' },
        { label: '直推销售奖励', value: 'sales_commission' },
        { label: '间推销售奖励', value: 'indirect_sales_commission' },
        { label: '团队销售奖励', value: 'team_sales_commission' },
        { label: '分红奖励', value: 'miner_bonus' }
      ]
    }
  },
  methods: {
    init(data, search) {
      this.visible = true
      if(Array.isArray(data)) {
        this.setType = true
        this.data = {
          currency: search.currency,
          type: search.type,
          amount: 0,
          time: `${search.start_time} --- ${search.end_time}`
        }
        this.form.selectValue = data.map(v => {
          this.data.amount = new BigNumber(this.data.amount).plus(v.amount || 0)
          return v.id
        })
      } else {
        this.form.selectValue = data.id
        console.log(data)
        this.data = data
      }
    },
    onClose() {
      this.$reset('form', false)
    },
    onFormSubmit() {
      this.btnLoading = true
      setSettlement({ ids: this.form.selectValue })
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
