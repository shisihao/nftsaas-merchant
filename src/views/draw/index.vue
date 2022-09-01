<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="活动名称">
          <el-input v-model="search.keywords" placeholder="活动名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        min-width="180"
        label="活动标题"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="300"
        label="目标商品"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src="row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]"
              :preview-src-list="[row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div v-if="row.goods" style="margin-left: 10px">
              <div>
                #{{ row.goods.id || '' }}
              </div>
              <div>
                商品名称：{{ row.goods.name || '' }}
              </div>
              <div style="display: flex;align-items: center;">
                作者头像：
                <el-avatar
                  icon="el-icon-user-solid"
                  style="flex-shrink: 0;"
                  :src="row.goods.author_avatar ? domin + row.goods.author_avatar : ''"
                />
              </div>
              <div style="margin-left: 4px;flex-grow: 1;">
                作者名称：{{ row.goods.author || '-' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        width="70"
        label="中奖人数"
        align="center"
      />
      <el-table-column
        prop="integral_price"
        width="90"
        label="报名价格"
        align="center"
      />

      <el-table-column width="70" label="资格开关" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.open_status"
            :active-value="true"
            :inactive-value="false"
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
        width="70"
        label="上架状态"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.show_status | paraphrase(statusOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        width="170"
        label="活动时间"
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
        width="140"
        prop="open_time"
        label="开奖时间"
        header-align="center"
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
        width="210"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button v-if="[0].includes(row.status) && (+new Date(row.open_time) < +new Date())" type="warning" @click="openActivity(row)">开奖</el-button>
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
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

  </div>
</template>

<script>
import { dataList, deleteData, openData, openStatus } from '@/api/draw'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, statusOptions } from '@/utils/explain'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'Activities',
  components: { AddOrUpdate, Pagination },
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
      addOrUpdateVisible: false
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
    openActivity(row) {
      this.$confirm(`确定对抽奖活动[(#${row.id})]进行[开奖]操作?`, '开奖', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          openData(row.id)
            .then(({ msg = '开奖成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {
              this.$message.error('开奖失败')
            })
        })
        .catch(() => {})
    },
    onDelete(row) {
      this.$confirm(`确定对抽奖活动[(#${row.id})]进行[删除]操作?`, '删除', {
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
    onChangeStatus(row) {
      openStatus(row.id)
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row.open_status = !row.open_status
          this.$message.error(msg)
        })
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
