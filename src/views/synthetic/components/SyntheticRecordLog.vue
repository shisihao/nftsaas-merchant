<template>
  <div>
    <el-dialog
      class="custom-dialog"
      width="1200px"
      top="30px"
      title="合成记录"
      :visible.sync="visible"
      @closed="onClose()"
    >
      <el-form ref="form" :inline="true" label-width="80px">
        <el-form-item>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
            {{ $t('table.export') }} Excel
          </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" border :data="list">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="用户信息" min-width="200" header-align="center">
          <template slot-scope="{ row }">
            <el-avatar
              icon="el-icon-user-solid"
              style="vertical-align: top"
              :src="row.user.avatar ? domin + row.user.avatar : ''"
            />
            <div style="display: inline-block; margin-left: 5px">
              <div>
                #{{ row.user.id || '' }}
                <el-divider direction="vertical" />
                {{ row.user.name || '' }}
              </div>
              <div>电话：{{ row.user.phone || '' }}</div>
              <div />
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="240" label="合成信息" header-align="center">
          <template slot-scope="{ row }">
            <div class="info-wrapper">
              <el-image
                class="image-item"
                :src="row.goods.images[0] && domin + row.goods.images[0]"
                :preview-src-list="[domin + row.goods.images[0]]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div style="margin-left: 10px">
                <div>#{{ row.goods.id || '' }}</div>
                <div>藏品编号：{{ row.goods.serial || '' }}</div>
                <div>藏品名称：{{ row.goods.name || '' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="信息" header-align="center">
          <template slot-scope="{ row }">
            <div>HASH：{{ row.hash || '' }}</div>
            <div>链上标识：{{ row.identification || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" header-align="center">
          <template slot-scope="{ row }">
            {{ row.created_at }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="pages.total > 0"
        auto-scroll-dom=".custom-dialog"
        :total="pages.total"
        :page.sync="pages.current"
        :limit.sync="pages.limit"
        @pagination="getList()"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { synthesisLog, synthesisLogExport } from '@/api/synthetic'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'SyntheticRecordLog',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      downloadLoading: false,
      list: [],
      domin: getToken(DominKey),
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      id: 0
    }
  },
  methods: {
    init(data) {
      this.id = data.id
      this.visible = true
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      synthesisLog(this.id, { page, limit: this.pages.limit })
        .then((response) => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      synthesisLogExport(this.id)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    },
    onClose() {
      this.$reset('data', false)
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
</style>
