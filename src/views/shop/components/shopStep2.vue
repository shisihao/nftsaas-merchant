<template>
  <div>
    <el-form-item v-if="form.id" prop="is_change_stock" label="开启编辑">
      <el-radio-group v-model="form.is_change_stock" @change="onHandleChange">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="规格类型" prop="specifications">
      <el-radio-group v-model="form.specifications" :disabled="form.is_change_stock?false:true">
        <el-radio :label="1">无规格</el-radio>
        <el-radio :label="2">多规格</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="form.specifications === 1">
      <el-form-item label="剩余库存" prop="stock">
        <el-input-number v-model="form.stock" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="加权库存" prop="show_stock">
        <el-input-number v-model="form.show_stock" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="0" />
      </el-form-item>
    </div>
    <div v-if="form.specifications === 2">
      <el-form-item class="skus-list" label="规格列表" prop="specs_properties">
        <div v-for="(item, index) in form.specs_properties" :key="index">
          <div class="skus-item">
            <div class="sku-name">规格名：</div>
            <el-tag
              type="success"
              size="medium"
              effect="plain"
              :closable=" form.is_change_stock?true:false"
              @close="onCloseSkuName(index)"
            >{{ item.name }}</el-tag>
          </div>
          <div class="skus-item">
            <div class="sku-name">规格值：</div>
            <div>
              <el-tag
                v-for="(propertiesItem, propertiesIndex) in item.properties"
                :key="propertiesIndex"
                class="sonTag"
                size="medium"
                effect="plain"
                :closable=" form.is_change_stock?true:false"
                @close="onCloseSkuPropertie(index, propertiesIndex)"
              >
                {{ propertiesItem }}
              </el-tag>
              <el-input
                v-model.trim="item.value"
                class="addskus middle"
                placeholder="请输入规格值"
                @keyup.enter.native="onAddSkuPropertie(index)"
              >
                <el-button
                  slot="append"
                  icon="el-icon-check"
                  :disabled="form.is_change_stock?false:true"
                  @click="onAddSkuPropertie(index)"
                />
              </el-input>
            </div>
          </div>
        </div>
        <div v-show="form.specs_properties.length < 3">
          <span class="sku-name">添加规格</span>
          <el-input
            v-model.trim="temp.name"
            class="addskus middle"
            placeholder="请输入规格名"
            clearable
          >
            <template slot="prepend">规格名</template>
          </el-input>
          -
          <el-input
            v-model.trim="temp.value"
            class="addskus middle"
            placeholder="请输入规格值"
            clearable
          >
            <template slot="prepend">规格值</template>
          </el-input>
          <el-button type="primary" class="sonvalue" :disabled="form.is_change_stock?false:true" @click="onAddSku">添加</el-button>
          <p class="notice">
            “规格”最多添加３种，“规格值”数量不限，建议不超过5个
          </p>
        </div>
      </el-form-item>

      <el-form-item label="规格明细" prop="skus">
        <el-table
          border
          max-height="410"
          :data="form.skus"
        >
          <el-table-column label="商品图片" width="104" align="center">
            <template slot-scope="{ row, $index }">
              <custom-upload
                class-name="avatar-uploader"
                accept="image/*"
                :ref-name="`image_${$index}`"
                @handleBeforeUpload="beforeAvatarUpload"
                @handleSuccess="handleAvatarSuccess"
              >
                <img v-if="row.image" :src="domin + row.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </custom-upload>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in form.specs_properties"
            :key="index"
            :label="item.name"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.specs_properties[index] && row.specs_properties[index].p_name }}
            </template>
          </el-table-column>
          <el-table-column
            label="剩余库存"
            min-width="160"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-input-number v-model="row.stock" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="0" />
            </template>
          </el-table-column>
          <el-table-column
            label="加权库存"
            min-width="160"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-input-number v-model="row.show_stock" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="0" />
            </template>
          </el-table-column>
          <!-- 商品类型为兑换时显示藏品数量，不显示人民币与积分 -->
          <template v-if="form.type !=='voucher'">
            <el-table-column
              label="人民币"
              min-width="160"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-input-number v-model="row.cny_price" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="2" />
              </template>
            </el-table-column>
            <el-table-column
              :label="integral"
              min-width="160"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-input-number v-model="row.integral_price" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="2" />
              </template>
            </el-table-column>
          </template>
          <el-table-column
            v-if="form.type ==='voucher'"
            label="藏品数量"
            min-width="160"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-input-number v-model="row.goods_num" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="2" />
            </template>
          </el-table-column>
          <el-table-column
            v-if="form.type==='commodity'"
            label="商品劵数量"
            min-width="160"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-input-number v-model="row.commodity_price" :disabled="form.is_change_stock?false:true" controls-position="right" class="table-input-number" :min="0" :precision="0" />
            </template>
          </el-table-column>
        </el-table>

        <div class="batch">
          <div>
            <span v-show="batch.visible">批量设置</span><el-button v-show="!batch.visible" :disabled="form.is_change_stock?false:true||form.skus.length === 0" @click="batch.visible = true">批量设置</el-button>
          </div>
          <div v-show="batch.visible">
            <el-select
              v-model="batch.numType"
              style="width: 120px;margin-left: 5px;"
              placeholder="请选择"
            >
              <template v-for="(item, index) in numOptions">
                <el-option
                  v-if="form.type==='commodity'&& item.value!==4 || form.type==='voucher'&& item.value!==3|| form.type==='common'&&item.value!==3&&item.value!==4"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </template>
            </el-select>
            <el-input-number
              v-model="batch.numTotal"
              controls-position="right"
              class="table-input-number"
              style="margin-left: 5px;"
              :precision="batch.numType === 1 ||batch.numType === 2 ? 2 : 0"
              :min="0"
            />
            <el-button-group style="margin-left: 5px;">
              <el-button @click="onSetNum">确 定</el-button>
              <el-button icon="el-icon-close" @click="onCloseSetNum" />
            </el-button-group>
          </div>
        </div>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken, DominKey } from '@/utils/auth'
