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
          <div class="notice">注意：建议藏品图片尺寸 750*1000px</div>
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
        <el-form-item label="计数倍率" prop="extend.power">
          <el-input-number v-model="form.extend.power" :min="1" placeholder="计数倍率" />
        </el-form-item>
        <div class="level-box-wrap">
          <div class="level-box">
            <div class="title">等级奖励</div>
            <div class="content">
              <el-card v-for="(item,index) in form.reward" :key="index" shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <el-tag type="warning">{{ index }}</el-tag>
                  <el-button v-if="Object.keys(form.reward).length>1" style="float: right; padding: 3px 0" type="text" @click="deleteCard(index)">
                    <i class="el-icon-delete" />
                  </el-button>
                </div>
                <el-form-item
                  class="reward-row"
                  label="类型"
                  :prop="`reward.${index}.type`"
                  :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-select v-model="item.type" placeholder="请选择奖品类型" @change="typeChange(item,index)">
                    <el-option
                      v-for="typeItem in typeOptions"
                      :key="typeItem.value"
                      :label="typeItem.label"
                      :value="typeItem.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="item.type === 'goods'"
                  label="指定藏品"
                  class="reward-row"
                  :prop="`reward.${index}.target_id`"
                  :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-select v-model="item.target_id" filterable clearable popper-class="popover-box" style="width:100%;" @change="goodsOrboxChange(item,index)">
                    <el-option
                      v-for="(goodsItem, index2) in goodsOptions"
                      :key="index2"
                      :label="goodsItem.label"
                      :value="goodsItem.value"
                    >
                      <el-tag effect="plain"> {{ goodsItem.serial }} </el-tag>
                      <el-image
                        class="good-img"
                        fit="cover"
                        :src="goodsItem.image && domin + goodsItem.image"
                      />
                      <span>
                        {{ goodsItem.label }}
                      </span>
                      <span>剩余库存：{{ goodsItem.stock }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="item.type === 'box'"
                  label="指定盲盒"
                  class="reward-row"
                  :prop="`reward.${index}.target_id`"
                  :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-select v-model="item.target_id" filterable clearable popper-class="popover-box" style="width:300px;" @change="goodsOrboxChange(item,index)">
                    <el-option
                      v-for="(boxItem, index3) in boxOptions"
                      :key="index3"
                      :label="boxItem.label"
                      :value="boxItem.value"
                    >
                      <el-tag effect="plain"> {{ boxItem.value }} </el-tag>
                      <el-image
                        class="good-img"
                        fit="cover"
                        :src="boxItem.image && domin + boxItem.image"
                      />
                      <span>
                        {{ boxItem.label }}
                      </span>
                      <span>剩余库存：{{ boxItem.stock }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  class="reward-row"
                  label="奖励数量"
                  :prop="`reward.${index}.num`"
                  :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-input-number v-model="item.num" :min="1" style="width:180px" :precision="0" controls-position="right" />
                </el-form-item>
                <!-- <el-form-item
                  label="库存数量"
                  :prop="`reward.${index}.stock`"
                  :rules="{ required: true,message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-input-number v-model="item.stock" :disabled="form.id>0&&oldReward[index].stock>0" style="width:180px" controls-position="right" :min="0" :precision="0" @change="stockChange(item,index)" />
                </el-form-item> -->
                <el-form-item
                  class="reward-row"
                  label="邀请人数"
                  :prop="`reward.${index}.count`"
                  :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }"
                >
                  <el-input-number v-model="item.count" style="width:180px" :min="1" :precision="0" controls-position="right" />
                </el-form-item>
              </el-card>
            </div>
          </div>
          <el-button icon="el-icon-plus" class="level-btn" @click="addLevel" />
        </div>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" label="排序" :precision="0" controls-position="right" />
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
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdateInvite, boxList, goodsList, inviteDetail } from '@/api/activity'
export default {
  name: 'AddOrUpdateInvite',
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
      btnLoading: false,
      editTinymceVisible: false,
      form: {
        id: 0,
        title: '',
        image: '',
        intro: '',
        reward: {
          level1: {
            type: 'box',
            num: 0,
            count: 1
          }
        },
        extend: { power: 1 },
        start_time: '',
        end_time: '',
        status: 0,
        sort: 0
      },
      stockFlag: {
        level1: false
      },
      goodsOptions: [],
      boxOptions: [],
      typeOptions: [
        { value: 'goods', label: '藏品' },
        { value: 'box', label: '盲盒' }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      oldReward: {},
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        image: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        reward_num: [
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
        'extend.power': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.getInviteDetail(data.id)
      }
      this.getOptionsList()
    },
    getInviteDetail(id) {
      inviteDetail(id).then(res => {
        this.form = res.data
        // this.oldReward = JSON.parse(JSON.stringify(res.data.reward))
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
        this.boxOptions = res.data.map(v => {
          return {
            label: v.name,
            value: v.id,
            image: v.images && v.images[0],
            stock: v.stock
          }
        })
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid && !Object.values(this.stockFlag).includes(true)) {
          this.btnLoading = true
          addOrUpdateInvite(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        } else if (Object.values(this.stockFlag).includes(true)) {
          this.$message.warning('库存数量或奖励数量有误')
        }
      })
    },

    addLevel() {
      const index = Object.keys(this.form.reward).length
      this.$set(this.form.reward, `level${index + 1}`, {
        num: 0,
        type: 'box',
        count: 1,
        target_id: ''
      })
      // this.$set(this.oldReward, `level${index + 1}`, {
      //   num: 0,
      //   type: 'box',
      //   count: 1,
      //   target_id: ''
      // })
      this.stockFlag[`level${index + 1}`] = false
    },
    goodsOrboxChange(item, index) {
      this.resetRewardData(item, index)
    },
    typeChange(item, index) {
      this.$set(item, 'target_id', '')
      this.resetRewardData(item, index)
    },
    resetRewardData(item, index) {
      this.stockFlag[index] = false
      item.num = 1
      item.stock = 0
    },
    // stockChange(item, index) {
    //   // 验证库存
    //   if (item.type === 'goods' || item.type === 'box') {
    //     const id = item.target_id
    //     this.validationStockCount(item, index, id, 0)
    //   }
    // },
    // numChange(item, index) {
    //   // 验证奖励数量
    //   if (item.type === 'goods' || item.type === 'box') {
    //     const id = item.target_id
    //     this.validationStockCount(item, index, id, 1)
    //   }
    // },
    // validationStockCount(item, index, id, flag) {
    //   this[item.type === 'goods' ? 'goodsOptions' : 'boxOptions'].forEach(v => {
    //     if (v.value === id && v.stock / item[flag ? 'num' : 'stock'] < item[flag ? 'stock' : 'num']) {
    //       let num = 0
    //       num = Math.floor(v.stock / item[flag ? 'stock' : 'num'])
    //       this.$message.warning(`${flag ? '奖励' : '库存'}数量不能大于${num}`)
    //       this.$nextTick(() => {
    //         this.stockFlag[index] = true
    //       })
    //     } else {
    //       this.stockFlag[index] = false
    //     }
    //   })
    // },
    deleteCard(index) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.form.reward, index)
        delete this.stockFlag[index]
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    validateReward(rule, value, callback) {
      if (!Object.keys(value).length > 0) {
        return callback(new Error('不能为空'))
      } else {
        callback()
      }
    },
    onClose() {
      this.$reset()
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
    }
  }
}
</script>

<style  lang="scss" scoped>

  ::v-deep .el-select-dropdown {
  width: 300px !important;
  min-width: none;
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
.el-input-number {
  width: 200px;
}
.level-box-wrap{
  margin-bottom: 10px;
.level-box{
  display: flex;
  flex-wrap: wrap;
  .title{
    flex:1;
    padding: 0 9px 0 10px;
    font-weight: 700;
  }
  .content{
    flex:8;
    max-height:700px;
    overflow-y: auto;
  }
.box-card{
  width: 90%;
  margin-bottom: 10px;
}
.box-card:last-child{
    margin-bottom: unset;
}
}
.level-btn{
 margin-left: 79px;
 margin-top: 10px;
}
.el-icon-delete{
  font-size: 20px;
  color: red;
}
}

</style>
