<template>
  <div>
    <el-dialog
      width="1000px"
      top="30px"
      :visible.sync="visible"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="图片" prop="image">
          <custom-upload
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.image" :src="domin + form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">注意：建议藏品图片尺寸 750*750px</div>
        </el-form-item>
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            :picker-options="pickerOptions"
            clearable
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            :picker-options="pickerOptions"
            clearable
          />
        </el-form-item>
        <el-card shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>添加奖励</span>
          </div>
          <el-form-item label="铸造券" prop="reward.wallet.cast">
            <el-input-number
              v-model="form.reward.wallet.cast"
              :min="0"
              placeholder="铸造券"
              :disabled="oldfrom.id>0&&oldfrom.reward.stock>0"
            />
          </el-form-item>
          <el-form-item label="兑换券" prop="reward.wallet.voucher">
            <el-input-number
              v-model="form.reward.wallet.voucher"
              :min="0"
              placeholder="兑换券"
              :disabled="oldfrom.id>0&&oldfrom.reward.stock>0"
            />
          </el-form-item>
          <el-form-item :label="integral" prop="reward.wallet.integral">
            <el-input-number
              v-model="form.reward.wallet.integral"
              :min="0"
              :placeholder="integral"
              :disabled="oldfrom.id>0&&oldfrom.reward.stock>0"
            />
          </el-form-item>
          <el-form-item label="商品券" prop="reward.wallet.commodity">
            <el-input-number
              v-model="form.reward.wallet.commodity"
              :min="0"
              placeholder="商品券"
              :disabled="oldfrom.id>0&&oldfrom.reward.stock>0"
            />
          </el-form-item>
          <div class="notice notice-warning">注意：铸造券、兑换券、{{ integral }}、商品券填0代表不添加该奖励</div>
          <el-form-item label="藏品/盲盒" prop="reward">
            <div v-for="(item, index) in form.reward.goods" :key="item.goods_id" class="box-wrapper">
              <span>
                <el-tag type="primary">藏品</el-tag>
                <el-tag type="primary" effect="plain">
                  {{ item.goods_id | paraphrase(goodsOptions, 'value', 'serial') }}
                </el-tag>
                <span class="box-img">
                  <el-image
                    :src="item.goods_id | paraphrase(goodsOptions, 'value', 'image')"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </span>
                <span class="box-name ellipsis">
                  名称：{{ item.goods_id | paraphrase(goodsOptions) }}
                </span>
                <span class="box-stock">
                  奖励数量：{{ item.num }}
                </span>
                <span class="box-stock">
                  剩余库存：{{ item.goods_id | paraphrase(goodsOptions, 'value', 'stock') }}
                </span>
              </span>
              <i v-if="!oldfrom.reward.stock>0" class="el-icon-delete del-good" @click="onDelGood(0, index)" />
            </div>
            <div v-for="(item, index) in form.reward.box" :key="item.box_id" class="box-wrapper">
              <span>
                <el-tag type="warning">盲盒</el-tag>
                <span class="box-img box-img-right">
                  <el-image
                    :src="item.box_id | paraphrase(boxOptions, 'value', 'image')"
                    fit="cover"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </span>
                <span class="box-name ellipsis">
                  名称：{{ item.box_id | paraphrase(boxOptions) }}
                </span>
                <span class="box-stock">
                  奖励数量：{{ item.num }}
                </span>
                <span class="box-stock">
                  剩余库存：{{ item.box_id | paraphrase(boxOptions, 'value', 'stock') }}
                </span>
              </span>
              <i v-if="!oldfrom.reward.stock>0" class="el-icon-delete del-good" @click="onDelGood(1, index)" />
            </div>

            <div v-if="[0, 1].includes(good.type)">
              <div v-if="good.type === 0" class="add-box">
                藏品：
                <el-select
                  v-model="good.goods_id"
                  filterable
                  clearable
                  popper-class="popover-box"
                  @change="onChangeGood"
                >
                  <el-option
                    v-for="(item, index) in goodsOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag effect="plain"> {{ item.serial }} </el-tag>
                    <el-image
                      class="good-img"
                      fit="cover"
                      :src="item.image"
                    />
                    <span>
                      {{ item.label }}
                    </span>
                  </el-option>
                </el-select>
              </div>
              <div v-if="good.type === 1" class="add-box">
                盲盒：
                <el-select
                  v-model="good.box_id"
                  filterable
                  clearable
                  popper-class="popover-box"
                  @change="onChangeBox"
                >
                  <el-option
                    v-for="(item, index) in boxOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-image
                      class="good-img"
                      fit="cover"
                      :src="item.image"
                    />
                    <span>
                      {{ item.label }}
                    </span>
                  </el-option>
                </el-select>
              </div>
              <div class="add-box">
                奖励数量：
                <el-input-number
                  v-model="good.num"
                  style="width: 120px"
                  :min="0"
                  :max="surplusStock"
                  :precision="0"
                  placeholder="库存"
                />
              </div>
              <div class="add-box">
                剩余库存：{{ surplusStock }}
              </div>
              <div class="add-box">
                <el-button type="primary" plain @click="onAddBoxItem">确定</el-button>
                <el-button @click="onCancelBoxItem">取消</el-button>
              </div>
            </div>
            <div v-else>
              <div v-show="!disabledStock">
                <el-button type="primary" plain @click="onAddGoods(0)">+ 藏品</el-button>
                <el-button type="warning" plain @click="onAddGoods(1)">+ 盲盒</el-button>
              </div>
            </div>
          </el-form-item>
        </el-card>
        <el-form-item label="库存" prop="reward.stock">
          <el-input-number
            v-model="form.reward.stock"
            :min="0"
            :disabled="disabledStock"
            placeholder="库存"
          />
        </el-form-item>
        <el-form-item label="计数倍率" prop="extend.power">
          <el-input-number
            v-model="form.extend.power"
            :min="1"
            placeholder="计数倍率"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            label="排序"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动详情" prop="intro">
          <el-link type="primary" :underline="false" @click="onTinymce(form)">
            点击编辑
          </el-link>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        {{ form.stock }}
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />
  </div>
