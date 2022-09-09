<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="名称">
          <el-input v-model="search.name" placeholder="名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          本地{{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="onHandleClick">
      <el-tab-pane label="我的海报" name="my" :disabled="loading">
        <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
        <div v-else class="all-card">
          <el-card v-for="(value, index) in list" :key="index" class="box-card" shadow="hover">
            <div slot="header">
              <div class="ellipsis"> {{ value.name }} </div>
            </div>
            <div v-if="value.url" class="card-content">
              <el-image
                class="image-item"
                :src="value.url && domin + value.url"
                :preview-src-list="[value.url && domin + value.url]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
            <div v-else class="card-content">
              <el-empty description="请添加内容" />
            </div>
            <div class="card-footer">
              <section @click="onAddOrUpdate(value)">
                <i class="el-icon-edit-outline" style="color: #409eff;" />
              </section>
              <section @click="onDelete(value)">
                <i class="el-icon-delete" style="color: #f56c6c;" />
              </section>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

    <el-image-viewer
      v-if="imageViewer"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData, dataLibraryList } from '@/api/poster'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'Agreement',
  components: { Pagination, AddOrUpdate, ElImageViewer },
  data() {
    return {
      loading: false,
      imageViewer: false,
      addOrUpdateVisible: false,
      domin: getToken(DominKey),
      activeName: 'my',
      imageViewerList: [],
      list: [],
      search: {
        name: ''
      },
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
      this.list = []
      let api = dataList({ page, ...this.search, limit: this.pages.limit })
      if (this.activeName === 'stock') {
        api = dataLibraryList({ page, ...this.search, limit: this.pages.limit })
      }
      api
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            if (this.activeName === 'stock') {
              return Object.assign(v, { stock: true })
            } else {
              return Object.assign(v, { stock: false })
            }
          })
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleClick() {
      this.getList(1)
    },
    onDelete({ name, id }) {
      this.$confirm(
        `确定对(#${id})[${name}]进行[删除]操作?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          deleteData(id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {
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
    onPreview(data) {
      this.imageViewerList = [this.domin + data.url]
      this.imageViewer = true
    },
    closeViewer() {
      this.imageViewer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.all-card {
  display: flex;
  flex-wrap: wrap;
}
.box-card {
  width: 260px;
  height: 496px;
  margin: 10px;
  ::v-deep .el-card__header{
    height: 55px;
  }
  ::v-deep .el-card__body {
    height: calc(100% - 55px);
    padding: 0;
    .card-content {
      width: 100%;
      height: calc(100% - 60px);
      padding: 20px;
      margin-bottom: 19px;
      overflow: hidden;
      box-sizing: border-box;
      .el-empty__image {
        width: 60px;
      }
    }
    .card-footer {
        width: 100%;
        height: 40px;
        display: flex;
        border-top: 1px solid #e6ebf5;
        section {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:nth-child(2) {
            width: calc(50% - 1px);
            border-left: 1px solid #e6ebf5;
          }
        }
      }
  }
}
.image-item {
  height: 340px;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
::v-deep .image-item img {
  height: auto;
}
</style>
