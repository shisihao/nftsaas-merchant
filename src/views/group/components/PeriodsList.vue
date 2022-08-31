<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="分组期数" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <span>
            # {{ data.id }}
            <el-divider direction="vertical" />
            专区：<span style="text-transform:uppercase;">{{ data.zone }}</span>
            <el-divider direction="vertical" />
            {{ ['fil', 'bzz'].includes(data.zone) ? '节点号' : '分组名称' }}：{{ data.name }}
          </span>
        </el-col>
      </el-row>

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
          label="期数名称"
          header-align="center"
        />
        <el-table-column
          prop="specs.name"
          label="规格"
          header-align="center"
        />
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="160"
          align="center"
        />
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
        <template slot-scope="{ row }">
          <el-button type="danger" :loading="row.loadingDel" @click="onDelLevel(row)">移除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import { getLevel, delLevel } from '@/api/group'

export default {
  name: 'PeriodsList',
  components: { Pagination },
  data() {
    return {
      visible: false,
      domin: getToken(DominKey),
      data: {
        id: 0,
        zone: '',
        name: ''
      },
      list: [],
      search: {
        currency: '',
        action: '',
        start: '',
        end: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      setWalletVisible: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        Object.keys(this.data).forEach(item => {
          this.data[item] = data[item]
        })
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      getLevel({ group_id: this.data.id, page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map( v => {
            return {
              ...v,
              loadingDel: false
            }
          })
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('data', false)
    },
    onDelLevel(row) {
      row.loadingDel = true
      this.$confirm(`确定对[(#${row.id})]进行操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          delLevel(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
              row.loadingDel = false
            })
        })
        .catch(() => {
          row.loadingDel = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 800px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
