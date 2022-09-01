<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search" />
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
              fit="contain"
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
        width="160"
        prop="zone"
        label="活动参数"
        align="center"
      />
      <el-table-column
        width="70"
        label="上架状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <div :style="row.status === 0 ? 'color:#67C23A;' : ''">{{ row.status | paraphrase(statusOptions) }}</div>
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
        width="90"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-zone
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { zoneList } from '@/api/activity'
import { getToken, DominKey } from '@/utils/auth'
import { statusOptions } from '@/utils/explain'
import AddOrUpdateZone from './components/AddOrUpdateZone'

export default {
  name: 'Activities',
  components: { AddOrUpdateZone },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      statusOptions,
      list: [],
      search: {},
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
    getList() {
      this.loading = true
      zoneList(this.search)
        .then(response => {
          this.list = response.data
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
