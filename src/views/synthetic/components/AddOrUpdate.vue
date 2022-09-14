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
        <el-form-item label="封面图" prop="cover.filename">
          <custom-upload
            class-name="avatar-uploader"
            ref-name="cover"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleCoverSuccess"
          >
            <img v-show="form.cover.filename" :src="form.cover.filename && domin + form.cover.filename" class="avatar">
            <i v-show="!form.cover.filename" class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
          <div class="notice">注意：建议藏品图片尺寸 750*750px</div>
        </el-form-item>
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="活动标题" />
        </el-form-item>
        <el-form-item label="合成藏品" prop="goods_id">
          <el-select
            v-model="form.goods_id"
            filterable
            clearable
            :disabled="form.formula.length > 0"
            @change="onChangeGood"
          >
            <el-option v-for="item in synthesisOptions" :key="item.value" :label="item.label" :value="item.value">
              <span>#{{ item.value }}</span>
              <el-image class="good-img" fit="cover" :src="item.image && domin + item.image" />
              <span>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合成时间" prop="dateRangeValue">
          <el-date-picker
            v-model="form.dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-form-item label="合成条件" prop="formula">
          <div class="timeline-box">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in form.formula"
                v-show="item.goods_id.length > 0"
                :key="index"
                placement="top"
              >
                <div style="margin-bottom: 5px">
                  <el-form :inline="true" label-width="70px" label-position="left">
                    <el-form-item :label="`条件${index + 1}`" />
                    <el-form-item label="是否销毁">
                      <el-radio-group v-model="form.formula[index].is_destroy">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="需要份数">
                      <el-input-number
                        v-model="form.formula[index].num"
                        :precision="0"
                        :min="1"
                        controls-position="right"
                        style="width: 100px"
                      />
                    </el-form-item>
                  </el-form>
                </div>
                <el-card shadow="hover">
                  <i class="el-icon-close close" @click="onDelCard(index, item)" />
                  <div v-for="(v, i) in item.goods_id" :key="i" class="good-item">
                    <el-image :src="v | filterFormula(formulaAllOptions, 'image')" class="good-img" fit="cover" />
                    <span>
                      <el-tag
                        :type="
                          v
                            | filterFormula(formulaAllOptions, 'type')
                            | paraphrase(typeOptions, 'value', 'type')
                        "
                      >
                        {{
                          v
                            | filterFormula(formulaAllOptions, 'type')
                            | paraphrase(typeOptions)
                        }}
                      </el-tag>
                      {{ v | filterFormula(formulaAllOptions, 'label') }}
                    </span>
                    <i class="el-icon-delete del-good" @click="onDelGood(index, i, v)" />
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-if="addFormulaShow">
            <el-select
              v-model="formulaSelect"
              popper-class="popover-box"
              class="select-input"
              multiple
              filterable
              clearable
            >
              <el-option v-for="item in formulaOptions" :key="item.value" :label="item.label" :value="item.value">
                <el-image class="good-img" fit="cover" :src="item.image" />
                <span style="margin-left: 10px">
                  <el-tag :type="item.type | paraphrase(typeOptions, 'value', 'type')">
                    {{ item.type | paraphrase(typeOptions) }}
                  </el-tag>
                  {{ item.label }}
                </span>
              </el-option>
            </el-select>
            <div class="add-box">
              <el-button type="primary" plain @click="onFormula">
                确定
              </el-button>
              <el-button @click="onCancelFormula">取消</el-button>
            </div>
          </div>
          <el-button v-else type="primary" plain @click="onAddFormulaShow">
            + 条件
          </el-button>
        </el-form-item>
        <el-form-item label="库存" prop="limit_num">
          <el-input-number v-model="form.limit_num" :precision="0" :min="0" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户合成限量" prop="user_limit_num">
          <el-input-number v-model="form.user_limit_num" :precision="0" :min="0" />
        </el-form-item>
        <el-form-item label="合成规则说明" prop="intro">
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
    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate, synthesisList, formulaList } from '@/api/synthetic'
