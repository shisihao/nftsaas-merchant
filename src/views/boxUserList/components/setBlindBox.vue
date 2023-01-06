<template>
  <el-dialog
    title="指定开启"
    width="width"
    :visible.sync="visible"
    @closed="onClose()"
  >
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="指定物品" prop="box_goods_id">
        <el-select v-model="form.box_goods_id" placeholder="请选择">
          <el-option v-for="item in goodsOptions" :key="item.value" :label="item.label" :value="item.value">
            <template v-if="item.goods_id">
              <div class="select-dropdown">
                <div>
                  <el-tag effect="plain"> {{ item.serial }} </el-tag>
                </div>
                <div>
                  <el-image class="good-img" fit="cover" :src="item.image && domin + item.image">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <span>
                    {{ item.label }}
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="select-dropdown">
                <span>{{ integral }}</span>
                <span>{{ item.num }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
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
</template>

<script>
import { setBlindBox } from '@/api/boxUserList'
import { getToken, DominKey } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'SetBlindBox',
  computed: {
    ...mapGetters(['integral'])
  },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      form: {
        user_box_id: 0,
        box_goods_id: ''
      },
      goodsOptions: [],
      rules: {
        box_goods_id: [
          { required: true, message: '请选择物品', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.user_box_id = data.id
        this.getGoodsList(data)
      }
    },
    getGoodsList(data) {
      const { goods } = { ...data }
      this.goodsOptions = goods.map(v => {
        return {
          label: v.goods?.name || '香料',
          value: v.id,
          goods_id: v.goods_id,
          image: v.goods?.images && v.goods?.images[0] || '',
          serial: v.goods?.serial || '',
          num: +v.integral_num
        }
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          setBlindBox(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.$emit('refreshList')
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
              this.visible = false
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

<style  scoped>
.el-select{
  width: 250px;
}
.select-dropdown{
  display: flex;
  flex: 1 1 0%;
    justify-content: space-between;
}
.good-img {
  width: 30px;
  margin-left: 5px;
  height: 30px;
  vertical-align: middle;
  flex-shrink: 0;
}
::v-deep .image-slot {
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>
