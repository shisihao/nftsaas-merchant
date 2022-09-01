<template>
  <div>
    <el-form-item
      label="权益类型"
      :prop="'interests.entity.type'"
      :rules="{
        required: true,
        message: '请选择权益类型',
        trigger: ['blur', 'change']
      }"
    >
      <el-select
        v-model="form.interests.entity.type"
        clearable
        @change="onChangeType('entity')"
      >
        <el-option
          v-for="(item1, index1) in JSON.parse(priorItemOptions).entity"
          :key="index1"
          :label="item1.label"
          :value="item1.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.interests.entity.type === 'long'"
      label="是否开启"
      :prop="'interests.entity.num'"
    >
      <el-switch
        v-model="form.interests.entity.num"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="类型" prop="gradeTypeSync">
      <el-select v-model="gradeTypeSync" placeholder="请选择">
        <el-option
          v-for="itemType in gradeTypeOptions"
          :key="itemType.value"
          :label="itemType.label"
          :value="itemType.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="gradeTypeSync === 0"
      label="折扣"
      :prop="'interests.entity.discount'"
      :rules="{
        required: true,
        message: '请输入折扣',
        trigger: ['blur', 'change']
      }"
    >
      <el-input-number
        v-model="form.interests.entity.discount"
        :precision="0"
        :min="1"
        :max="100"
        placeholder="请输入折扣"
      />
    </el-form-item>
    <el-form-item
      v-if="gradeTypeSync === 1"
      label="权益等级"
      :prop="'interests.entity.grade_id'"
      :rules="{
        required: true,
        message: '请选择',
        trigger: ['blur', 'change']
      }"
    >
      <el-select v-model="form.interests.entity.grade_id" placeholder="请选择等级">
        <el-option v-for="level in levelOptions" :key="level.id" :label="level.name" :value="level.id" />
      </el-select>
    </el-form-item>
    <div class="notice">注意：折扣范围 1-100 ，输入88代表8.8折</div>
    <div v-if="form.interests.entity.type === 'appoint'">
      <el-form-item
        label="有效时间"
        :prop="'interests.entity.expire_time'"
        :rules="{
          required: true,
          message: '请选择有效时间',
          trigger: ['blur', 'change']
        }"
      >
        <el-date-picker
          v-model="form.interests.entity.expire_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
          align="right"
        />
      </el-form-item>
      <el-form-item
        label="是否销毁"
        :prop="'interests.entity.is_destroy'"
        :rules="{
          required: true,
          message: '请选择是否销毁',
          trigger: ['blur', 'change']
        }"
      >
        <el-radio-group v-model="form.interests.entity.is_destroy">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="指定实体商品"
        :prop="'interests.entity.buy.entity_goods'"
        :rules="{
          validator: validateEntityGoods,
          trigger: ['blur', 'change']
        }"
      >
        <el-select
          v-model="form.interests.entity.buy.entity_goods"
          class="select-input"
          popper-class="popover-box"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索"
          :filter-method="filterMethodShopSelect"
          @change="onEntityGoods"
        >
          <el-option
            v-for="(entityItem, entityIndex) in activeEntityGoodsOptions"
            :key="entityIndex"
            :label="entityItem.label"
            :value="entityItem.value"
          >
            <span>#{{ entityItem.value }}</span>
            <el-image
              class="good-img"
              fit="cover"
              :src="entityItem.image && domin + entityItem.image"
            />
            <span>
              {{ entityItem.label }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(goodItem, goodIndex) in form.interests.entity.buy.entity_goods"
        :key="goodIndex"
        :prop="`goodsFrequency.${goodItem}`"
        class="goods-frequency"
        :label="entityGoodsOptions.find((v) => v.value === goodItem) && entityGoodsOptions.find((v) => v.value === goodItem).label"
        :rules="[
          {
            required: true,
            message: '请输入',
            trigger: ['blur', 'change']
          },
          {
            validator: validateEntityGoodsNum,
            trigger: ['blur', 'change']
          }
        ]"
      >
        <el-input-number
          v-model="form.goodsFrequency[goodItem]"
          :precision="0"
          :min="1"
          placeholder="请输入折扣次数"
        />
      </el-form-item>
      <div v-show="form.interests.entity.buy.entity_goods.length > 0" class="notice">注意：请输入对应商品的折扣次数</div>
    </div>
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Entity',
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
    entityGoodsOptions: {
      type: Array,
      default: () => []
    },
    entityMetaGoodsOptions: {
      type: Array,
      default: () => []
    },
    levelOptions: {
      type: Array,
      default: () => []
    },
    gradeType: {
      type: Number,
      default: 0
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
      gradeTypeOptions: [
        { label: '折扣', value: 0 },
        { label: '等级', value: 1 }
      ],
      activeEntityGoodsOptions: this.entityMetaGoodsOptions
    }
  },
  computed: {
    gradeTypeSync: {
      get() {
        return this.gradeType
      },
      set(val) {
        this.$emit('update:gradeType', val)
      }
    }
  },
  methods: {
    onEntityGoods(val) {
      // 为商品添加默认次数
      let goods = Object.keys(this.form.goodsFrequency)

      // 没有默认的 就添加
      for (const v of val) {
        if (!goods.includes(v.toString())) {
          this.$set(this.form.goodsFrequency, v, 1)
        }
      }

      goods = new Set(Object.keys(this.form.goodsFrequency))
      const currentGoods = new Set(val)
      // 差级
      const difference = new Set(
        [...goods].filter((x) => !currentGoods.has(parseInt(x)))
      )
      const differenceArr = [...difference]
      for (const v of differenceArr) {
        delete this.form.goodsFrequency[v]
      }
    },
    filterMethodShopSelect(val) {
      this.activeEntityGoodsOptions = this.form.interests.entity.buy.entity_goods.map(v => {
        return this.entityGoodsOptions.find(x => x.value === v)
      })
      if (val) {
        this.activeEntityGoodsOptions.push(...this.entityGoodsOptions.filter((v) => v.label.indexOf(val) !== -1 && !this.form.interests.entity.buy.entity_goods.includes(v.value)))
      }
    },
    validateEntityGoods(rule, value, callback) {
      if (
        this.form.interests[rule.field.split('.')[1]].buy.entity_goods
          .length === 0
      ) {
        return callback(new Error('请选择指定实体商品'))
      } else {
        return callback()
      }
    },
    validateEntityGoodsNum(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入折扣次数'))
      } else {
        return callback()
      }
    },
    onChangeType(val) {
      this.form.interests[val].buy.goods = []
      this.form.interests[val].buy.box = []
      if (this.form.interests[val].type === 'appoint') {
        this.form.interests[val].num = 1
      }

      if (this.form.interests[val].type === 'long') {
        this.form.interests[val].expire_time = ''
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
.goods-frequency {
  ::v-deep .el-form-item__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
