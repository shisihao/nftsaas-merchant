<template>
  <el-dialog title="确认分发" :visible.sync="visible">
    <p>
      所属专区：{{ form.type | paraphrase(zoneOptions) }}
    </p>
    <p v-if="form.node && ['fil'].includes(form.type)">
      节点号：{{ form.node }}
    </p>
    <p>
      期数：{{ form.name }}
    </p>
    <p v-if="form.cate >= 0 && ['fil'].includes(form.type)">
      期数类型：{{ form.cate | paraphrase(catesOptions) }}
    </p>
    <p v-if="['fil'].includes(form.type)">
      规格：{{ form.specs.name }}
    </p>
    <p>
      有效算力：{{ data.mingSpec }}
    </p>
    <p v-if="['eth', 'btc'].includes(form.currency)">
      欠费停机算力：{{ data.arrearsSpec }}
    </p>
    <p>
      订单总算力：{{ Number(data.mingSpec) + Number(data.arrearsSpec) }}
    </p>
    <div v-if="form.currency === 'fil'">
      <div v-if="form.cate === 1">
        <p>
          已收取GAS：{{ data.sync_use_gas }}
        </p>
        <p>
          已收取质押：{{ data.sync_use_pledge }}
        </p>
      </div>
      <div v-if="form.cate === 2">
        <p>
          已分发同步资产GAS：{{ data.sync_use_gas }}
        </p>
        <p>
          已分发同步资产质押：{{ data.sync_use_pledge }}
        </p>
        <p>
          已分发不同步资产GAS：{{ data.unsync_use_gas }}
        </p>
        <p>
          已分发不同步资产质押：{{ data.unsync_use_pledge }}
        </p>
        <p>
          是否同步资产：{{ form.sync_wallet ? '是' : '否' }}
        </p>
      </div>
    </div>
    <p>
      分发总数：{{ form.amount }}
    </p>
    <p v-if="['fil', 'xch'].includes(form.currency)">
      封装总数：{{ form.fz_num }}
    </p>
    <div v-if="['fil'].includes(form.type)">
      <p>
        {{ `${form.cate === 0 ? '借贷' : '使用'}质押数量` }}：{{ form.pledge }}
      </p>
      <p>
        {{ `${form.cate === 0 ? '借贷' : '使用'}gas数量` }}：{{ form.gas }}
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
import { catesOptions, zoneOptions } from '@/utils/explain'
import { addPeriod } from '@/api/fil-level'

export default {
  name: 'DialogIssue',
  inject: ['refreshList'],
  data() {
    return {
      visible: false,
      btnLoading: false,
      catesOptions,
      zoneOptions: zoneOptions.slice(1),
      data: {
        mingSpec: 0,
        arrearsSpec: 0,
        collect_gas: 0,
        collect_pledge: 0,
        sync_use_gas: 0,
        sync_use_pledge: 0,
        unsync_use_gas: 0,
        unsync_use_pledge: 0
      },
      form: {
        id: 0,
        period_id: 0,
        node: '',
        name: '',
        cate: '',
        type: '',
        specs: {},
        order_count: 0,
        amount: 0,
        currency: '',
        fz_num: 0,
        pledge: 0,
        gas: 0,
        sync_wallet: 0
      }
    }
  },
  methods: {
    init(formData, data) {
      this.visible = true
      this.form = formData
      this.data = data
    },
    onFormSubmit() {
      this.btnLoading = true
      addPeriod(this.form)
        .then(() => {
          this.visible = false
          this.$message.success('分发成功！')
          this.$emit('addOrUpdateVisable')
          setTimeout(() => {
            this.refreshList()
          }, 1000)
        })
        .catch(() => {
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
