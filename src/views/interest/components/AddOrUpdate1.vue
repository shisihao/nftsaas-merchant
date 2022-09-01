<template>
  <div>
    <el-dialog
      width="800px"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClose()"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
        label-position="left"
      >
        <el-form-item label="藏品" prop="goods_id">
          <el-select
            v-model="form.goods_id"
            filterable
            clearable
            placeholder="请输入关键字搜索"
            :disabled="!!form.id"
            :filter-method="filterMethodSelect"
          >
            <el-option
              v-for="(item, index) in interestGoodOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              <span>#{{ item.value }}</span>
              <el-image
                class="good-img"
                fit="cover"
                :src="item.image && domin + item.image"
              />
              <span>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权益说明" prop="intro">
          <el-input
            v-model="form.intro"
            type="textarea"
            :rows="4"
            show-word-limit
            maxlength="500"
            placeholder="权益说明"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择权益 (请勾选) " prop="">
          <el-checkbox-group v-model="checkLists">
            <el-checkbox
              v-for="(item, index) in priorOptions"
              :key="index"
              :label="item.value"
              :disabled="
                !!form.id && !!oldCheckLists.find((v) => v === item.value)
              "
              @change="onChangeCheckItem(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-tabs
          v-model="tabIndex"
          tab-position="left"
          @tab-remove="onRemoveTab"
        >
          <el-tab-pane
            v-for="item in checkLists"
            :key="item"
            :label="priorOptions.find((v) => v.value === item) && priorOptions.find((v) => v.value === item).label"
            :closable="!oldCheckLists.find((v) => v === item)"
            :name="item"
          >
            <el-form-item
              label="权益类型"
              :prop="'interests.' + item + '.type'"
              :rules="{
                required: true,
                message: '请选择权益类型',
                trigger: ['blur', 'change']
              }"
            >
              <el-select
                v-model="form.interests[item].type"
                clearable
                :disabled="!!form.id && !!oldCheckLists.find((v) => v === item)"
                @change="onChangeType(item)"
              >
                <el-option
                  v-for="(item1, index1) in priorItemOptions[item]"
                  :key="index1"
                  :label="item1.label"
                  :value="item1.value"
                />
              </el-select>
            </el-form-item>
            <!-- 1.除指定藏品以外的显示
            2.折扣购时，长期以外显示 -->
            <el-form-item
              v-if="(!['rebate', 'entity'].includes(item) && form.interests[item].type !== 'appoint') ||(item === 'rebate' && form.interests[item].type === 'once')"
              label="权益次数"
              :prop="'interests.' + item + '.num'"
              :rules="{
                required: true,
                message: '请输入权益次数',
                trigger: ['blur', 'change']
              }"
            >
              <el-input-number
                v-model="form.interests[item].num"
                :min="1"
                :precision="0"
                label="权益次数"
              />
            </el-form-item>
            <el-form-item
              v-if=" ['rebate', 'entity'].includes(item) && form.interests[item].type === 'long'"
              label="是否开启"
            >
              <el-switch
                v-model="form.interests[item].num"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <div v-if="['rebate', 'entity'].includes(item)">
              <el-form-item
                v-if="gradeType === 0"
                label="折扣"
                :prop="'interests.' + item + '.discount'"
                :rules="{
                  required: true,
                  message: '请输入折扣',
                  trigger: ['blur', 'change']
                }"
              >
                <el-input-number
                  v-model="form.interests[item].discount"
                  :precision="0"
                  :min="1"
                  :max="100"
                  placeholder="请输入折扣"
                />
              </el-form-item>
              <div class="notice">注意：折扣范围 1-100 ，输入88代表8.8折</div>

              <div v-if="item === 'entity'">
                <el-form-item label="类型">
                  <el-select v-model="gradeType" placeholder="请选择">
                    <el-option
                      v-for="itemType in gradeTypeOptions"
                      :key="itemType.value"
                      :label="itemType.label"
                      :value="itemType.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="gradeType === 1"
                  label="权益等级"
                  :prop="'interests.' + item + '.grade_id'"
                  :rules="{
                    required: true,
                    message: '请选择',
                    trigger: ['blur', 'change']
                  }"
                >
                  <el-select v-model="form.interests[item].grade_id" placeholder="请选择等级">
                    <el-option v-for="level in levelOptions" :key="level.id" :label="level.name" :value="level.id" />
                  </el-select>
                </el-form-item>
              </div>

            </div>
            <div v-if="form.interests[item].type === 'once'">
              <el-form-item
                label="有效时间"
                :prop="'interests.' + item + '.expire_time'"
                :rules="{
                  required: true,
                  message: '请选择有效时间',
                  trigger: ['blur', 'change']
                }"
              >
                <el-date-picker
                  v-model="form.interests[item].expire_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  :picker-options="pickerOptions0"
                  align="right"
                />
              </el-form-item>
            </div>

            <div v-if="form.interests[item].type === 'once'">
              <el-form-item
                label="是否销毁"
                :prop="'interests.' + item + '.is_destroy'"
                :rules="{
                  required: true,
                  message: '请选择是否销毁',
                  trigger: ['blur', 'change']
                }"
              >
                <el-radio-group v-model="form.interests[item].is_destroy">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="form.interests[item].type === 'appoint'">
              <el-form-item
                v-if="item !== 'entity'"
                label="指定藏品"
                :prop="'interests.' + item + '.buy.goods'"
                :rules="{
                  validator: validateGoodAndBox,
                  trigger: ['blur', 'change']
                }"
              >
                <el-select
                  v-model="form.interests[item].buy.goods"
                  class="select-input"
                  filterable
                  multiple
                  clearable
                >
                  <el-option
                    v-for="(goodItem, goodIndex) in goodsOptions"
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
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="item !== 'entity'"
                label="指定盲盒"
                :prop="'interests.' + item + '.buy.box'"
                :rules="{
                  validator: validateGoodAndBox,
                  trigger: ['blur', 'change']
                }"
              >
                <el-select
                  v-model="form.interests[item].buy.box"
                  class="select-input"
                  filterable
                  multiple
                  clearable
                >
                  <el-option
                    v-for="(boxItem, boxIndex) in boxOptions"
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
                </el-select>
              </el-form-item>
              <!-- 实体商品折扣购  -->
              <div v-if="item === 'entity'">
                <el-form-item
                  label="指定实体商品"
                  :prop="'interests.' + item + '.buy.entity_goods'"
                  :rules="{
                    validator: validateEntityGoods,
                    trigger: ['blur', 'change']
                  }"
                >
                  <el-select
                    v-model="form.interests[item].buy.entity_goods"
                    class="select-input"
                    popper-class="popover-box"
                    filterable
                    multiple
                    clearable
                    @change="onEntityGoods"
                  >
                    <el-option
                      v-for="(entityItem, entityIndex) in entityGoodsOptions"
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
                  v-for="(goodItem, goodIndex) in form.interests[item].buy.entity_goods"
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
                <div v-show="form.interests[item].buy.entity_goods.length > 0" class="notice">注意：请输入对应商品的折扣次数</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import {
  addOrUpdate,
  interestList,
  goodsList,
  entityGoodsList,
  gradeList
} from '@/api/interest'
import { interestsOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey),
      interestsOptions,
      visible: false,
      btnLoading: false,
      interestGoodOptions: [],
      interestGoodMetaOptions: [],
      goodsOptions: [],
      boxOptions: [],
      entityGoodsOptions: [],
      priorOptions: [],
      priorItemOptions: {},
      levelOptions: [], // 实体商品折扣购
      checkLists: [], // 权益
      oldCheckLists: [], // 编辑初始的权益
      tabIndex: '', // 当前选择的tab
      gradeType: 0, // 默认为折扣
      gradeTypeOptions: [
        { label: '折扣', value: 0 },
        { label: '等级', value: 1 }
      ],
      defaultItem: {
        // 默认子项
        type: '',
        num: 1,
        expire_time: '',
        is_destroy: 0,
        grade_id: '',
        discount: 1,
        buy: {
          goods: [],
          box: [],
          entity_goods: []
        }
      },
      box: 0,
      goods: 0,
      form: {
        id: 0,
        goods_id: '',
        intro: '',
        goodsFrequency: {}, // 商品折扣时的备用值
        interests: {
          /* prior: {
            type: '',
            num: 0,
            expire_time: '',
            is_destroy: 0,
            buy: {
              goods: [],
              box: []
            }
          } */
        }
      },
      rules: {
        goods_id: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        intro: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        is_destroy: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.interestLists()
      this.getEntityGoodsList()
      this.goodsLists(data)
      this.getGradeList()
      if (data) {
        this.form = JSON.parse(JSON.stringify(Object.assign(data, { goodsFrequency: {}})))
        this.oldCheckLists = this.checkLists = Object.keys(this.form.interests).map((v) => {
          return v
        })
        this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''

        // 实体商品折扣购
        if (this.checkLists.includes('entity')) {
          const countArrs = []
          const entityGoods = this.form.interests.entity.buy.entity_goods
          const numArr = entityGoods.reduce(function(prev, next) {
            prev[next.toString()] = prev[next.toString()] + 1 || 1
            countArrs.push({ prev })
            return prev
          }, {})
          for (const [key, value] of Object.entries(numArr)) {
            this.$set(this.form.goodsFrequency, key, value)
          }
          this.form.interests.entity.buy.entity_goods = [...new Set(entityGoods)]

          if (this.form.interests.entity?.grade_id) { // 返回对应类型选择
            this.gradeType = 1
          }
        }
      }
    },
    goodsLists(data) {
      goodsList()
        .then((response) => {
          this.interestGoodMetaOptions = response.data.interest_goods.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })

          this.goodsOptions = response.data.goods.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })

          this.boxOptions = response.data.box.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })

          if (data.goods_id) {
            this.interestGoodOptions.push({
              label: data.goods.name,
              value: data.goods.id
            })
          }
        })
        .catch(() => {})
    },
    interestLists() {
      interestList()
        .then((response) => {
          this.priorOptions = []
          Object.keys(response.data).forEach((v) => {
            this.priorOptions.push({
              label: response.data[v][0].name,
              value: v
            })

            this.priorItemOptions[v] = response.data[v].map((x) => {
              let label = this.interestsOptions.find(y => y.value === x.type)?.label
              if (x.label === 'entity' && x.type === 'appoint') {
                label = '指定商品'
              }
              return { label: label, value: x.type }
            })
          })
        })
        .catch(() => {})
    },
    getEntityGoodsList() {
      entityGoodsList()
        .then((response) => {
          this.entityGoodsOptions = response.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })
        })
        .catch(() => {})
    },
    getGradeList() {
      gradeList()
        .then((response) => {
          this.levelOptions = response.data
        })
    },
    filterMethodSelect(val) {
      if (val) {
        this.interestGoodOptions = this.interestGoodMetaOptions.filter(v => v.label.indexOf(val) !== -1)
      } else {
        this.interestGoodOptions = []
      }
    },
    validateGoodAndBox(rule, value, callback) {
      if (
        this.form.interests[rule.field.split('.')[1]].buy.goods.length === 0 &&
        this.form.interests[rule.field.split('.')[1]].buy.box.length === 0
      ) {
        callback(new Error('指定藏品和指定盲盒必选一个'))
      } else {
        callback()
      }
    },
    validateEntityGoods(rule, value, callback) {
      if (
        this.form.interests[rule.field.split('.')[1]].buy.entity_goods
          .length === 0
      ) {
        callback(new Error('请选择指定实体商品'))
      } else {
        callback()
      }
    },
    validateEntityGoodsNum(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入折扣次数'))
      } else {
        callback()
      }
    },
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
    onChangeCheckItem(val) {
      if (this.checkLists.includes(val.value)) {
        // 为true时 添加数据
        const item = JSON.parse(JSON.stringify(this.defaultItem))
        if (['rebate', 'entity'].includes(val.value)) {
          item.discount = 1
        }
        this.$set(this.form.interests, val.value, item)
        this.tabIndex = val.value
      } else {
        // 为false时 删除数据
        delete this.form.interests[val.value]
        this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''
      }
    },
    onRemoveTab(val) {
      this.checkLists.forEach((v, i) => {
        if (v === val) {
          this.checkLists.splice(i, 1)
        }
      })
      delete this.form.interests[val]
      this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''
    },
    onChangeType(val) {
      this.form.interests[val].buy.goods = []
      this.form.interests[val].buy.box = []
      if (this.form.interests[val].type === 'appoint') {
        this.form.interests[val].num = 1
      }

      if (this.form.interests[val].type !== 'long') {
        this.form.interests[val].expire_time = ''
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const data = JSON.parse(JSON.stringify(this.form))
          // 当有 实体商品折扣购 && 指定藏品 时
          if (data.interests?.entity?.type === 'appoint') {
            const entityGoodsArr = []
            for (const [key, value] of Object.entries(this.form.goodsFrequency)) {
              for (let i = 0; i < value; i++) {
                entityGoodsArr.push(parseInt(key))
              }
            }
            data.interests.entity.buy.entity_goods = entityGoodsArr
          }

          if (data.interests?.entity) { // 勾选实体商品折扣时 根据选择删除无效字段
            if (this.gradeType === 0) {
              delete data.interests.entity?.grade_id
            } else if (this.gradeType === 1) {
              delete data.interests.entity?.discount
            }
          }

          addOrUpdate(data)
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
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-input {
  width: 100%;
}
.el-input-number {
  width: 200px;
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
