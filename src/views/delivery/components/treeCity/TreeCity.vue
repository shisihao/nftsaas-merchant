<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="onHandleCheckAllChange">
          全选
        </el-checkbox>
        <el-divider direction="vertical" />
        <el-button type="text" @click="onStowOrOpen(false)">全部收起</el-button>
        <el-button type="text" @click="onStowOrOpen(true)">全部展开</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" @click="onEditFreight">批量编辑</el-button>
      </el-col>
    </el-row>
    <el-input v-model="filterText" class="spacing" placeholder="输入关键字进行过滤" clearable />
    <el-tree
      ref="tree"
      node-key="id"
      show-checkbox
      render-after-expand
      :expand-on-click-node="false"
      :data="treeOptions"
      :filter-node-method="filterNode"
      @check-change="onTreeChange"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-input v-model.number="data.amount" type="number" class="freight" clearable />
        </span>
      </span>
    </el-tree>
    <freight v-if="freightVisible" ref="freight" @freightValue="onFreightValue" />
  </div>
</template>

<script>
import { treeAddress, treeId, treeID } from './address'
import Freight from './Freight'

export default {
  name: 'TreeCity',
  components: { Freight },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          id: 0,
          freight: [],
          no_delivery: []
        }
      }
    }
  },
  data() {
    return {
      freightVisible: false,
      treeOptions: JSON.parse(JSON.stringify(treeAddress)),
      treeId,
      isIndeterminate: false,
      filterText: '',
      checkAll: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      if (!val) {
        for (let i = 0; i < this.treeOptions.length; i++) {
          this.$refs.tree.store.nodesMap[this.treeOptions[i].id].expanded = false
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.form.id) {
        // 区县
        const county = treeID({ num: 3 })
        // 与不配送的差集
        const differ = county.filter(v => !this.form.no_delivery.includes(v))
        // 设置
        this.$refs.tree.setCheckedKeys(differ)

        // 设置价格
        const freight = new Map()
        this.form.freight.forEach(v => {
          freight.set(v.id, v.amount)
        })

        this.treeOptions.forEach(v => {
          freight.has(v.id) && (v.amount = freight.get(v.id))
          v.children.forEach(i => {
            freight.has(i.id) && (i.amount = freight.get(i.id))
            i.children.forEach(x => {
              freight.has(x.id) && (x.amount = freight.get(x.id))
            })
          })
        })
      }
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onStowOrOpen(type) {
      for (let i = 0; i < this.treeOptions.length; i++) {
        this.$refs.tree.store.nodesMap[this.treeOptions[i].id].expanded = type
      }
    },
    onHandleCheckAllChange(val) {
      if (val) {
        this.$nextTick(() => { // 这个如果要默认全选就必须加，否则会报错“setCheckedNodes”未定义
          this.$refs.tree.setCheckedNodes(this.treeOptions)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
        })
      }
    },
    onEditFreight() {
      this.freightVisible = true
      this.$nextTick(() => {
        this.$refs.freight && this.$refs.freight.init()
      })
    },
    onFreightValue(data) {
      if (data.type === 1) {
        const allcheckedNodes = this.$refs.tree.getCheckedNodes()
        const allId = allcheckedNodes.map(v => v.id)
        this.treeOptions.forEach(v => {
          allId.includes(v.id) && (v.amount = data.amount)
          v.children.forEach(i => {
            allId.includes(i.id) && (i.amount = data.amount)
            i.children.forEach(x => {
              allId.includes(x.id) && (x.amount = data.amount)
            })
          })
        })
      } else {
        this.treeOptions.forEach(v => {
          if (!data.type) {
            v.amount = data.amount
            v.children.forEach(i => {
              i.amount = data.amount
              i.children.forEach(x => {
                x.amount = data.amount
              })
            })
          } else if (data.type === 2) {
            v.amount = data.amount
          } else if (data.type === 3) {
            v.children.forEach(i => {
              i.amount = data.amount
            })
          } else if (data.type === 4) {
            v.children.forEach(i => {
              i.children.forEach(x => {
                x.amount = data.amount
              })
            })
          }
        })
      }
      this.onTreeChange()
    },
    onTreeChange() {
      // 所有选择的值
      const allcheckedNodes = this.$refs.tree.getCheckedNodes()
      // 所有选择的值的id
      const allId = allcheckedNodes.map(v => v.id)
      // 差集
      this.form.no_delivery = this.treeId.filter(v => !allId.includes(v))
      // 设置有邮费
      this.form.freight = allcheckedNodes
        .filter(v => parseFloat(v.amount) >= 0)
        .map(v => {
          return {
            id: v.id,
            amount: v.amount
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .freight {
    width: 80px;

    ::v-deep input {
      height: 22px;
      line-height: 22px;
    }
  }
}

.spacing {
  margin-bottom: 10px;
}

.el-input ::v-deep input::-webkit-outer-spin-button,
.el-input ::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.el-input ::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
</style>
