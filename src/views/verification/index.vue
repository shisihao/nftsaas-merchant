<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="发送账号">
          <el-input v-model="search.number" placeholder="手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="使用场景">
          <el-select v-model="search.scene" placeholder="请选择使用场景" clearable @change="getList(1)">
            <el-option v-for="item in sceneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>

    <el-table v-loading="loading" border highlight-current-row :data="list">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="code" label="验证码" align="center" />
      <el-table-column prop="number" label="发送手机号" align="center" />
      <el-table-column prop="scene" label="使用类型" align="center">
        <template slot-scope="{ row }">
          {{ row.scene | paraphrase(sceneOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="验证类型" align="center">
        <template slot-scope="{ row }">
          {{ row.type | paraphrase(typeOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="发送状态" align="center">
        <template slot-scope="{ row }">
          {{ row.state | paraphrase(stateOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="used" label="使用状态" align="center">
        <template slot-scope="{ row }">
          {{ row.used | paraphrase(usedOptions) }}
        </template>
      </el-table-column>
      <el-table-column prop="used_at" label="使用时间" width="160" align="center">
        <template slot-scope="{ row }">
          {{ row.used_at || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="message" label="信息" header-align="center" />
      <el-table-column prop="created_at" label="创建时间" width="140" align="center" />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/verification'

export default {
  name: 'Verification',
  components: { Pagination },
  data() {
    return {
      list: [],
      search: {
        number: '',
        scene: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      sceneOptions: [
        { label: '全部', value: '' },
        { label: '注册', value: 'register' },
        { label: '登录', value: 'login' },
        { label: '修改登录密码', value: 'update-login-pass' },
        { label: '设置/修改支付密码', value: 'set-pay-pass' },
        { label: '账号换绑', value: 'change-account' },
        { label: '认证审核', value: 'identification' },
        { label: '注销', value: 'close_account' },
        { label: '修改密码', value: 'set-login-pass' }
      ],
      typeOptions: [
        { label: '手机短信', value: 'sms' },
        { label: '邮件类型', value: 'email' }
      ],
      stateOptions: [
        { label: '发送失败', value: 0 },
        { label: '发送成功', value: 1 }
      ],
      usedOptions: [
        { label: '未使用', value: 0 },
        { label: '已使用', value: 1 }
      ],
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
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
