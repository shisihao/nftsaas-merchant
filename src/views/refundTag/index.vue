<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      border
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
        label="原因类型"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.created_at|| '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.updated_at|| '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 同意 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList(1)"
    />
  </div>
</template>
<script>
import { dataList, deleteData } from '@/api/refundTag'
import AddOrUpdate from './components/AddOrUpdate'
export default {
  name: 'RefundTag',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      addOrUpdateVisible: false,
      loading: false,
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
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
      dataList({ page, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(
        `确定对(#${row.id})进行删除操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(row.id).then(({ msg }) => {
            this.$message.success(msg)
            this.getList()
          })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
