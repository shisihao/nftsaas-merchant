<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="30px"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="图片" prop="image">
          <custom-upload
            class-name="avatar-uploader"
            ref-name="images"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.image" :src="domin + form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">抽奖活动建议图片尺寸：240×240</div>
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
            placeholder="结束时间"
            :picker-options="pickerOptions"
            clearable
          />
        </el-form-item>
        <el-form-item label="开启活动" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="reward-wrap">
          <h4 v-if="form.reward.length">奖励列表</h4>
          <div class="reward-list-wrap">
            <div v-for="(item, index) in form.reward" :key="index" class="reward-list">
              <span style="width:20%">
                <el-tag type="success">{{ item.goods_id ? '藏品' : item.box_id ? '盲盒' : typeObj[item.wallet_type] }}
                </el-tag>
              </span>
              <span style="width:17%">{{ item.title }}</span>
              <span style="width:23%">
                <el-image style="width: 80px" fit="contain" :src="item.icon && domin + item.icon">
                  <div slot="error" class="image-slot" style="text-align:center">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </span>
              <span style="width:20%">奖励数量 {{ item.reward_num }}</span>
              <span style="width:20%">库存 {{ item.stock }}</span>
              <i v-if="disabledBtn" class="el-icon-delete" @click="deleteReward(index)" />
            </div>
          </div>
          <div v-if="!form.id||disabledBtn">
            <el-button v-if="disabledBtn&&!rewardFlag || !form.id&&rewardFlag" icon="el-icon-plus" @click="resetAddBtn('reward')" />
            <el-card v-else shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span>添加奖励</span>
              </div>
              <el-form-item label="奖励类型" required>
                <el-select v-model="rewardValue" placeholder="请选择奖励类型" @change="rewardChange">
                  <el-option
                    v-for="(item, index) in payTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="rewardValue === 'goods_id'" required label="指定藏品">
                <el-select
                  v-model="selectRewardList.goods_id"
                  placeholder="请选择"
                  filterable
                  clearable
                  popper-class="popover-box"
                  @change="goodsOrboxChange"
                >
                  <el-option v-for="(item, index) in goodsOptions" :key="index" :label="item.label" :value="item.value">
                    <el-tag effect="plain"> {{ item.serial }} </el-tag>
                    <el-image class="good-img" fit="cover" :src="item.image && domin + item.image" />
                    <span>
                      {{ item.label }}
                    </span>
                    <span>剩余库存：{{ item.stock }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="rewardValue === 'box_id'" required label="指定盲盒">
                <el-select
                  v-model="selectRewardList.box_id"
                  placeholder="请选择"
                  filterable
                  clearable
                  popper-class="popover-box"
                  @change="goodsOrboxChange"
                >
                  <el-option v-for="(item, index) in boxsOptions" :key="index" :label="item.label" :value="item.value">
                    <el-tag effect="plain"> {{ item.value }} </el-tag>
                    <el-image class="good-img" fit="cover" :src="item.image && domin + item.image" />
                    <span>
                      {{ item.label }}
                    </span>
                    <span>剩余库存：{{ item.stock }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item required label="等级名称">
                <el-input v-model="selectRewardList.title" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item required label="icon">
                <custom-upload
                  class-name="avatar-uploader"
                  ref-name="icon"
                  @handleBeforeUpload="beforeAvatarUpload"
                  @handleSuccess="handleAvatarSuccess"
                >
                  <img v-if="selectRewardList.icon" :src="domin + selectRewardList.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </custom-upload>
                <div class="notice">建议icon尺寸：240×240</div>
              </el-form-item>
              <el-form-item required label="奖励数量">
                <el-input-number v-model="selectRewardList.reward_num" :min="1" :precision="0" @change="rewardNumChange" />
              </el-form-item>
              <el-form-item required label="库存">
                <el-input-number v-model="selectRewardList.stock" :min="0" :precision="0" @change="stockChange" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="onAddReward">确定</el-button>
                <el-button plain @click="form.reward.length>0?rewardFlag = !rewardFlag:''">取消</el-button>
              </el-form-item>
            </el-card>
          </div>
        </div>
        <div class="condition-wrap">
          <h4 v-if="form.condition.length">抽奖条件列表</h4>
          <div v-if="form.condition.length" class="reward-list2">
            <span class="item">藏品编号</span>
            <span class="item">类型</span>
            <span class="item">满足数量</span>
            <span class="item">抽奖次数</span>
            <span class="item">是否销毁</span>
          </div>
          <div v-for="(item, index) in form.condition" :key="index" class="reward-list2">
            <span class="item">
              <el-tag v-for=" (tagItem, tagIndex) in item.serial" :key="tagIndex" style="margin-right:5px;margin-bottom:5px">{{ tagItem }}</el-tag>
            </span>
            <span class="item">{{ item.type | paraphrase(typeOptions) }}</span>
            <span class="item">{{ item.num }}</span>
            <span class="item">{{ item.count }}</span>
            <span class="item">{{ item.is_destroy ? '是' : '否' }}</span>
            <i v-if="!form.id" style="margin-left: -15px;" class="el-icon-delete" @click="deleteCondition(index)" />
          </div>
          <div v-if="!form.id">
            <el-button
              v-if="conditionFlag&&form.condition.length"
              icon="el-icon-plus"
              @click="resetAddBtn('condition')"
            />
            <el-card v-else shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span>抽奖条件</span>
              </div>
              <el-form-item label="铸造藏品" required>
                <el-select
                  v-model="conditionObj.serial"
                  filterable
                  multiple
                  clearable
                  placeholder="请输入关键字搜索"
                  :filter-method="filterMethodSelect"
                  @change="filterCondition"
                >
                  <el-option
                    v-for="(item, index) in newMetaGoodsOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag effect="plain"> {{ item.serial }} </el-tag>
                    <el-image class="good-img" fit="cover" :src="item.image && domin + item.image" />
                    <span>
                      {{ item.label }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型" required>
                <el-select v-model="conditionObj.type" placeholder="请选择">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="满足数量" required>
                <el-input-number v-model="conditionObj.num" :min="0" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="抽奖次数" required>
                <el-input-number v-model="conditionObj.count" :min="0" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="是否销毁" required>
                <el-radio-group v-model="conditionObj.is_destroy">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="onAddCondition">确定</el-button>
                <el-button plain @click="form.condition.length>0?conditionFlag = !conditionFlag:''">取消</el-button>
              </el-form-item>
            </el-card>
          </div>
        </div>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" label="排序" placeholder="请输入排序" :precision="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="活动详情" prop="intro">
          <el-link type="primary" :underline="false" @click="onTinymce(form)">
            点击编辑
          </el-link>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { getToken, DominKey } from '@/utils/auth'
import { goodsList, boxList, castList, addOrUpdateLuckDraw, luckDrawDetail } from '@/api/activity'

export default {
  name: 'AddOrUpdateLuckDraw',
  components: { CustomUpload, EditTinymce },
  data() {
    const validateTime = (rule, value, callback) => {
      if ((Date.parse(this.form.start_time) - Date.parse(this.form.end_time) > 0) && !!this.form.end_time) {
        callback(new Error('结束时间必须大于开始时间'))
      } else {
        callback()
      }
    }
    return {
      domin: getToken(DominKey),
      visible: false,
      form: {
        id: 0,
        title: '',
        image: '',
        start_time: '',
        end_time: '',
        reward: [],
        condition: [],
        sort: 0
      },
      editTinymceVisible: false,
      btnLoading: false,
      rewardFlag: false,
      conditionFlag: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      selectRewardList: {
        reward_num: 1,
        stock: 0,
        goods_id: '',
        box_id: '',
        title: '',
        icon: ''
      },
      conditionObj: {
        serial: [],
        type: '',
        num: 0,
        count: 0,
        is_destroy: 0
      },
      goodsOptions: [],
      boxsOptions: [],
      metaGoodsOptions: [],
      newMetaGoodsOptions: [],
      rewardValue: '',
      payTypeOptions: [
        { label: '藏品', value: 'goods_id' },
        { label: '盲盒', value: 'box_id' },
        { label: this.$store.state.user.integral, value: 'integral' },
        { label: '铸造券', value: 'cast' },
        { label: '兑换券', value: 'voucher' },
        { label: '商品券', value: 'commodity' }
      ],
      typeObj: {
        integral: this.$store.state.user.integral,
        cast: '铸造券',
        voucher: '兑换券',
        commodity: '商品券'
      },
      currentName: '',
      typeOptions: [
        { label: '数量', value: 'single' },
        { label: '成套', value: 'suit' }
      ],
      goodsOrBoxStock: 0,
      stockStandard: true,
      oldReward: [],
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
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]

      }
    }
  },
  computed: {
    ...mapGetters(['integral']),
    publicVisible() {
      const { reward_num, stock, icon, title } = this.selectRewardList
      return reward_num >= 1 && stock >= 0 && title.length > 0 && icon.length > 0 && this.stockStandard
    },
    maxNumber() {
      if (this.rewardValue === 'goods_id' || this.rewardValue === 'box_id') {
        return this.goodsOrBoxStock
      } else {
        return Infinity
      }
    },
    disabledBtn() {
      return this.oldReward.some(v => {
        return v.stock === 0
      })
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.id = data.id
        this.getLuckDrawDetail(data.id)
      }
      this.getOptionsList()
    },
    getLuckDrawDetail(id) {
      luckDrawDetail(id).then(res => {
        this.form = res.data
        this.oldReward = res.data.reward
      })
    },
    getOptionsList() {
      goodsList().then(res => {
        this.goodsOptions = res.data.map(v => {
          return {
            label: v.name,
            value: v.id,
            image: v.images && v.images[0],
            serial: v.serial,
            stock: v.stock
          }
        })
      })
      boxList().then(res => {
        this.boxsOptions = res.data.map(v => {
          return {
            label: v.name,
            value: v.id,
            image: v.images && v.images[0],
            stock: v.stock
          }
        })
      })
      castList()
        .then(response => {
          this.metaGoodsOptions = response.data.map(v => {
            return {
              value: v.serial,
              label: v.name,
              serial: v.serial,
              image: v.images && v.images[0]
            }
          })
        })
        .catch(() => { })
    },
    onAddReward() {
      const { selectRewardList, publicVisible, rewardValue } = this
      if (rewardValue === 'goods_id' && selectRewardList.goods_id > 0 && publicVisible) {
        this.filterRewardObj('goods_id', selectRewardList.goods_id, selectRewardList)
      } else if (rewardValue === 'box_id' && selectRewardList.box_id > 0 && publicVisible) {
        this.filterRewardObj('box_id', selectRewardList.box_id, selectRewardList)
      } else if (!['goods_id', 'box_id'].includes(rewardValue) && rewardValue !== '' && publicVisible) {
        this.filterRewardObj('wallet_type', rewardValue, selectRewardList)
      } else {
        this.$message.warning('请正确填写必填信息')
      }
    },
    filterRewardObj(key, val, { goods_id, box_id, ...data }) {
      this.form.reward.push({
        [key]: val,
        ...data
      })
      this.rewardFlag = !this.rewardFlag
    },
    onAddCondition() {
      if (this.conditionObj.serial.length > 0 && this.conditionObj.type && this.conditionObj.num >= 0 && this.conditionObj.count >= 0) {
        this.form.condition.push({ ...this.conditionObj })
        this.conditionFlag = !this.conditionFlag
      } else {
        this.$message.warning('请先完成必填信息')
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid && this.form.reward.length && this.form.condition.length) {
          this.btnLoading = true
          addOrUpdateLuckDraw(this.form).then()
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        } else {
          this.$message.warning('请先添加完整信息')
        }
      })
    },
    deleteReward(index) {
      this.form.reward.splice(index, 1)
    },
    deleteCondition(index) {
      this.form.condition.splice(index, 1)
    },
    resetAddBtn(flag) {
      if (flag === 'reward') {
        this.resetData('reward')
      } else {
        this.resetData('condition')
      }
    },
    resetData(data) {
      if (data === 'reward') {
        this.rewardFlag = !this.rewardFlag
        Object.assign(this.selectRewardList, this.$options.data().selectRewardList)
      } else {
        this.conditionFlag = !this.conditionFlag
        Object.assign(this.conditionObj, this.$options.data().conditionObj)
      }
    },
    filterMethodSelect(val) {
      if (val) {
        this.newMetaGoodsOptions = this.metaGoodsOptions.filter(v => v.label.indexOf(val) !== -1)
      } else {
        this.newMetaGoodsOptions = []
      }
    },
    stockChange(val) {
      if (this.rewardValue === 'goods_id' || this.rewardValue === 'box_id') {
        this.validationStockCount(val, this.selectRewardList.reward_num, 0)
      }
    },
    rewardNumChange(val) {
      if (this.rewardValue === 'goods_id' || this.rewardValue === 'box_id') {
        this.validationStockCount(val, this.selectRewardList.stock, 1)
      }
    },
    validationStockCount(val, numorStock, flag) {
      // 库存验证
      let num = 0
      num = Math.floor(this.goodsOrBoxStock / numorStock)
      if (num < val) {
        this.$message.warning(`${flag ? '奖励' : '库存'}数量不能大于${num}`)
        this.stockStandard = false
        return
      }
      this.stockStandard = true
    },
    goodsOrboxChange(val) {
      if (val === '') return
      if (this.rewardValue === 'goods_id') {
        this.goodsOptions.forEach(v => {
          if (v.value === val) {
            this.goodsOrBoxStock = v.stock
          }
        })
      } else if (this.rewardValue === 'box_id') {
        this.boxsOptions.forEach(v => {
          if (v.value === val) {
            this.goodsOrBoxStock = v.stock
          }
        })
      }
      this.resetPartReward()
    },
    rewardChange() {
      if (this.rewardValue !== 'goods_id' || this.rewardValue !== 'box_id') {
        this.resetPartReward()
      }
    },
    resetPartReward() {
      this.stockStandard = true
      this.selectRewardList.reward_num = 1
      this.selectRewardList.stock = 0
    },
    // 过滤铸造藏品
    filterCondition(val) {
      if (val === '') return
      this.form.condition.forEach(v => {
        if (v.serial.includes(val[val.length - 1])) {
          const index = this.conditionObj.serial.findIndex(item => {
            return item === val[val.length - 1]
          })
          this.conditionObj.serial.splice(index, 1)
          this.$message.warning('不可重复添加')
        }
      })
    },
    onClose() {
      this.$reset()
    },
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    beforeAvatarUpload(file, cb, refName) {
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
      this.currentName = refName
      cb(true)
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'icon') {
        this.selectRewardList.icon = response
      } else if (this.currentName === 'images') {
        this.form.image = response
      }
    },
    onInfo(value) {
      this.form.intro = value
    }
  }

}
</script>

<style lang="scss"  scoped>
.el-dialog__body {
  max-height: 900px;
  overflow-y: auto;
}

.good-img {
  width: 30px;
  margin-left: 5px;
  height: 30px;
  vertical-align: middle;
  flex-shrink: 0;
}

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

.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}

.el-input-number,
.el-select {
  width: 200px;
}

.reward-list {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.el-icon-delete {
  cursor: pointer;
  color: red;
}

.box-card {
  margin: 10px 0;
}

.reward-wrap,
.condition-wrap {
  padding-left: 10px;
  margin-bottom: 20px;

  h4 {
    margin-bottom: unset;
  }

  .reward-list2 {
    display: flex;
    align-items: center;
    margin: 15px 0;
    .item{
      width: 20%;
    }
  }
}
.reward-list-wrap{
  max-height: 500px;
  overflow-y: auto;
}
</style>
