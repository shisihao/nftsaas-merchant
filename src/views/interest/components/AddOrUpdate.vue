<template>
  <div>
    <el-dialog
      width="800px"
      top="30px"
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
        label-width="180px"
        label-position="left"
      >
        <el-form-item label="藏品" prop="goods_id">
          <el-select v-model="form.goods_id" filterable clearable :disabled="!!form.id">
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
              :disabled="!!form.id && !!oldCheckLists.find((v) => v === item.value)"
              @change="onChangeCheckItem(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-tabs v-model="tabIndex" tab-position="left" @tab-remove="onRemoveTab">
          <el-tab-pane v-for="item in checkLists" :key="item" :label="priorOptions.find(v => v.value === item) && priorOptions.find(v => v.value === item).label" :closable="!oldCheckLists.find(v => v === item)" :name="item">
            <!-- 优先购 -->
            <prior
              v-if="tabIndex === 'prior'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :box-options="boxOptions"
            />
            <!-- 转赠 -->
            <give
              v-if="tabIndex === 'give'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :box-options="boxOptions"
            />
            <!-- 折扣购 -->
            <rebate
              v-if="tabIndex === 'rebate'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :box-options="boxOptions"
            />
            <!-- 零元购 -->
            <free-cny
              v-if="tabIndex === 'free_cny'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :box-options="boxOptions"
            />
            <!-- 免积分 -->
            <free-integral
              v-if="tabIndex === 'free_integral'"
              :form.sync="form"
              :old-check-lists="oldCheckLists"
              :prior-item-options="JSON.stringify(priorItemOptions)"
              :goods-options="goodsOptions"
              :box-options="boxOptions"
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
import { addOrUpdate, interestList, goodsList } from '@/api/interest'
import { interestsOptions } from '@/utils/explain'
import prior from './interest/prior'
import give from './interest/give'
import rebate from './interest/rebate'
import freeCny from './interest/freeCny'
import freeIntegral from './interest/freeIntegral'

export default {
  name: 'AddOrUpdate',
  components: { prior, give, rebate, freeCny, freeIntegral },
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
      priorOptions: [],
      priorItemOptions: {},
      checkLists: [], // 权益
      oldCheckLists: [], // 编辑初始的权益
      tabIndex: '', // 当前选择的tab
      defaultItem: {
        // 默认子项
        type: '',
        num: 1,
        expire_time: '',
        prior_time: 1,
        give_days: 1,
        is_destroy: 0,
        discount: 0,
        buy: {
          goods: [],
          box: []
        }
      },
      box: 0,
      goods: 0,
      form: {
        id: 0,
        goods_id: '',
        intro: '',
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
      this.goodsLists(data)
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
        this.oldCheckLists = this.checkLists = Object.keys(this.form.interests).map((v) => {
          return v
        })
        this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''
      }
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
            this.interestGoodOptions.push({ label: data.goods.name, value: data.goods.id })
          }
        })
        .catch(() => {})
    },
    interestLists() {
      interestList()
        .then((response) => {
          Object.keys(response.data).forEach((v) => {
            this.priorOptions.push({ label: response.data[v][0].name, value: v })
          })

          Object.keys(response.data).forEach((v) => {
            this.priorItemOptions[v] = response.data[v].map((x) => {
              const label = this.interestsOptions.find(
                (y) => y.value === x.type
              )?.label
              return { label: label, value: x.type }
            })
          })
        })
        .catch(() => {})
    },
    onChangeCheckItem(val) {
      if (this.checkLists.includes(val.value)) {
        // 为true时 添加数据
        this.$set(
          this.form.interests,
          val.value,
          JSON.parse(JSON.stringify(this.defaultItem))
        )
        this.tabIndex = val.value
      } else {
        // 为false时 删除数据
        delete this.form.interests[val.value]
        this.tabIndex = this.checkLists[this.checkLists.length - 1] ?? ''
      }
      console.log(this.tabIndex)
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
</style>