import CustomUpload from '@/components/Upload/CustomUpload'
import { validSpace } from '@/utils/validate'
import { descartes } from '@/utils'
import ShopSkuModel from './ShopSkuModel'

export default {
  name: 'ShopStep2',
  components: { CustomUpload },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          is_change_stock: 0,
          old_stock: this.stock,
          specifications: 1,
          specs_properties: [],
          skus: [],
          stock: 0
        }
      }
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      currentName: '',
      batch: {
        visible: false,
        numType: 0,
        numTotal: 0
      },
      numOptions: [
        { label: '剩余库存', value: 0 },
        { label: '人民币价格', value: 1 },
        { label: `${this.integral}价格`, value: 2 },
        { label: '商品劵数量', value: 3 },
        { label: '藏品数量', value: 4 }
      ],
      temp: {
        name: '',
        value: ''
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  created() {
    this.formatSkusList()
  },
  methods: {
    onAddSku() { // 添加规格
      if (!this.temp.name || this.temp.name.trim() === '') {
        return this.$message.warning('规格名不能为空')
      } else if (!validSpace(this.temp.name)) {
        return this.$message.warning('规格名不能包含空格')
      }

      if (!this.temp.value || this.temp.value.trim() === '') {
        return this.$message.warning('规格值不能为空')
      } else if (!validSpace(this.temp.value)) {
        return this.$message.warning('规格值不能包含空格')
      }

      this.form.specs_properties.push({ name: this.temp.name, properties: [this.temp.value] })
      this.temp = { name: '', value: '' }
      this.formatSkusList()
    },
    onAddSkuPropertie(index) { // 添加规格值
      const specsValue = this.form.specs_properties[index].value
      if (!specsValue || specsValue.trim() === '') {
        return this.$message.warning('规格值不能为空')
      } else if (!validSpace(specsValue)) {
        return this.$message.warning('规格值不能包含空格')
      }

      const result = this.form.specs_properties[index].properties.some(v => {
        return v === specsValue
      })

      if (result) {
        return this.$message.error('存在同名”规格值“，请重新输入')
      }

      this.form.specs_properties[index].properties.push(specsValue)
      this.form.specs_properties[index].value = ''
      this.formatSkusList()
    },
    onCloseSkuPropertie(index, propertiesIndex) { // 删除规格值
      this.form.specs_properties[index].properties.splice(propertiesIndex, 1)
      if (this.form.specs_properties[index].properties.length === 0) {
        this.onCloseSkuName(index)
      } else {
        this.formatSkusList()
      }
    },
    onCloseSkuName(index) { // 删除规格
      this.form.specs_properties.splice(index, 1)
      this.formatSkusList()
    },
    formatSkusList() { // 生成规格列表
      // 获得skus组合类型
      const garr = this.form.specs_properties.map((v) => {
        return v.properties
      })
      // 生成笛卡尔积
      const properties = descartes(garr)
      // 返回数据
      const defaultData = properties.map(v => {
        // 生成规格名-规格值
        const specs_properties = this.form.specs_properties.map((specs, specsIndex) => {
          return { s_name: specs.name, p_name: v[specsIndex] }
        })
        // 获取已有旧数据
        const rawItem = this.form.skus.find(o => {
          const oldPname = o.specs_properties.map(x => {
            return x.p_name
          })
          return oldPname.join('/') === v.join('/')
        })
        // 构造skus
        const item = new ShopSkuModel({
          ...rawItem,
          specs_properties
        })

        return item
      })
      this.form.skus = defaultData
    },
    onSetNum() {
      const { numType, numTotal } = this.batch
      const name = ['stock', 'cny_price', 'integral_price', 'commodity_price', 'goods_num']
      this.form.skus.forEach((v, i) => {
        this.form.skus[i][name[numType]] = numTotal
      })
      this.batch.numTotal = 0
    },
    onCloseSetNum() {
      this.batch = { visible: false, numType: 0, numTotal: 0 }
    },
    handleAvatarSuccess(response, file) {
      const index = this.currentName.split('_')[1]
      this.form.skus[index].image = response.name
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      this.currentName = refName
      cb(true)
    },
    onHandleChange() {
      this.$emit('onCheckStock', this.form.is_change_stock)
      // this.$nextTick(() => {
      //   this.$parent.$parent.$parent.getGoodsItem(this.form.id, this.form.is_change_stock)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.skus-list {
  .el-form-item__content > div {
    .skus-item:first-child {
      margin-top: 0;
    }
    .skus-item {
      display: flex;
      margin: 12px 0;
    }
  }
  .sku-name {
    display: inline-block;
    width: 64px;
    flex-shrink: 0;
  }
  .sonTag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .addskus {
    width: 200px;
  }
  .middle {
    vertical-align: middle;
  }
  .sonvalue {
    margin-left: 5px;
  }
}
.table-input-number.el-input-number.is-controls-right ::v-deep .el-input__inner {
  padding-left: 5px;
  padding-right: 30px;
}
.batch {
  margin-top: 20px;
  display: flex;
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
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
    object-fit: contain;
  }
}
.notice {
  margin-left: 60px;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
}
</style>
