<template>
  <el-dialog title="查看邀请" :visible.sync="visible" @closed="onClose()">
    <el-row>
      <el-col :span="24">
        <span>
          当前用户：
          <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="data.avatar ? domin + data.avatar : ''" />
          #{{ data.id }}
          <el-divider direction="vertical" />
          {{ data.name }}
          <el-divider v-if="data.phone || data.email" direction="vertical" />
          {{ data.phone || data.email }}
        </span>
      </el-col>
    </el-row>
    <p>
      <el-row>
        <el-col :span="24">
          <span v-if="parentData.id">
            上级用户：
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="parentData.avatar ? domin + parentData.avatar : ''" />
            #{{ parentData.id }}
            <el-divider direction="vertical" />
            {{ parentData.name }}
          </span>
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24" style="line-height: 24px;">
          团队总人数：{{ total_count }}
        </el-col>
      </el-row>
    </p>
    <el-divider />
    <el-tree v-if="openPanel" lazy :load="loadNode" :props="defaultProps">
      <span slot-scope="{ node }">
        <el-avatar class="tree-node-avatar" icon="el-icon-user-solid" size="small" :src="node.data.avatar ? domin + node.data.avatar : ''" />
        #{{ node.data.id }}
        <el-divider direction="vertical" />
        {{ node.data.name }}
        <el-divider direction="vertical" />
        {{ node.data.phone }}
      </span>
    </el-tree>
  </el-dialog>
</template>

<script>
import { subset } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Subset',
  data() {
    return {
      visible: false,
      openPanel: false,
      domin: getToken(DominKey),
      id: 0,
      data: {
        id: 0,
        name: '',
        avatar: '',
        phone: ''
      },
      child: [],
      total_count: 0,
      parentData: {
        id: 0,
        name: '',
        avatar: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.openPanel = true
      if (data) {
        this.data = Object.assign(this.data, data)
        this.id = data.id
      }
    },
    async getList() {
      let data
      await subset(this.id, this.search)
        .then(response => {
          data = response
        })
        .catch(() => {})
        .finally(() => {
          this.openPanel = true
        })
      return data
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        this.id = node.data.id
      }
      this.getList().then(response => {
        if (node.level === 0) {
          this.total_count = response.data.total_count
          this.parentData.id = response.data.items.pid
          this.parentData.name = response.data.items.pname
          this.parentData.avatar = response.data.items.avatar
        }
        resolve(response.data.items.child)
      })
    },
    onClose() {
      this.$reset('data', false)
    },
    onChangeCurrency() {
      this.openPanel = false
      this.id = this.data.id
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
   width: 1240px;
}
::v-deep .el-tree .el-tree-node__content {
  height: 34px;
  .tree-node-avatar {
    vertical-align: middle;
  }
}
::v-deep .user-avatar{
  vertical-align: middle;
}
::v-deep .el-tree {
  overflow-x: auto;
}
</style>
