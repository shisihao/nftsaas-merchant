<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="活动标题">
          <el-input v-model="search.keywords" placeholder="活动标题" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
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
              :src="row.cover.filename && domin + row.cover.filename"
              :preview-src-list="[domin + row.cover.filename]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="200"
        label="活动标题"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        label="限量"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            库存：{{ row.limit_num || 0 }}
          </div>
          <div>
            用户合成限量：{{ row.user_limit_num || 0 }}
          </div>
          <div>
            剩余：{{ row.limit_num - row.synthesis_num }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="170"
        label="合成时间范围"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            开始：{{ row.start_time }}
          </div>
          <div>
            结束：{{ row.end_time }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="60"
        prop="sort"
        label="排序"
        align="center"
      />
      <el-table-column width="70" label="上架状态" align="center">
        <template slot-scope="{ row }">
          {{ row.status | paraphrase(statusOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        prop="created_at"
        label="创建时间"
        header-align="center"
      />
      <el-table-column
        label="操作"
        width="220"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="primary" plain @click="onRecordLog(row)">合成记录</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
    <!-- 合成记录 -->
    <synthetic-record-log
      v-if="recordVisible"
      ref="recordLog"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/synthetic'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, statusOptions } from '@/utils/explain'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'
import SyntheticRecordLog from './components/SyntheticRecordLog'

export default {
  name: 'Synthetic',
  components: { SyntheticRecordLog, AddOrUpdate, Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      pickerOptions,
      statusOptions: statusOptions.slice(1),
      dateRangeValue: [],
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        start_time: '',
        end_time: '',
        keywords: ''
      },
      addOrUpdateVisible: false,
      recordVisible: false
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
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onDelete(row) {
      this.$confirm(`确定对合成活动[(#${row.id})]进行[删除]操作?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          deleteData(row.id)
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
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onRecordLog(data) {
      this.recordVisible = true
      this.$nextTick(() => {
        this.$refs.recordLog && this.$refs.recordLog.init(data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .RichContent-collapsedText {
  position: relative;
  left: 0;
  top: 0;
  padding-right: 60px;
}
::v-deep .RichContent-lookText {
  position: absolute;
  right: 0;
  top: 0;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}
.info-wrapper {
  display: flex;
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
}
.el-tag {
  margin-right: 4px;
}
.hot-tag {
  position: absolute;
  font-size: 36px;
  left: 0;
  top: 0;
}
</style>