</template>

<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { DominKey, getToken } from '@/utils/auth'
import { goodsList, boxList, addOrUpdateWelfare, welfareDetail } from '@/api/activity'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdateWelfare',
  components: { CustomUpload, EditTinymce },
  data() {
    const validateTime = (rule, value, callback) => {
      if (
        Date.parse(this.form.start_time) - Date.parse(this.form.end_time) > 0 &&
        !!this.form.end_time
      ) {
        callback(new Error('结束时间必须大于开始时间'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      oldfrom: {
        reward: {
          box: [],
          goods: []
        }
      },
      good: {
        type: '',
        box_id: '',
        goods_id: '',
        num: 0,
        max_num: 0
      },
      form: {
        id: 0,
        title: '',
        image: '',
        intro: '',
        extend: {
          power: 1
        },
        reward: {
          goods: [],
          box: [],
          stock: 0,
          wallet: {
            cast: 0,
            voucher: 0,
            integral: 0,
            commodity: 0
          }
        },
        start_time: '',
        end_time: '',
        status: 0,
        sort: 0
      },
      boxOptions: [],
      goodsOptions: [],
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        image: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        end_time: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateTime, trigger: ['blur', 'change'] }
        ],
        intro: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.goods': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.box': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.wallet.cast': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.wallet.voucher': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.wallet.integral': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.wallet.commodity': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'reward.stock': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        'extend.power': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['integral']),
    surplusStock() {
      const boxStock = this.boxOptions.find(v => v.value === this.good.box_id)?.stock
      const goodStock = this.goodsOptions.find(v => v.value === this.good.goods_id)?.stock
      return goodStock ?? boxStock
    },
    disabledStock() {
      if (this.oldfrom.id && this.oldfrom.reward.stock > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getGoodsList()
      this.getBoxList()
      if (data) {
        this.getWelfareDetail(data.id)
          .then(result => {
            this.form = result
            this.oldfrom = JSON.parse(JSON.stringify(result))
          })
      }
    },
    getGoodsList() {
      goodsList()
        .then((response) => {
          this.goodsOptions = response.data.map((v) => {
            return {
              value: v.id,
              label: v.name,
              serial: v.serial,
              stock: v.stock,
              image: v.images && this.domin + v.images[0]
            }
          })
        })
        .catch(() => {})
    },
    getBoxList() {
      boxList()
        .then((response) => {
          this.boxOptions = response.data.map((v) => {
            return {
              value: v.id,
              label: v.name,
              stock: v.stock,
              image: v.images && this.domin + v.images[0]
            }
          })
        })
        .catch(() => {})
    },
    async getWelfareDetail(id) {
      const { data } = await welfareDetail(id)
      return data
    },
    onChangeGood(id) {
      const item = this.goodsOptions.find(v => {
        return v.value === id
      })
      this.good.goods_id = item.value
      this.good.max_num = item.stock
      this.good.type = 0
    },
    onChangeBox(id) {
      const item = this.boxOptions.find(v => {
        return v.value === id
      })
      this.good.box_id = item.value
      this.good.max_num = item.stock
      this.good.type = 1
    },
    onAddGoods(type) {
      this.good.type = type
    },
    onDelGood(type, index) {
      const typeName = type ? 'box' : 'goods'
      this.form.reward[typeName].splice(index, 1)
    },
    onAddBoxItem() {
      const type = this.good.type ? 'box' : 'goods'
      const idName = this.good.type ? 'box_id' : 'goods_id'

      if (this.good.num === 0) {
        this.$message.warning('奖励数量不能为0')
        return false
      }

      if (this.good.num > this.good.max_num) {
        this.$message.warning('奖励数量不能大于库存')
        return false
      }

      if (this.form.reward[type].some(v => parseFloat(this.good[idName]) === parseFloat(v[idName]))) {
        this.$message.warning('不能重复添加')
        return false
      }

      const data = { num: this.good.num }
      data[idName] = this.good[idName]

      this.form.reward[type].push(data)
      this.oldfrom.reward[type].push(data)
      this.onCancelBoxItem()
    },
    onCancelBoxItem() {
      this.good = Object.assign({}, this.$options.data.call(this).good)
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 验证库存
          if (this.form.reward.goods.length > 0 || this.form.reward.box.length > 0) {
            const arr = []
            this.form.reward.goods.forEach(v => {
              const current = this.goodsOptions.find(x => {
                return x.value === v.goods_id
              })
              arr.push(parseInt(current.stock / v.num))
            })
            this.form.reward.box.forEach((v) => {
              const current = this.boxOptions.find(x => {
                return x.value === v.box_id
              })
              arr.push(parseInt(current.stock / v.num))
            })
            // if (this.form.reward.stock > Math.min(...arr)) {
            //   this.$message.warning(`库存不能大于${Math.min(...arr)}`)
            //   return false
            // }
          }

          this.btnLoading = true
          addOrUpdateWelfare(this.form)
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
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      cb(true)
    },
    handleAvatarSuccess(response, file) {
      this.form.image = response
    },
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    onInfo(value) {
      this.form.intro = value
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    display: inline-block;
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
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
      height: 100px;
      display: block;
      object-fit: contain;
    }
  }
  .box-card {
    margin-bottom: 18px;
  }
  .box-wrapper {
    margin-bottom: 10px;
  }
  .del-good {
    margin-left: 10px;
    color: #f56c6c;
    cursor: pointer;
  }
  .add-box {
    display: inline-block;
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
    .el-select {
      width: 330px;
    }
  }
  .box-img {
    margin: 0 10px;
    .el-image {
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
    &.box-img-right {
      margin-left: 68px;
    }
    ::v-deep .image-slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f7fa;
    }
  }
  .box-name {
    display: inline-block;
    vertical-align: middle;
    width: 300px;
  }
  .box-stock {
    display: inline-block;
    min-width: 100px;
  }
  .notice {
    color: #909399;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 10px;
  }
  .notice-warning {
    color: #f56c6c;
    margin-left: 80px;
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
</style>
