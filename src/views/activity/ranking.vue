<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
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
        width="100"
        label="活动类型"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.condition.type | paraphrase(activityTypeOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        prop="reward_num"
        label="奖励人数"
        align="center"
      />
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
        width="350"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button :loading="row.downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload(row)">
              {{ $t('table.export') }} Excel
            </el-button>
            <el-button type="info" icon="el-icon-refresh" :loading="row.refreshLoading" :disabled="currentTime > row.end_time" @click="onRefreshList(row)">
              刷新排行
            </el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-ranking
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { rankingList, deleteRanking, exportRanking, refreshList, putRankingStatus } from '@/api/activity'
import { getToken, DominKey } from '@/utils/auth'
import { statusOptions } from '@/utils/explain'
import AddOrUpdateRanking from './components/AddOrUpdateRanking'
import Pagination from '@/components/Pagination'
import { activityTypeOptions } from '@/utils/explain'
import moment from 'moment'

export default {
  name: 'Activities',
  components: { AddOrUpdateRanking, Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      statusOptions,
      activityTypeOptions,
      search: {},
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      list: [],
      addOrUpdateVisible: false

    }
  },
  computed: {
    currentTime: () => {
      return moment().format('YYYY-MM-DD HH:mm:ss')
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
      rankingList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.map(v => {
            return Object.assign(v, { downloadLoading: false, refreshLoading: false })
          })
          this.pages.total = response.data.total
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
          deleteRanking(row.id)
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
    onHandleDownload(row) {
      if (row.downloadLoading) return
      row.downloadLoading = true
      exportRanking({ activity_id: row.id })
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          row.downloadLoading = false
        })
    },
    onRefreshList(row) {
      if (row.refreshLoading) return
      row.refreshLoading = true
      refreshList(row.id)
        .then(({ msg = '刷新成功' }) => {
          this.$message.success(msg)
        })
        .catch(_ => {})
        .finally(() => {
          row.refreshLoading = false
        })
    },
    onChangeStatus(row) {
      putRankingStatus({ id: row.id, status: row.status }).then(res => {
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
