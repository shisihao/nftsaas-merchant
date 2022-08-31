<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>

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
        label="总发放数"
        align="center"
      >
        <template slot-scope="{ row: { provide_num } }">
          {{ +provide_num || 0 }}
        </template>
      </el-table-column>
      <el-table-column
        label="已领取数"
        align="center"
      >
        <template slot-scope="{ row: { dig_total } }">
          <div style="color:#67C23A;">{{ +dig_total || 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="power_total"
        label="总矿力"
        align="center"
      />
      <el-table-column
        prop="active_user_num"
        label="活跃人数"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
      />
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onOresUser(row)">领取记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <ores-user
      v-if="oresUserVisible"
      ref="oresUser"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/ores'
import { DominKey, getToken } from '@/utils/auth'
import OresUser from './components/OresUser'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'Ores',
  components: { Pagination, OresUser },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        start: '',
        end: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      sceneOptions: [
        { label: '注册', value: 'register' },
        { label: '登录', value: 'login' },
        { label: '修改登录密码', value: 'update-login-pass' },
        { label: '设置/修改支付密码', value: 'set-pay-pass' }
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
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      oresUserVisible: false
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)){
        this.search.start = value[0]
        this.search.end = value[1]
      } else{
        this.search.start = ''
        this.search.end = ''
        this.getList(1)
      }
    },
    onOresUser(data) {
      this.oresUserVisible = true
      this.$nextTick(() => {
        this.$refs.oresUser && this.$refs.oresUser.init(data)
      })
    }
  }
}
</script>
