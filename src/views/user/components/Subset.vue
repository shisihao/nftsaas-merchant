<template>
  <el-dialog title="查看邀请" :visible.sync="visible" @closed="onClose()">
    <el-form :inline="true" :model="search">
        <el-form-item label="专区">
          <el-select v-model="search.currency" @change="onChangeCurrency">
            <el-option v-for="item in zoneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>
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
          <el-divider v-if="data.userCer" direction="vertical" />
          {{ data.userCer }}
          <el-divider direction="vertical" />
          自购设备：{{ (data.self_kj_num || 0) | cutZero }}
          <el-divider direction="vertical" />
          市场业绩：{{ (data.performance || 0) | cutZero }}
          <el-divider direction="vertical" />
          直接销售：{{ (data.direct || 0) | cutZero }}
          <!-- <el-divider direction="vertical" />
          间接销售：{{ (data.indirect || 0) | cutZero }} -->
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
        <el-divider v-if="node.data.certification" direction="vertical" />
        {{ node.data.certification ? node.data.certification.name : '' }}
        <el-divider direction="vertical" />
          自购设备：{{ (node.data.self_kj_num || 0) | cutZero }}
          <el-divider direction="vertical" />
          市场业绩：{{ (node.data.performance || 0) | cutZero }}
          <el-divider direction="vertical" />
          直接销售：{{ (node.data.direct || 0) | cutZero }}
          <!-- <el-divider direction="vertical" />
          间接销售：{{ (node.data.indirect || 0) | cutZero }} -->
      </span>
    </el-tree>
  </el-dialog>
</template>

<script>
import { subset } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'
import { zoneOptions } from '@/utils/explain'

export default {
  name: 'Subset',
  data() {
    return {
      visible: false,
      openPanel: false,
      domin: getToken(DominKey),
      zoneOptions,
      id: 0,
      search: {
        currency: 'fil'
      },
      data: {
        id: 0,
        name: '',
        avatar: '',
        phone: '',
        userCer: '',
        self_kj_num: 0,
        performance: 0,
        direct: 0,
        indirect: 0
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
        this.data = Object.assign(this.data, data, { userCer: data.certification ? data.certification.name : '' })
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
          this.data.self_kj_num = response.data.items.self_kj_num
          this.data.performance = response.data.items.performance
          this.data.direct = response.data.items.direct
          this.data.indirect = response.data.items.indirect
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
