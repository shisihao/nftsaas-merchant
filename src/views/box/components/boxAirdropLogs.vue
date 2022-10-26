<template>
  <el-dialog
    top="30px"
    width="1000px"
    :title="form.status === 1 ? '盲盒空投成功记录' : '盲盒空投失败记录'"
    :visible.sync="visible"
    @closed="onClose()"
  >
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="空投记录" prop="cate">
        <el-select v-model="form.status" @change="getList(1)">
          <el-option
            v-for="item in airOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button
        v-if="form.status == 2"
        :loading="downloadLoading"
        type="success"
        icon="el-icon-document"
        @click="onHandleDownload"
      >
        {{ $t('table.export') }} Excel
      </el-button>
    </el-form>
    <el-table v-loading="loading" border highlight-current-row :data="list">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column
        v-if="form.status === 1"
        min-width="240"
        label="空投信息"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src="imageUrl(row) && domin + imageUrl(row)"
              :preview-src-list="[domin + imageUrl(row)]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div style="margin-left: 10px">
              <div v-if="row.user">
                #{{ row.user.id || '-' }}
                <el-divider direction="vertical" />
                {{ row.user.name || '-' }}
                <div>电话：{{ row.user.phone || '-' }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="form.status === 2"
        label="用户信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>#{{ row.user_id || '-' }}</div>
          <div>电话号码：{{ row.phone || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="form.status === 2"
        label="失败原因"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            popper-class="popover-box"
            effect="dark"
            :content="row.reason"
            placement="top"
          >
            <div class="ellipsis">
              {{ row.reason }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { exportOrder, airdropLogs, failedLogs } from '@/api/box'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'AirdropLogUpdate',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      loading: false,
      downloadLoading: false,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      airOptions: [
        { label: '成功记录', value: 1 },
        { label: '失败记录', value: 2 }
      ],
      form: {
        status: 1
      },
      search: {},
      box_id: 0,
      list: []
    }
  },
  computed: {
    imageUrl() {
      return (item) => {
        return item.image || item.box?.images[0]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.box_id = data.id
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.search = { box_id: this.box_id, page, limit: this.pages.limit }
      const api =
        this.form.status === 1
          ? airdropLogs(this.search)
          : failedLogs(this.search)
      this.list = []
      api
        .then((response) => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset()
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then((response) => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {})
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
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
::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
