<template>
  <div>
    <el-dialog title="发货" :visible.sync="visible" @closed="onClose()">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品信息">
          <div class="goods-box">
            <el-image
              class="img-box"
              fit="contain"
              :src="`${domin}${
                data.goods_order.sku
                  ? data.goods_order.sku.image
                  : data.goods_order.goods_image
              }`"
              :preview-src-list="[
                `${domin}${
                  data.goods_order.sku
                    ? data.goods_order.sku.image
                    : data.goods_order.goods_image
                }`
              ]"
            />
            <div class="goods-info">
              <div class="goods-name">
                <span>
                  {{ data.goods_order.goods_name }}
                </span>
              </div>
              <div>
                规格：{{
                  data.goods_order.sku
                    ? data.goods_order.sku.properties.join('/')
                    : '无规格'
                }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="物流公司" prop="logistics_id">
          <el-select
            v-model="form.logistics_id"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="onRemoteMethod"
            :loading="logisticsLoading"
          >
            <el-option
              v-for="item in logisticsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logistics_no">
          <el-input
            v-model="form.logistics_no"
            clearable
            placeholder="请输入快递单号"
          />
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
import { getToken, DominKey } from '@/utils/auth'
import { logisticsList, goDelivery } from '@/api/shop-management'

export default {
  name: 'OrderDeliver',
  data() {
    return {
      domin: getToken(DominKey),
      btnLoading: false,
      visible: false,
      logisticsLoading: false,
      logisticsOptions: [],
      search: {
        keywords: ''
      },
      data: {
        goods_order: ''
      },
      form: {
        order_id: 0,
        logistics_id: '',
        logistics_no: ''
      },
      rules: {
        logistics_id: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        logistics_no: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.order_id = data.id
        this.data.goods_order = data.goods_order
      }
    },
    onRemoteMethod(query) {
      if (query !== '') {
        this.search.keywords = query
        this.getLogistics()
      } else {
        this.logisticsOptions = []
      }
    },
    getLogistics() {
      this.logisticsLoading = true
      logisticsList(this.search).then((response) => {
        this.logisticsLoading = false
        this.logisticsOptions = response.data.map((v) => {
          return {
            label: v.name,
            value: v.id
          }
        })
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          goDelivery(this.form)
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
.goods-box {
  display: flex;
  .img-box {
    width: 108px;
    height: 108px;
    flex-shrink: 0;
  }
  .goods-info {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    .goods-name {
      height: 80px;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    div:nth-child(2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
