<template>
  <div>
    <el-dialog
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
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="藏品" prop="goods_id">
          <el-select
            v-model="form.goods_id"
            style="width: 100%;"
            filterable
            clearable
            placeholder="请输入关键字搜索"
            :filter-method="filterMethodGoodsSelect"
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
        <el-form-item label="权益说明" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择" :disabled="!!form.id">
            <el-option v-for="(item, index) in interestsGiveOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="铸造券数量" prop="cast_num">
          <el-input-number v-model="form.cast_num" :precision="0" :min="0" :step="1" placeholder="请输入铸造券数量" />
        </el-form-item>
        <el-form-item label="兑换券数量" prop="voucher_num">
          <el-input-number v-model="form.voucher_num" :precision="0" :min="0" :step="1" placeholder="请输入兑换券数量" />
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
  </div>
</template>

<script>
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdateGive, giveList } from '@/api/interest'
import { interestsGiveOptions } from '@/utils/explain'

export default {
  name: 'AddOrUpdateGive',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      interestGoodOptions: [],
      interestGoodMetaOptions: [],
      interestsGiveOptions,
      form: {
        id: 0,
        goods_id: '',
        type: '',
        cast_num: 0,
        voucher_num: 0
      },
      rules: {
        goods_id: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        cast_num: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        voucher_num: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.interestLists()
      if (data) {
        const defaultObj = {
          label: data.goods?.name,
          image: Array.isArray(data.goods?.images) && data.goods?.images[0],
          value: data.goods?.id
        }
        this.interestGoodMetaOptions.push(defaultObj)
        this.interestGoodOptions.push(defaultObj)
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    interestLists() {
      giveList()
        .then((response) => {
          this.interestGoodOptions.push(...response.data?.interest_goods.map(v => {
            return {
              label: v.name,
              image: Array.isArray(v.images) && v.images[0],
              value: v.id
            }
          }))
        })
        .catch(() => {})
    },
    filterMethodGoodsSelect(val) {
      this.interestGoodMetaOptions = this.interestGoodOptions.find(v => v.value === this.form.goods_id) ? [this.interestGoodOptions.find(v => v.value === this.form.goods_id)] : []
      if (val) {
        this.interestGoodMetaOptions.push(...this.interestGoodOptions.filter((v) => v.label.indexOf(val) !== -1 && this.form.goods_id !== v.value))
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addOrUpdateGive(this.form)
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
  .good-img {
    width: 30px;
    margin-left: 5px;
    height: 30px;
    vertical-align: middle;
    flex-shrink: 0;
  }
  .el-input-number {
    width: 200px;
  }
</style>
