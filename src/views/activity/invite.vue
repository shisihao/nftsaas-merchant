<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      border
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        width="120"
        label="封面图"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src="row.image && domin + row.image"
              :preview-src-list="[domin + row.image]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        label="活动标题"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="活动时间"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>开始：{{ row.start_time }}</div>
          <div>结束：{{ row.end_time }}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="70"
        label="上架状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            @change="onChangeStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        width="60"
        prop="sort"
        label="排序"
        align="center"
      />
      <el-table-column
        width="140"
        prop="created_at"
        label="创建时间"
        header-align="center"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" class="excel-btn" @click="onHandleDownload(row)">
            {{ $t('table.export') }} Excel
          </el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-invite
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { inviteList, deleteInvite, exportInvite, putInviteStatus } from '@/api/activity'
import AddOrUpdateInvite from './components/AddOrUpdateInvite'
import Pagination from '@/components/Pagination'
import { statusOptions, activityTypeOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Invite',
  components: { AddOrUpdateInvite, Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      loading: false,
      downloadLoading: false,
      data: {},
      addOrUpdateVisible: false,
      exportActivityVisible: false,
      statusOptions,
      activityTypeOptions,
      activity_id: 0,
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
      inviteList({ page, limit: this.pages.limit })
        .then(res => {
          this.list = res.data.data
          this.pages.total = res.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onDelete(row) {
      this.$confirm(`确定[(#${row.id})]进行[删除]操作?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          deleteInvite(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onHandleDownload(data) {
      this.downloadLoading = true
      exportInvite({ activity_id: data.id })
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    },
    onChangeStatus(row) {
      putInviteStatus({ id: row.id, status: row.status }).then(res => {
        this.$message.success(res.msg)
        this.getList()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
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
  }
</style>
