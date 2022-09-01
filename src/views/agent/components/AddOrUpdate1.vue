<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="190px">
      <el-form-item label="代理商名称" prop="name">
        <el-input v-model="form.name" placeholder="代理商名称" clearable />
      </el-form-item>
      <el-divider v-if="oldFrom.condition ? oldFrom.condition.length > 0 : false" content-position="left">晋升条件</el-divider>

      <el-form-item v-if="['novice'].includes(oldFrom.level)" label="自购设备达标量(台)" prop="buy_sale">
        <el-input-number v-model="form.buy_sale" controls-position="right" :precision="0" :min="0" placeholder="自购设备达标量(台)" />
      </el-form-item>
      <el-form-item v-if="['bronze'].includes(oldFrom.level)" label="直推矿工数量(有效用户)" prop="buy_sale">
        <el-input-number v-model="form.buy_sale" controls-position="right" :precision="0" :min="0" placeholder="直推矿工数量(有效用户)" />
      </el-form-item>
      <el-form-item v-if="['bronze'].includes(oldFrom.level)" label="销售业绩" prop="total_performance">
        <el-input-number v-model="form.total_performance" controls-position="right" :precision="2" :min="0" placeholder="销售业绩" />
      </el-form-item>

      <el-form-item v-if="['copartner'].includes(oldFrom.level)" label="ETH工作收益提成(%)" prop="eth_sale_commission">
        <el-input-number v-model="form.eth_sale_commission" controls-position="right" :precision="2" :min="0" placeholder="ETH工作收益提成(%)" />
      </el-form-item>
      <el-form-item v-if="['copartner'].includes(oldFrom.level)" label="FIL工作收益提成(%)" prop="fil_sale_commission">
        <el-input-number v-model="form.fil_sale_commission" controls-position="right" :precision="2" :min="0" placeholder="FIL工作收益提成(%)" />
      </el-form-item>
      <el-form-item v-if="['copartner'].includes(oldFrom.level)" label="BTC工作收益提成(%)" prop="btc_sale_commission">
        <el-input-number v-model="form.btc_sale_commission" controls-position="right" :precision="2" :min="0" placeholder="BTC工作收益提成(%)" />
      </el-form-item>
      <el-form-item v-if="['copartner'].includes(oldFrom.level)" label="工作平级奖励(%)" prop="team_commission">
        <el-input-number v-model="form.team_commission" controls-position="right" :precision="2" :min="0" placeholder="平级奖励(%)" />
      </el-form-item>

    </el-form>
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
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/agent'

export default {
  name: 'AddOrUpdate',

  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      scheme: 0,
      form: {
        id: 0,
        name: '',
        buy_sale: 0,
        total_performance: 0,
        eth_sale_commission: 0,
        fil_sale_commission: 0,
        btc_sale_commission: 0,
        team_commission: 0
      },
      oldFrom: {},
      rules: {
        name: [
          { required: true, message: '代理商级别名称不能为空', trigger: ['blur', 'change'] }
        ],
        buy_sale: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '必须为数字', trigger: ['blur', 'change'] }
        ],
        total_performance: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '必须为数字', trigger: ['blur', 'change'] }
        ],
        sale_commission: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '必须为数字', trigger: ['blur', 'change'] }
        ],
        team_commission: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '必须为数字', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.oldFrom = data
        const newAgent = {}
        data.condition.forEach(v => {
          const key = v.key.replace(':', '_')
          Object.assign(newAgent, { [key]: v.value })
        })

        data.equities.forEach(v => {
          // let key = v.key.replace(':','_')
          Object.assign(newAgent, { [v.key]: v.value })
        })

        this.form = Object.assign({ id: data.id, name: data.name }, newAgent)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true

          const form = Object.assign({}, this.form)
          const newData = { id: this.form.id, condition: [], equities: [] }

          for (const k in form) {
            if (!form[k] || ['id', 'name'].includes(k)) {
              delete form[k]
            } else if (['buy_sale', 'total_performance', 'train_region'].includes(k)) {
              newData.condition.push({ key: k.replace('_', ':'), value: form[k] })
            } else {
              newData.equities.push({ key: k, value: form[k] })
            }
          }

          addOrUpdate(newData)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.$emit('refreshList')
            })
            .catch(() => {

            })
            .finally(() => {
              this.visible = false
            })
        }
      })
    },
    onClose() {
      this.btnLoading = false
      this.$reset()
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog {
  width: 800px;
}
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.notice span {
  color: #E6A23C;
}
</style>
