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
        <el-tabs
          v-model="tabIndex"
          tab-position="left"
          @tab-remove="onRemoveTab"
        >
          <el-tab-pane
            v-for="item in checkLists"
            :key="item"
            :label="
              priorOptions.find((v) => v.value === item) &&
                priorOptions.find((v) => v.value === item).label
            "
            :closable="!oldCheckLists.find((v) => v === item)"
            :name="item"
          >
            <el-form-item
              label="权益类型"
              :prop="'interests.' + item + '.type'"
              :rules="{
                required: true,
                message: '请选择权益类型',
                trigger: 'blur'
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
                  :label="item1.value | paraphrase(interestsOptions)"
                  :value="item1.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if=" (!['rebate','give'].includes(item) &&
                form.interests[item].type !== 'appoint' )||
                (item !== 'prior' && form.interests[item].type === 'once' ) "
              label="权益次数"
              :prop="'interests.' + item + '.num'"
              :rules="{
                required: true,
                message: '请输入权益次数',
                trigger: 'blur'
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
              v-if="item=== 'prior'"
              label="优先购提前时间(分)"
              :prop="'interests.' + item + '.prior_time'"
              :rules="{
                required: true,
                message: '请输入优先购时间',
                trigger: 'blur'
              }"
            >
              <el-input-number
                v-model="form.interests[item].prior_time"
                :min="1"
                :precision="0"
                label="提前时间(分)"
              />
            </el-form-item>
            <el-form-item
              v-if="item=== 'give'"
              label="藏品转赠解锁时间(天)"
              :prop="'interests.' + item + '.give_days'"
              :rules="{
                required: true,
                message: '请输入转赠时间',
                trigger: 'blur'
              }"
            >
              <el-input-number
                v-model="form.interests[item].give_days"
                :min="1"
                :precision="0"
                label="藏品转赠解锁时间(天)"
              />
            </el-form-item>
            <el-form-item
              v-if="
                ['rebate', 'give'].includes(item) &&
                  form.interests[item].type === 'long'
              "
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
            </div>
            <div v-if="form.interests[item].type === 'once'">
              <el-form-item
                label="有效时间"
                :prop="'interests.' + item + '.expire_time'"
                :rules="{
                  required: true,
                  message: '请选择有效时间',
                  trigger: 'blur'
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
                  trigger: 'blur'
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
                label="指定藏品"
                :prop="'interests.' + item + '.buy.goods'"
                :rules="{ validator: validateGoodAndBox, trigger: ['blur', 'change'] }"
              >
                <el-select
                  v-model="form.interests[item].buy.goods"
                  class="select-input"
                  filterable
                  multiple
                  clearable
                >
                  <el-option
                    v-for="(goodsItem, index) in goodsOptions"
                    :key="index"
                    :label="goodsItem.label"
                    :value="goodsItem.value"
                  >
                    <span>#{{ goodsItem.value }}</span>
                    <el-image
                      class="good-img"
                      fit="cover"
                      :src="goodsItem.image && domin + goodsItem.image"
                    />
                    <span>
                      {{ goodsItem.label }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="指定盲盒"
                :prop="'interests.' + item + '.buy.box'"
                :rules="{ validator: validateGoodAndBox, trigger: ['blur', 'change'] }"
              >
                <el-select
                  v-model="form.interests[item].buy.box"
                  class="select-input"
                  filterable
                  multiple
                  clearable
                >
                  <el-option
                    v-for="(boxItem, index) in boxOptions"
                    :key="index"
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
import { addOrUpdate, interestList, goodsList } from '@/api/interest'
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
              return { value: x.type }
            })
          })
        })
        .catch(() => {})
    },
    validateGoodAndBox(rule, value, callback) {
      if (this.form.interests[rule.field.split('.')[1]].buy.goods.length === 0 && this.form.interests[rule.field.split('.')[1]].buy.box.length === 0) {
        callback(new Error('指定藏品和指定盲盒必选一个'))
      } else {
        callback()
      }
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
