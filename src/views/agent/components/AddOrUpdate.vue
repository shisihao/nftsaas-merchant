<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="form.name" :precision="0" :min="0" label="等级名称" clearable />
      </el-form-item>
      <el-form-item label="等级标签" prop="icon">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.icon" :src="form.icon && domin + form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          建议尺寸180px * 44px
        </div>
      </el-form-item>

      <el-form-item label="自购达到(元)" prop="condition.self">
        <el-input-number v-model="form.condition.self" controls-position="right" :precision="2" :min="0" clearable />
      </el-form-item>
      <el-form-item label="团队业绩达到(元)" prop="condition.team">
        <el-input-number v-model="form.condition.team" controls-position="right" :precision="2" :min="0" clearable />
      </el-form-item>
      <el-form-item label="销售业绩达到(元)" prop="condition.sales">
        <el-input-number v-model="form.condition.sales" controls-position="right" :precision="2" :min="0" clearable />
      </el-form-item>
      <h3>享受权益</h3>
      <div v-for="(value, index) in zoneOptions" :key="index">
        <el-divider content-position="left"><svg-icon :icon-class="value.value" /> {{ value.label }} </el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="直推(%)" :prop="`equities.${value.value}.sales`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.equities[value.value].sales" controls-position="right" :precision="2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="间推(%)" :prop="`equities.${value.value}.indirect`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.equities[value.value].indirect" controls-position="right" :precision="2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="团队(%)" :prop="`equities.${value.value}.team`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.equities[value.value].team" controls-position="right" :precision="2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分红回本前(%)" :prop="`equities.${value.value}.bonus_before`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.equities[value.value].bonus_before" controls-position="right" :precision="2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分红回本后(%)" :prop="`equities.${value.value}.bonus_after`" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]">
              <el-input-number v-model="form.equities[value.value].bonus_after" controls-position="right" :precision="2" :min="0" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="notice">
      说明：
      <p>直推奖励举例，比如：A的直推用户B下单购买商品，存储价格为n元，则A获得n*配置百分比的直推奖励，以支付方式的形式发放现金/USDT奖励</p>
      <p>间推奖励举例，比如：A的间推用户C下单购买商品，存储价格为n元，则A获得n*配置百分比的间推奖励，以支付方式的形式发放现金/USDT奖励</p>
      <b>分红奖励：每次分发收益对应市场等级获得团队总体订单工作分发数量(在期数管理-分发中)的对应百分比分红奖励，FIL为25可用和75锁仓，线性释放到可用部分(APP内只结算两级，剩余奖励流水请到奖励流水中查看)</b>
      <p>团队奖励：伞下订单金额的百分比做级差制度(APP内只结算两级，剩余奖励流水请到奖励流水中查看)</p>
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
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/agent'
import CustomUpload from '@/components/Upload/CustomUpload'
import { zoneOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      zoneOptions: zoneOptions.slice(1),
      form: {
        id: 0,
        name: '',
        icon: '',
        condition: {
          self: 0,
          team: 0,
          sales: 0
        },
        equities: {
          fil: {
            bonus_after: 0,
            bonus_before: 0,
            indirect: 0,
            sales: 0,
            team: 0
          },
          btc: {
            bonus_after: 0,
            bonus_before: 0,
            indirect: 0,
            sales: 0,
            team: 0
          },
          xch: {
            bonus_after: 0,
            bonus_before: 0,
            indirect: 0,
            sales: 0,
            team: 0
          },
          eth: {
            bonus_after: 0,
            bonus_before: 0,
            indirect: 0,
            sales: 0,
            team: 0
          }
        },
        sales_commission: 0,
        custody_reward: 0,
        agent_reward: 0
      },
      roleOptions: [],
      rules: {
        name: [
          { required: true, message: '代等级名称不能为空', trigger: ['blur', 'change'] }
        ],
        icon: [
          { required: true, message: '等级标签不能为空', trigger: ['blur', 'change'] }
        ],
        'condition.self': [
          { required: true, message: '自购不能为空', trigger: ['blur', 'change'] }
        ],
        'condition.team': [
          { required: true, message: '团队业绩不能为空', trigger: ['blur', 'change'] }
        ],
        'condition.sales': [
          { required: true, message: '售业绩不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.visible = false
              this.$message.success(msg)
              this.$emit('refreshList')
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.icon = response
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    }
  }
}
</script>

<style scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  display: block;
}
.el-input-number {
  width: 150px;
}
::v-deep .el-dialog {
  width: 1000px;
}
</style>
