<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="search.keywords" placeholder="昵称/手机号/认证姓名" clearable @change="getList(1)" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="btnLoading" icon="el-icon-search" @click="getList(1)">
            {{ $t('table.search') }}
          </el-button>
          <el-button type="primary" @click="onAddOrUpdate()">
            失信配置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        prop="user_id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="用户信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { user } }">
          <div>#：{{ user.id }}</div>
          <div>姓名：{{ user.name }}</div>
          <div>手机号：{{ user.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="认证信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { user } }">
          <div v-if="user.certification">
            <div>认证名称：{{ user.certification.name }}</div>
            <div>身份证：{{ user.certification.number }} </div>
            <div>认证手机：{{ user.certification.phone }} </div>
          </div>
          <div v-else style="text-align: center"> - </div>
        </template>
      </el-table-column>
      <el-table-column
        label="失信次数"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: #F56C6C"> {{ row.num }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        align="center"
      >
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建：{{ created_at }}</div>
          <div>审核：{{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onCancel(row)">解除失信</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-dishonest-update
      v-if="changeDishonestVisible"
      ref="dishonest"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddDishonestUpdate from './components/addDishonestUpdate'
import { blacklist, blacklistCancel } from '@/api/configs'
export default {
  name: 'Dishonest',
  components: { Pagination, AddDishonestUpdate },
  data() {
    return {
      btnLoading: false,
      changeDishonestVisible: false,
      loading: false,
      search: {
        keywords: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.blacklists()
    },
    blacklists(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      blacklist({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCancel(row) {
      this.$confirm(
        `确定对(#${row.user.id})[${row.user.name}]进行[解除失信]操作?`, '解除失信', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          blacklistCancel({ user_id: row.user.id })
            .then(({ msg = '解除失信成功' }) => {
              this.$message.success(msg)
              this.blacklists()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    },
    onAddOrUpdate() {
      this.changeDishonestVisible = true
      this.$nextTick(() => {
        this.$refs.dishonest && this.$refs.dishonest.init()
      })
    }
  }
}
</script>

<style scoped>
    .notice {
        color: #909399;
        font-size: 12px;
    }
    .el-input-number {
        width: 200px;
    }
</style>
