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
        label="藏品信息"
        min-width="300"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src=" row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]"
              :preview-src-list="[ row.goods && row.goods.images.length > 0 && domin + row.goods.images[0] ]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div style="margin-left: 10px">
              <div>#{{ row.goods.id || '' }}</div>
              <div v-if="row.goods && row.goods.name">
                名称：{{ row.goods.name || '' }}
              </div>
              <div>藏品编号：{{ row.goods.serial }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag>{{ row.type | paraphrase(interestsGiveOptions) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="cast_num"
        label="铸造券数量"
        align="center"
      />
      <el-table-column
        prop="voucher_num"
        label="兑换券数量"
        align="center"
      />
      <el-table-column
        width="140"
        prop="created_at"
        label="创建时间"
        header-align="center"
      />
      <el-table-column
        label="操作"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-give
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { giveDataList } from '@/api/interest'
import { getToken, DominKey } from '@/utils/auth'
import { interestsGiveOptions } from '@/utils/explain'
import AddOrUpdateGive from './components/AddOrUpdateGive'
import Pagination from '@/components/Pagination'

export default {
  name: 'Give',
  components: { AddOrUpdateGive, Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      interestsGiveOptions,
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
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
      giveDataList({ page, limit: this.pages.limit })
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
    }
  }
}
</script>
<style lang="scss" scoped>
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

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
