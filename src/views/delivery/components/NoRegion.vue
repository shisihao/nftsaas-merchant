<template>
  <el-dialog title="不配送区域" :visible.sync="visible" @closed="onClose()">

    <el-empty v-if="treeOptions.length === 0" description="不配送区域为空" />
    <div v-else>
      <el-row>
        <el-col :span="24">
          <el-button type="text" @click="onStowOrOpen(false)">全部收起</el-button>
          <el-button type="text" @click="onStowOrOpen(true)">全部展开</el-button>
        </el-col>
      </el-row>
      <el-input v-model="filterText" class="spacing" placeholder="输入关键字进行过滤" clearable />
      <el-tree
        ref="tree"
        node-key="id"
        render-after-expand
        :expand-on-click-node="false"
        :data="treeOptions"
        :filter-node-method="filterNode"
      >
        <span slot-scope="{ node }" class="custom-tree-node">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </el-dialog>
</template>

<script>
import { treeAddress } from './treeCity/address'

export default {
  name: 'NoRegion',
  data() {
    return {
      visible: false,
      treeOptions: JSON.parse(JSON.stringify(treeAddress)),
      filterText: '',
      form: {
        id: 0,
        name: '',
        freight: [],
        no_delivery: []
      }
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
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        const treeArr1 = this.treeOptions.filter(v => data.no_delivery.includes(v.id))
        const treeArr2 = treeArr1.map(v => {
          v.children = v.children.filter(x => {
            return data.no_delivery.includes(x.id)
          })
          return v
        })
        const treeArr3 = treeArr2.map(v => {
          v.children = v.children.map(x => {
            x.children = x.children.filter(y => {
              return data.no_delivery.includes(y.id)
            })
            return x
          })
          return v
        })
        this.treeOptions = treeArr3
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onStowOrOpen(type) {
      for (let i = 0; i < this.treeOptions.length; i++) {
        this.$refs.tree.store.nodesMap[this.treeOptions[i].id].expanded = type
      }
    },
    onClose() {
      this.$reset('', false)
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
</style>
