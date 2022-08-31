<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="钱包流水详情" top="30px" :visible.sync="visible" @closed="onClose()">
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
          label="账号"
          min-width="140"
          header-align="center"
        >
          <template slot-scope="{ row: { user } }">
            <div v-if="user">
              <el-avatar :key="user.id" icon="el-icon-user-solid" :src="user.avatar ? (domin + user.avatar) : ''" />
              <div style="display: inline-block;margin-left: 2px">
                <div>
                  {{ user.name }}
                </div>
                <div>
                  {{ user.tel || user.email }}
                </div>
              </div>
            </div>
            <div v-else>
            用户已删除
          </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.status === 0 ? 'warning' : 'success'">{{ statusOptions[row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="160"
          align="center"
        />
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getOresUser } from '@/api/ores'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'Wallet',
  components: { Pagination },
  data() {
    return {
      visible: false,
      domin: getToken(DominKey),
      data: {
        id: 0
      },
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
      statusOptions: [
        { label: '未领取', value: 0 },
        { label: '已领取', value: 1 }
      ],
      dateRangeValue: [],
      pickerOptions,
      loading: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page

      getOresUser(this.data.id, { page, ...this.search, limit: this.pages.limit })
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
      if (Array.isArray(value)) {
        this.search.start = value[0]
        this.search.end = value[1]
      } else {
        this.search.start = ''
        this.search.end = ''
        this.getList(1)
      }
    },
    onClose() {
      this.$reset('search', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1000px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
