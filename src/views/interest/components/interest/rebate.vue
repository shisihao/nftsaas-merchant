<template>
  <div>
    <el-form-item
      label="权益类型"
      prop="interests.rebate.type"
      :rules="{
        required: true,
        message: '请选择权益类型',
        trigger: ['blur', 'change'],
      }"
    >
      <el-select
        v-model="form.interests.rebate.type"
        clearable
        :disabled="!!form.id && !!oldCheckLists.find((v) => v === 'rebate')"
        @change="onChangeType('rebate')"
      >
        <el-option
          v-for="(item1, index1) in JSON.parse(priorItemOptions).rebate"
          :key="index1"
          :label="item1.label"
          :value="item1.value"
        />
      </el-select>
    </el-form-item>
    <div v-if="['once'].includes(form.interests.rebate.type)">
      <el-form-item
        label="权益次数"
        prop="interests.rebate.num"
        :rules="{
          required: true,
          message: '请输入权益次数',
          trigger: ['blur', 'change'],
        }"
      >
        <el-input-number
          v-model="form.interests.rebate.num"
          :min="1"
          :precision="0"
          label="权益次数"
        />
      </el-form-item>
    </div>
    <el-form-item v-if="form.interests.rebate.type === 'long'" label="是否开启">
      <el-switch
        v-model="form.interests.rebate.num"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item
      label="折扣"
      prop="interests.rebate.discount"
      :rules="{
        required: true,
        message: '请输入折扣',
        trigger: ['blur', 'change'],
      }"
    >
      <el-input-number
        v-model="form.interests.rebate.discount"
        :precision="0"
        :min="1"
        :max="100"
        placeholder="请输入折扣"
      />
    </el-form-item>
    <div class="notice">注意：折扣范围 1-100 ，输入88代表8.8折</div>
    <div v-if="form.interests.rebate.type === 'once'">
      <el-form-item
        label="有效时间"
        prop="interests.rebate.expire_time"
        :rules="{
          required: true,
          message: '请选择有效时间',
          trigger: ['blur', 'change'],
        }"
      >
        <el-date-picker
          v-model="form.interests.rebate.expire_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions0"
        />
      </el-form-item>
      <el-form-item
        label="是否销毁"
        prop="interests.rebate.is_destroy"
        :rules="{
          required: true,
          message: '请选择是否销毁',
          trigger: ['blur', 'change'],
        }"
      >
        <el-radio-group v-model="form.interests.rebate.is_destroy">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

    <div v-if="form.interests.rebate.type === 'appoint'">
      <el-form-item
        label="指定藏品"
        prop="interests.rebate.buy.goods"
        :rules="{
          validator: validateGoodAndBox,
          trigger: ['blur', 'change'],
        }"
      >
        <el-select
          v-model="form.interests.rebate.buy.goods"
          class="select-input"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索"
          :filter-method="filterMethodGoodsSelect"
        >
          <el-option
            v-for="(goodItem, goodIndex) in activeGoodsMetaOptions"
            :key="goodIndex"
            :label="goodItem.label"
            :value="goodItem.value"
          >
            <span>#{{ goodItem.value }}</span>
            <el-image
              class="good-img"
              fit="cover"
              :src="goodItem.image && domin + goodItem.image"
            />
            <span>
              {{ goodItem.label }}
            </span>
          </el-option>
          <div class="tips">默认展示部分数据，更多请搜索</div>
        </el-select>
      </el-form-item>
      <el-form-item
        label="指定盲盒"
        prop="interests.rebate.buy.box"
        :rules="{
          validator: validateGoodAndBox,
          trigger: ['blur', 'change'],
        }"
      >
        <el-select
          v-model="form.interests.rebate.buy.box"
          class="select-input"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索"
          :filter-method="filterMethodBoxSelect"
        >
          <el-option
            v-for="(boxItem, boxIndex) in activeBoxMetaOptions"
            :key="boxIndex"
            :label="boxItem.label"
            :value="boxItem.value"
          >
            <span>#{{ boxItem.value }}</span>
            <el-image
              class="good-img"
              fit="cover"
              :src="boxItem.image && domin + boxItem.image"
            />
            <span>
              {{ boxItem.label }}
            </span>
          </el-option>
          <div class="tips">默认展示部分数据，更多请搜索</div>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Rebate',
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          id: 0,
          interests: {}
        }
      }
    },
    oldCheckLists: {
      type: Array,
      default: () => []
    },
    priorItemOptions: {
      type: String,
      default: ''
    },
    goodsOptions: {
      type: Array,
      default: () => []
    },
    goodsRebateMetaOptions: {
      type: Array,
      default: () => []
    },
    boxOptions: {
      type: Array,
      default: () => []
    },
    issuerOptions: {
      type: Array,
      default: () => []
    },
    boxRebateMetaOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey),
      activeGoodsMetaOptions: [],
      activeBoxMetaOptions: []
    }
  },
  watch: {
    $props: {
      deep: true,
      handler() {
        this.activeGoodsMetaOptions = [
          ...this.goodsOptions.slice(0, 30),
          ...this.goodsRebateMetaOptions
        ]
        this.activeBoxMetaOptions = [
          ...this.boxOptions.slice(0, 30),
          ...this.boxRebateMetaOptions
        ]
      }
    }
  },

  methods: {
    onChangeType(val) {
      this.form.interests[val].buy.goods = []
      this.form.interests[val].buy.box = []
      this.form.interests[val].expire_time = ''
      if (this.form.interests[val].type === 'appoint') {
        this.form.interests[val].num = 1
      }
    },
    validateGoodAndBox(rule, value, callback) {
      const buy = this.form.interests[rule.field.split('.')[1]].buy
      if (buy.goods.length === 0 && buy.box.length === 0) {
        return callback(new Error('指定藏品和指定盲盒必选一个'))
      } else {
        return callback()
      }
    },
    filterMethodGoodsSelect(val) {
      if (val) {
        this.activeGoodsMetaOptions = [
          ...this.goodsOptions.filter((v) => v.label.indexOf(val) !== -1),
          ...this.goodsRebateMetaOptions
        ]
      } else {
        this.activeGoodsMetaOptions = [
          ...this.goodsOptions.slice(0, 30),
          ...this.goodsRebateMetaOptions
        ]
      }
    },
    filterMethodBoxSelect(val) {
      if (val) {
        this.activeBoxMetaOptions = [
          ...this.boxOptions.filter((v) => v.label.indexOf(val) !== -1),
          ...this.boxRebateMetaOptions
        ]
      } else {
        this.activeBoxMetaOptions = [
          ...this.boxOptions.slice(0, 30),
          ...this.boxRebateMetaOptions
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 200px;
}
.select-input {
  width: 100%;
}
.good-img {
  width: 30px;
  margin-left: 5px;
  height: 30px;
  vertical-align: middle;
  flex-shrink: 0;
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
  margin-left: 130px;
}
</style>
