<template>
  <div>
    <el-form-item
      label="权益类型"
      prop="interests.topic.type"
      :rules="{
        required: true,
        message: '请选择权益类型',
        trigger: ['blur', 'change']
      }"
    >
      <el-select
        v-model="form.interests.topic.type"
        clearable
        :disabled="!!form.id && !!oldCheckLists.find((v) => v === 'topic')"
        @change="onChangeType(item)"
      >
        <el-option
          v-for="(item1, index1) in JSON.parse(priorItemOptions).topic"
          :key="index1"
          :label="item1.label"
          :value="item1.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.interests.topic.type !== 'appoint'"
      label="权益次数"
      prop="interests.topic.num"
      :rules="{
        required: true,
        message: '请输入权益次数',
        trigger: ['blur', 'change']
      }"
    >
      <el-input-number
        v-model="form.interests.topic.num"
        :min="0"
        :precision="0"
        label="权益次数"
      />
    </el-form-item>

    <div v-if="form.interests.topic.type === 'once'">
      <el-form-item
        label="有效时间"
        prop="interests.topic.expire_time"
        :rules="{
          required: true,
          message: '请选择有效时间',
          trigger: ['blur', 'change']
        }"
      >
        <el-date-picker
          v-model="form.interests.topic.expire_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          :picker-options="pickerOptions0"
          align="right"
        />
      </el-form-item>
      <el-form-item
        label="是否销毁"
        prop="interests.topic.is_destroy"
        :rules="{
          required: true,
          message: '请选择是否销毁',
          trigger: ['blur', 'change']
        }"
      >
        <el-radio-group v-model="form.interests.topic.is_destroy">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Topic',
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
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey)
    }
  },
  methods: {
    onChangeType(val) {
      this.form.interests[val].buy.goods = []
      this.form.interests[val].buy.box = []
      if (this.form.interests[val].type === 'appoint') {
        this.form.interests[val].num = 1
      }

      if (this.form.interests[val].type !== 'long') {
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
</style>
