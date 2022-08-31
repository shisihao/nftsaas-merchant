<template>
  <el-dialog top="30px" :width="bLevelVisible ? '1000px' : '600px'" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-row :gutter="20">
      <el-col :span="bLevelVisible ? 12 : 24">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
          <el-form-item label="期数" prop="name">
            <el-input v-model="form.name" placeholder="期数" clearable maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="所属专区" prop="type">
            <el-select v-model="form.type" @change="form.spec_id = '';form.cate = 0;form.group_id = 0;bLevelVisible = false;">
              <el-option v-for="item in zoneOptions" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <div v-if="['fil'].includes(form.type)" class="notice">
              <span style="color: #409eff;cursor: pointer;" @click="onBLevel">B端期数概览</span>
            </div>
          </el-form-item>
          <el-form-item v-if="['fil'].includes(form.type)" label="节点号">
            <el-input v-model="form.node" placeholder="节点号" clearable maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item v-if="['fil'].includes(form.type)" label="期数类型" prop="cate">
            <el-select v-model="form.cate">
              <el-option v-for="item in catesOptions" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="['fil'].includes(form.type)" label="规格" prop="spec_id">
            <el-radio-group v-model="form.spec_id" :loading="specLoading">
              <el-radio
                v-for="item in specOptions"
                :key="item.id"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
            <div class="notice">
              注意：如还没有规格，优先规格管理中<span style="color: #409eff;cursor: pointer;" @click="onGoto('/specs')">创建规格</span>
            </div>
          </el-form-item>
          <el-form-item v-if="form.type" label="分组" prop="group_id">
            <el-select v-model="form.group_id">
              <el-option v-for="item in groupOptions.filter(v => v.zone === form.type || v.value === 0 )" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <div class="notice">
              注意：如需期数分组请先到期数分组管理中创建分组
            </div>
          </el-form-item>
          <template v-if="['fil'].includes(form.type)">
            <el-divider content-position="left">以下配置仅适用于IPFS专区</el-divider>
            <el-form-item label="可提现金额比例" prop="withdrawable">
              <el-input-number v-model="form.withdrawable" :min="0" placeholder="可提现金额比例" clearable />
            </el-form-item>
            <el-form-item label="锁仓金额比例" prop="lock">
              <el-input-number v-model="form.lock" :min="0" placeholder="锁仓金额比例" clearable />
            </el-form-item>
            <el-form-item label="抵押金额比例" prop="pawn">
              <el-input-number v-model="form.pawn" :min="0" placeholder="抵押金额比例" clearable />
            </el-form-item>
            <el-form-item label="冻结金额比例" prop="frozen">
              <el-input-number v-model="form.frozen" :min="0" placeholder="冻结金额比例" clearable />
            </el-form-item>
            <el-form-item>
              <div class="notice">
                注意：以上比例配置和为 100
              </div>
            </el-form-item>
            <div v-if="[0].includes(form.cate)">
              <el-divider content-position="left">归还利息</el-divider>
              <el-form-item label="应还利息比例" prop="should_radio">
                <el-input-number v-model="form.should_radio" :min="0" placeholder="应还利息比例" />
              </el-form-item>
              <el-form-item label="欠款利息比例" prop="arrears_radio">
                <el-input-number v-model="form.arrears_radio" :min="0" placeholder="欠款利息比例" />
              </el-form-item>
              <el-form-item>
                <div class="notice">
                  注意：以上比例配置和为 100
                </div>
              </el-form-item>
              <el-divider />
              <el-form-item label="利息(%)" prop="interest">
                <el-input-number v-model="form.interest" :min="0" placeholder="利息" clearable />
                <div class="notice">
                  注：根据比例计算的利息数量会以每日1/2应还利息和1/2累计欠款利息的形式分发给用户
                </div>
              </el-form-item>
            </div>
          </template>
          <el-form-item label="运营维护费回本前(%)" prop="before">
            <el-input-number v-model="form.before" :min="0" placeholder="运营维护费回本前(%)" clearable />
          </el-form-item>
          <el-form-item label="运营维护费回本后(%)" prop="after">
            <el-input-number v-model="form.after" :min="0" placeholder="运营维护费回本后(%)" clearable />
            <div class="notice">
              注意：每次分发收益会对应扣除配置比例的运营维护费
            </div>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :precision="0" />
            <div class="notice">
              注意：序号越大，排序越前
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
              {{ $t('table.confirm') }}
            </el-button>
            <el-button @click="visible = false">
              {{ $t('table.cancel') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if="bLevelVisible" :span="12">
        <div style="position: absolute;height: 100%;background-color: #F5F7FA;border-radius: 6px;">
          <b-level
            v-if="bLevelVisible"
            ref="bLevel"
            @onCloseBLevel="onCloseBLevel"
          />
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addOrUpdate } from '@/api/fil-level'
import { powerGroupList } from '@/api/group'
import { dataList as spec } from '@/api/spec'
import { zoneOptions, catesOptions } from '@/utils/explain'
import { validUsername } from '@/utils/validate'
import BLevel from './BLevel'

export default {
  name: 'AddOrUpdate',
  components: { BLevel },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('只能是中英文及数字'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      specLoading: false,
      bLevelVisible: false,
      specOptions: [],
      groupOptions: [
        { value: 0, label: '无', zone: '' }
      ],
      zoneOptions: zoneOptions.slice(1),
      catesOptions: catesOptions.slice(1),
      form: {
        id: 0,
        group_id: 0,
        node: '',
        name: '',
        spec_id: '',
        type: '',
        interest: 0,
        withdrawable: 0,
        lock: 0,
        pawn: 0,
        frozen: 0,
        cate: 0,
        before: 0,
        after: 0,
        sort: 0,
        should_radio: 0,
        arrears_radio: 0
      },
      rules: {
        group_id: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        node: [
          { required: true, message: '节点号不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '期数不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        cate: [
          { required: true, message: '期数类型不能为空', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '所属专区不能为空', trigger: ['blur', 'change'] }
        ],
        spec_id: [
          { required: true, message: '规格不能为空', trigger: ['blur', 'change'] }
        ],
        interest: [
          { required: true, message: '利息不能为空', trigger: ['blur', 'change'] }
        ],
        withdrawable: [
          { required: true, message: '可提现金额比例不能为空', trigger: ['blur', 'change'] }
        ],
        lock: [
          { required: true, message: '锁仓金额比例不能为空', trigger: ['blur', 'change'] }
        ],
        pawn: [
          { required: true, message: '抵押金额比例不能为空', trigger: ['blur', 'change'] }
        ],
        frozen: [
          { required: true, message: '冻结金额比例不能为空', trigger: ['blur', 'change'] }
        ],
        before: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        after: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        should_radio: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        arrears_radio: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getSpec()
      this.getGroup()
      if (data) {
        if (data.extend) {
          this.form = Object.assign({}, this.form, data, { ...data.extend })
        } else {
          this.form = Object.assign({}, this.form, data)
        }
        this.form.spec_id = parseInt(this.form.spec_id)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    getSpec() {
      this.specLoading = true
      spec({ limit: 1000 })
        .then(response => {
          this.specOptions = response.data.data.map(v => {
            return {
              value: v.id,
              label: v.name
            }
          })
        })
        .catch(() => {
        })
        .finally(() => {
          this.specLoading = false
        })
    },
    getGroup() {
      powerGroupList()
        .then(response => {
          const groupList = response.data.map(v => {
            return {
              zone: v.zone,
              value: v.id,
              label: v.name
            }
          })
          this.groupOptions.push(...groupList)
        })
        .catch(() => {})
        .finally(() => {})
    },
    onClose() {
      this.$reset()
    },
    onGoto(path) {
      this.$router.push({ path: path })
    },
    onBLevel() {
      this.bLevelVisible = !this.bLevelVisible
      if (this.bLevelVisible) {
        this.$nextTick(() => {
          this.$refs.bLevel && this.$refs.bLevel.init(this.form)
        })
      }
    },
    onCloseBLevel(data) {
      this.bLevelVisible = data
    }
  }
}
</script>
<style scoped>
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.container {
    display: flex;
}
.sidebar , .content {
    flex: 1 0 auto;
}
.sidebardiv {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    overflow: auto;
    padding: 0 8px 0 8px;
}
</style>
