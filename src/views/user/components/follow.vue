<template>
  <el-dialog class="el-dialog-wallet" :title="`用户「#${data.id}」的关注`" width="600px" top="30px" :visible.sync="visible" @closed="onClose()">
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <span>
          当前用户：
          <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="data.avatar && domin + data.avatar" />
          {{ data.name }}
        </span>
      </el-col>
    </el-row>
    <el-divider content-position="left">关注列表</el-divider>
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
        label="头像"
        align="center"
      >
        <template slot-scope="{ row: { target_user } }">
          <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="target_user.avatar && domin + target_user.avatar" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
        align="center"
      >
        <template slot-scope="{ row: { target_user }}">
          <div>{{ target_user.name || '' }}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { userAttention } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Follow',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      domin: getToken(DominKey),
      list: [],
      data: {
        id: 0
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
      }
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      userAttention(this.data.id, { page, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
