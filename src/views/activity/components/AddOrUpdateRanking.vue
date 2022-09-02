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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="图片" prop="image">
          <custom-upload
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <img v-if="form.image" :src="domin + form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">注意：建议图片尺寸 750*750px</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="奖励人数" prop="reward_num">
          <el-input-number v-model="form.reward_num" :min="0" placeholder="奖励人数" />
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
        <el-form-item label="活动类型" prop="condition.type">
          <el-select v-model="form.condition.type" placeholder="活动类型" @change="onChangeType">
            <el-option
              v-for="(item, index) in activityTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-show="form.condition.type">
          <el-form-item :label="activityTypeOptions.find(v => v.value === form.condition.type) && activityTypeOptions.find(v => v.value === form.condition.type).label" prop="condition.type">
            <el-select v-if="form.condition.type === 'goods'" v-model="form.condition.serial" filterable multiple clearable popper-class="popover-box" style="width: 100%;" placeholder="请输入关键字搜索" :filter-method="filterMethodSelect">
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
                  :src="item.image && domin + item.image"
                />
                <span>
                  {{ item.label }}
                </span>
              </el-option>
            </el-select>
            <el-select v-if="form.condition.type === 'issuer'" v-model="form.condition.serial" filterable multiple clearable popper-class="popover-box" style="width: 100%;">
              <el-option
                v-for="(item, index) in issuerOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="参与资格藏品" prop="condition.condition_serial">
          <el-select v-model="form.condition.condition_serial" filterable multiple clearable popper-class="popover-box" style="width: 100%;" placeholder="请输入关键字搜索" :filter-method="filterMethodSelect">
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
                :src="item.image && domin + item.image"
              />
              <span>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
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
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <edit-tinymce
      v-if="editTinymceVisible"
      ref="editTinymce"
      @info="onInfo"
    />
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdateRanking, castList, issuerList, getRankingItem } from '@/api/activity'
import CustomUpload from '@/components/Upload/CustomUpload'
import { activityTypeOptions } from '@/utils/explain'
import EditTinymce from './EditTinymce'

export default {
  name: 'AddOrUpdate',
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      visible: false,
      domin: getToken(DominKey),
      activityTypeOptions,
      btnLoading: false,
      editTinymceVisible: false,
      metaGoodsOptions: [],
      goodsOptions: [],
      issuerOptions: [],
      boxOptions: [],
      form: {
        id: 0,
        title: '',
        image: '',
        intro: '',
        reward_num: 0,
        start_time: '',
        end_time: '',
        status: 0,
        sort: 0,
        condition: {
          serial: [],
          type: '',
          condition_serial: []
        }
      },
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
        'condition.type': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.getCastList()
      this.getIssuerList()
      if (row) {
        this.getRankingDetail(row.id)
          .then(result => {
            this.form = result
          })
      }
    },
    async getRankingDetail(id) {
      const { data } = await getRankingItem(id)
      return data
    },
    getCastList() {
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
        .catch(() => {})
    },
    getIssuerList() {
      issuerList()
        .then(response => {
          this.issuerOptions = response.data.map(v => {
            return {
              value: v,
              label: v
            }
          })
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addOrUpdateRanking(this.form)
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
    onChangeType(val) {
      this.form.condition.serial = []
    },
    filterMethodSelect(val) {
      if (val) {
        this.goodsOptions = this.metaGoodsOptions.filter(v => v.label.indexOf(val) !== -1)
      } else {
        this.goodsOptions = []
      }
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
  .notice {
    color: #909399;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 10px;
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