import CustomUpload from '@/components/Upload/CustomUpload'
import EditTinymce from './EditTinymce'
import { pickerOptions, typeOptions } from '@/utils/explain'
import { parseDate } from '@/utils'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, EditTinymce },
  filters: {
    filterFormula: function(value, options, type) {
      return options.find((v) => {
        return v.value === value
      })?.[type]
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      pickerOptions,
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      addFormulaShow: false,
      typeOptions: typeOptions.concat([
        { label: '空投藏品', value: 2, type: 'danger' }
      ]),
      currentName: '',
      synthesisOptions: [],
      formulaOptions: [],
      formulaAllOptions: [],
      formulaSelect: [],
      form: {
        id: 0,
        title: '',
        cover: {
          filename: '',
          height: 0,
          width: 0,
          mime: ''
        },
        sort: 0,
        status: 0,
        goods_id: '',
        user_limit_num: '',
        dateRangeValue: [],
        start_time: '',
        end_time: '',
        formula: [],
        limit_num: '',
        intro: ''
      },

      rules: {
        'cover.filename': [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        dateRangeValue: [
          { required: true, message: '请选择时间', trigger: ['blur', 'change'] }
        ],
        formula: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        limit_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        user_limit_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        goods_id: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      Promise.all([this.getSynthesisList(), this.getFormulaList()]).then(() => {
        if (data) {
          this.form = Object.assign(JSON.parse(JSON.stringify(data)), {
            dateRangeValue: [
              parseDate(data.start_time),
              parseDate(data.end_time)
            ]
          })
          this.onChangeGood(data.goods_id)
          const haveFormula = data.formula.reduce(function(a, b) {
            return a.concat(b.goods_id)
          }, [])
          this.formulaOptions = this.formulaOptions.filter((v) => {
            return !haveFormula.includes(v.value)
          })
        }
      })
    },
    async getSynthesisList() {
      await synthesisList()
        .then((response) => {
          this.synthesisOptions = response.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
              image: v.images && v.images[0]
            }
          })
        })
        .catch(() => { })
    },
    async getFormulaList() {
      await formulaList()
        .then((response) => {
          this.formulaOptions = response.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
              type: v.type,
              image: v.images && this.domin + v.images[0]
            }
          })
          this.formulaAllOptions = this.formulaOptions
        })
        .catch(() => { })
    },
    onFormula() {
      if (this.formulaSelect.length > 0) {
        this.form.formula.push({
          goods_id: this.formulaSelect,
          is_destroy: 0,
          num: 1
        })
        this.formulaOptions = this.formulaOptions.filter((v) => {
          return !this.formulaSelect.includes(v.value)
        })
      }
      this.onCancelFormula()
    },
    onCancelFormula() {
      this.formulaSelect = []
      this.addFormulaShow = false
    },
    onDelGood(index, i, value) {
      this.form.formula[index].goods_id.splice(i, 1)
      if (this.form.formula[index].goods_id.length === 0) {
        this.form.formula.splice(index, 1)
      }
      const item = this.formulaAllOptions.find((v) => {
        return v.value === value
      })
      item && this.formulaOptions.push(item)
    },
    onDelCard(index, value) {
      this.form.formula.splice(index, 1)
      for (var i of value.goods_id) {
        const item = this.formulaAllOptions.find((v) => {
          return v.value === i
        })
        item && this.formulaOptions.push(item)
      }
    },
    onAddFormulaShow() {
      // 添加条件
      if (!this.form.goods_id) {
        this.$message.warning('请先选择`合成藏品`')
        return false
      }

      if (this.form.formula.length === 10) {
        this.$message.warning('最多添加10个条件')
        return false
      }

      if (this.formulaOptions.length > 0) {
        this.addFormulaShow = true
      } else {
        this.$message.warning('已无可选项')
      }
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.start_time = value[0]
        this.form.end_time = value[1]
      } else {
        this.form.start_time = this.form.end_time = ''
      }
    },
    onChangeGood(value) {
      if (value) {
        this.formulaOptions = this.formulaAllOptions.filter((v) => {
          return !(v.value === value)
        })
      } else {
        this.formulaOptions = this.formulaAllOptions
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const haveFormula = this.form.formula.reduce(function(a, b) {
            return a.concat(b.goods_id)
          }, [])
          if (haveFormula.includes(this.form.goods_id)) {
            this.$message.error('合成条件中不能有合成藏品')
            return false
          }
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
    handleCoverSuccess(response, file) {
      this.form[this.currentName].filename = response
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

      new Promise(function(resolve, reject) {
        const _URL = window.URL || window.webkitURL
        const image = new Image()
        image.onload = function() {
          resolve({
            width: image.width,
            height: image.height
          })
        }
        image.onerror = function() {
          reject()
        }
        image.src = _URL.createObjectURL(file)
      })
        .then((response) => {
          this.form.cover.width = response.width
          this.form.cover.height = response.height
        })
        .catch(() => { })

      this.form.cover.mime = file.type
      this.currentName = refName
      cb(true)
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

.good-img {
  width: 30px;
  margin-left: 5px;
  height: 30px;
  vertical-align: middle;
  flex-shrink: 0;
}

.select-input {
  margin-right: 10px;
  width: 490px;
}

.add-box {
  display: inline-block;
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
}

.timeline-box {
  line-height: 1.5;

  .el-timeline {
    padding-left: 0px;

    ::v-deep .el-card__body {
      padding: 10px;
      position: relative;

      .close {
        position: absolute;
        right: 5px;
        top: 5px;
        font-size: 16px;
        cursor: pointer;
      }

      .good-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          padding: 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          span {
            vertical-align: middle;
          }
        }
      }
    }
  }
}

.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}

.del-good {
  margin-left: 10px;
  color: #f56c6c;
  cursor: pointer;
}

.el-input-number {
  width: 200px;
}
</style>
