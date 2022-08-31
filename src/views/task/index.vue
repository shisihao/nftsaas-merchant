<template>
  <div class="app-container">

    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="name"
        label="任务名称"
        header-align="center"
      />
      <el-table-column
        prop="describe"
        label="任务描述"
        header-align="center"
      />
      <el-table-column
        prop="type"
        label="任务类型"
        align="center"
      >
        <template slot-scope="{ row: { type } }">
          {{ type === 'once' ? '一次性任务' : '每日任务' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        label="可完成次数"
        align="center"
      />
      <el-table-column
        prop="reward_type"
        label="奖励类型"
        align="center"
      >
        <template slot-scope="{ row: { reward_type } }">
          {{ rewardType[reward_type] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="reward"
        label="完成奖励"
        align="center"
      />
      <el-table-column
        prop="hook"
        label="任务勾子"
        align="center"
      />

      <el-table-column
        prop="status"
        label="状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? 'info' : 'success'">{{ row.status ? "关闭" : "开启" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        align="center"
      />
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { dataList } from '@/api/task'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'

export default {
  name: 'Task',
  components: { AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      rewardType: {
        power: "算力"
      },
      addOrUpdateVisible: false,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList()
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>
