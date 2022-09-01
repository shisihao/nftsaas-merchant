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
            class="select-input"
            filterable
            clearable
            placeholder="请输入关键字搜索"
            :disabled="!!form.id"
            :filter-method="filterMethodSelect"
          >
            <el-option
              v-for="(item, index) in interestGoodMetaOptions"
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
            <!-- 优先购 -->
            <prior
              v-if="tabIndex === 'prior'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :goods-prior-meta-options="goodsPriorMetaOptions"
              :box-options="boxOptions"
              :issuer-options="issuerOptions"
              :box-prior-meta-options="boxPriorMetaOptions"
            />
            <!-- 上链话题 -->
            <topic
              v-if="tabIndex === 'topic'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
            />
            <!-- 转赠 -->
            <give
              v-if="tabIndex === 'give'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
            />
            <!-- 折扣购 -->
            <rebate
              v-if="tabIndex === 'rebate'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :goods-rebate-meta-options="goodsRebateMetaOptions"
              :box-options="boxOptions"
              :issuer-options="issuerOptions"
              :box-rebate-meta-options="boxRebateMetaOptions"
            />
            <!-- 实体商品折扣购 -->
            <entity
              v-if="tabIndex === 'entity'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :grade-type.sync="gradeType"
              :entity-goods-options="entityGoodsOptions"
              :entity-meta-goods-options="entityMetaGoodsOptions"
              :level-options="levelOptions"
            />
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
  gradeList,
  issuerList
} from '@/api/interest'
import { interestsOptions } from '@/utils/explain'
import prior from './interest/prior'
import topic from './interest/topic'
import give from './interest/give'
import rebate from './interest/rebate'
import entity from './interest/entity'

export default {
  name: 'AddOrUpdate',
  components: { prior, topic, give, rebate, entity },
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
      goodsPriorMetaOptions: [],
      goodsRebateMetaOptions: [],

      boxOptions: [],
      boxPriorMetaOptions: [],
      boxRebateMetaOptions: [],

      entityGoodsOptions: [],
      entityMetaGoodsOptions: [],

      priorOptions: [],
      issuerOptions: [], // 指定发行方列表
      priorItemOptions: {}, // 权益类型
      levelOptions: [], // 实体商品折扣购
      checkLists: [], // 权益
      oldCheckLists: [], // 编辑初始的权益
      tabIndex: '', // 当前选择的tab
      gradeType: 0, // 默认为折扣
      defaultItem: {
        // 默认子项
        type: '',
        num: 0,
        expire_time: '',
        is_destroy: 0,
        grade_id: '', // 权益等级
        discount: 1,
        buy: {
          goods: [],
          box: [],
          entity_goods: []
        }
      },
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
      this.getEntityGoodsList(data)
      this.goodsLists(data)
      this.getGradeList()
      this.getIssuerList()
      if (data) {
        this.form = JSON.parse(
          JSON.stringify(Object.assign(data, { goodsFrequency: {}}))
        )
        this.oldCheckLists = this.checkLists = Object.keys(
          this.form.interests
        ).map((v) => {
          return v
        })
        this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''

        // 实体商品折扣购
        if (this.oldCheckLists.includes('entity')) {
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
          this.form.interests.entity.buy.entity_goods = [
            ...new Set(entityGoods)
          ]

          if (this.form.interests.entity?.grade_id) {
            // 返回对应类型选择
            this.gradeType = 1
          }
        }
      }
    },
    getIssuerList() {
      issuerList().then((response) => {
        this.issuerOptions = response.data.map((v, index) => {
          return {
            label: index,
            value: v
          }
        })
      })
    },
    goodsLists(data) {
      goodsList()
        .then((response) => {
          this.interestGoodOptions = response.data.interest_goods.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          }
          )

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

          if (data) {
            // 优先购回显
            if ('prior' in data.interests && data.interests.prior.type === 'appoint') {
              const goodsPrior = data.interests.prior.buy.goods.map(v => {
                return this.goodsOptions.find(x => x.value === v)
              })
              goodsPrior.forEach((v, i) => {
                this.$set(this.goodsPriorMetaOptions, i, v)
              })
              const boxPrior = data.interests.prior.buy.box.map(v => {
                return this.boxOptions.find(x => x.value === v)
              })
              boxPrior.forEach((v, i) => {
                this.$set(this.boxPriorMetaOptions, i, v)
              })
            }
            // 折扣购回显
            if ('rebate' in data.interests && data.interests.rebate.type === 'appoint') {
              const goodsRebate = data.interests.rebate.buy.goods.map(v => {
                return this.goodsOptions.find(x => x.value === v)
              })
              goodsRebate.forEach((v, i) => {
                this.$set(this.goodsRebateMetaOptions, i, v)
              })

              const boxRebate = data.interests.rebate.buy.box.map(v => {
                return this.boxOptions.find(x => x.value === v)
              })
              boxRebate.forEach((v, i) => {
                this.$set(this.boxRebateMetaOptions, i, v)
              })
            }
          }

          if (data.goods_id) { // 藏品回显
            this.interestGoodMetaOptions.push({
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
          this.priorOptions = [] // 所有权益类型
          Object.keys(response.data).forEach((v) => {
            this.priorOptions.push({
              label: response.data[v][0].name,
              value: v
            })

            this.priorItemOptions[v] = response.data[v].map((x) => {
              let label = this.interestsOptions.find(
                (y) => y.value === x.type
              )?.label
              if (x.label === 'entity' && x.type === 'appoint') {
                label = '指定商品'
              }
              return { label: label, value: x.type }
            })
          })
        })
        .catch(() => {})
    },
    getEntityGoodsList(data) {
      entityGoodsList()
        .then((response) => {
          this.entityGoodsOptions = response.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })
          // 实体商品折扣购回显
          if ('entity' in data.interests && data.interests.entity.type === 'appoint') {
            const entityList = [...new Set(data.interests.entity.buy.entity_goods)]
            const shopEntity = []
            entityList.forEach(v => {
              const obj = this.entityGoodsOptions.find(x => x.value === v)
              if (obj) {
                shopEntity.push(obj)
              }
            })
            shopEntity.forEach((v, i) => {
              this.$set(this.entityMetaGoodsOptions, i, v)
            })
          }
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
        this.interestGoodMetaOptions = this.interestGoodOptions.filter(
          (v) => v.label.indexOf(val) !== -1
        )
      } else {
        this.interestGoodMetaOptions = []
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

          if (data.interests?.entity) {
            // 勾选实体商品折扣时 根据选择删除无效字段
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
