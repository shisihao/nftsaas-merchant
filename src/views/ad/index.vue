<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          本地{{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="onHandleClick">
      <el-tab-pane label="我的广告" name="my" :disabled="loading">
        <div class="app-content">
          <div class="tab-box">
            <el-tabs v-model="activePosName" tab-position="left" @tab-click="onHandlePos">
              <el-tab-pane v-for="(value, index) in adsPosOptions" :key="index" :label="value.label" :name="`pos_${value.value}`" />
            </el-tabs>
          </div>
          <div class="app-box">
            <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
            <div v-else class="all-card">
              <el-card v-for="(value, index) in list" :key="index" class="box-card" shadow="hover">
                <div slot="header">
                  <div style="position: relative;">
                    <div>
                      {{ value.pos ? value.pos.name : '' }}
                    </div>
                    <div style="position: absolute;right: 0;top: 0;">
                      <el-link v-if="value.url_type === 1" :href="value.url" type="primary" target="_blank">{{ value.url_type | paraphrase(adTypeOptions) }}</el-link>
                      <el-link v-else :underline="false">{{ value.url_type | paraphrase(adTypeOptions) }}</el-link>
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <el-image
                    class="image-item"
                    :src="value.image && domin + value.image"
                    :preview-src-list="[value.image && domin + value.image]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <div class="ellipsis new-title"> {{ value.title }} </div>
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
          </div>
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
import { dataList, deleteData, dataLibraryList, posList } from '@/api/ad'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'Ad',
  components: { Pagination, AddOrUpdate, ElImageViewer },
  data() {
    return {
      loading: false,
      imageViewer: false,
      addOrUpdateVisible: false,
      previewVisible: false,
      domin: getToken(DominKey),
      activePosName: 'pos_',
      adsPosOptions: [],
      imageViewerList: [],
      activeName: 'my',
      list: [],
      adTypeOptions: [
        { label: '静态展示', value: 0 },
        { label: '外链广告', value: 1 },
        { label: '内联广告', value: 2 }
      ],
      search: {
        pos: ''
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
      this.getPosList()
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
    getPosList() {
      posList()
        .then(response => {
          const posOptions = [{ label: '全部', value: '' }]
          const showOptions = []
          response.data.map(v => {
            if (!['app:goods', 'app:box'].includes(v.alias)) {
              showOptions.push({
                label: v.name,
                value: v.id,
                size: v.size
              })
            }
          })
          this.adsPosOptions = posOptions.concat(showOptions)
        })
    },
    onHandleClick() {
      this.getList(1)
    },
    onHandlePos() {
      this.search.pos = this.activePosName.split('_')[1]
      this.getList(1)
    },
    onDelete({ title, id }) {
      this.$confirm(
        `确定对(#${id})[${title}]进行[删除]操作?`, '删除', {
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
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data, this.adsPosOptions)
      })
    },
    onPreview(data) {
      this.imageViewerList = [this.domin + data.image]
      this.imageViewer = true
    },
    closeViewer() {
      this.imageViewer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.app-content {
  display: flex;
  min-height: 400px;
  .tab-box {
    width: 190px;
    flex-shrink: 0;
    .el-tabs {
      position: relative;
      width: 100%;
      height: 100%;
      ::v-deep .el-tabs__header {
        float: none;
        width: 100%;
        .is-active {
          background-color: #E7F7FF;
        }
        .is-left {
          text-align: left;
          margin-right: 0;
        }
      }
    }
  }
  .app-box {
    flex-grow: 1;
    padding: 0 20px;
  }
}
.all-card {
  display: flex;
  flex-wrap: wrap;
}
.box-card {
  width: 260px;
  height: 300px;
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
  height: 145px;
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
