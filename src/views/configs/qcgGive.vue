<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="铸造藏品列表" prop="serial">
        <el-select
          v-model="form.serial"
          filterable
          multiple
          collapse-tags
          clearable
          placeholder="请输入关键字搜索"
          no-data-text="请输入关键字搜索"
          :filter-method="filterMethodSelect"
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
      <el-form-item v-if="form.serial.length" label="转赠藏品编号">
        <el-tag v-for="(item,index) in form.serial" :key="index" closable style="margin-right:10px;margin-bottom:10px" @close="handleRemoveTag(index)">{{ item }}</el-tag>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { castGoodsList, putQcgGive, qcgGive } from '@/api/configs'
import { getToken, DominKey } from '@/utils/auth'
export default {
  name: 'QcgGive',
  data() {
    return {
      domin: getToken(DominKey),
      form: {
        serial: []
      },
      metaGoodsOptions: [],
      newMetaGoodsOptions: [],
      btnLoading: false,
      rules: {}
    }
  },
  created() {
    this.init()
    this.getCastGoodsList()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      qcgGive().then(response => {
        this.form.serial = response.data.value
      })
    },
    getCastGoodsList() {
      castGoodsList()
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
    filterMethodSelect(val) {
      if (val) {
        this.newMetaGoodsOptions = this.metaGoodsOptions.filter(v => v.label.indexOf(val) !== -1)
      } else {
        this.newMetaGoodsOptions = []
      }
    },
    handleRemoveTag(index) {
      this.form.serial.splice(index, 1)
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putQcgGive(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style  scoped>
.app-container {
  width: 800px;
}
.good-img {
  width: 30px;
  margin-left: 5px;
  height: 30px;
  vertical-align: middle;
  flex-shrink: 0;
}
.el-select {
  width: 400px;
}
</style>
