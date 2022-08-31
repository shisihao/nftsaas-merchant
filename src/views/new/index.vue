<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="标题">
          <el-input v-model="search.keywords" placeholder="标题" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-select v-model="search.is_top" placeholder="请选择" clearable @clear="getList(1)" @change="getList(1)">
            <el-option
              v-for="item in topOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          本地{{ $t('table.add') }}
        </el-button>
        <el-button type="warning" icon="el-icon-collection-tag" :disabled="checkedNews.length === 0" @click="onBatchNews(checkedNews)">
          一键同步
        </el-button>
      </el-form>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="onHandleClick">
      <el-tab-pane label="我的资讯" name="my" :disabled="loading">
        <div class="app-content">
          <div class="tab-box">
            <el-tabs v-model="activeCateName" tab-position="left" @tab-click="onHandleCate">
              <el-tab-pane :label="value.label" :name="`cate_${value.value}`" :key="index" v-for="(value, index) in newsCateOptions"/>
            </el-tabs>
          </div>
          <div class="app-box">
            <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据"></el-empty>
            <div v-else class="all-card">
              <el-card class="box-card" shadow="hover" :key="index" v-for="(value, index) in list">
                <div slot="header">
                  <div style="position: relative;">
                    <div>
                      ID: {{ value.id }}
                    </div>
                    <div style="position: absolute;right: 0;top: 0;">
                      <el-tag v-if="value.is_top" effect="plain" style="cursor: pointer;" @click="onNewTop(value)">已置顶</el-tag>
                      <el-tag v-else type="info" effect="plain" style="cursor: pointer;" @click="onNewTop(value)">设置置顶</el-tag>
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <el-image
                    class="image-item"
                    :src="value.cover ? domin + value.cover : ''"
                    :preview-src-list="[value.cover ? domin + value.cover : '']"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <div class="ellipsis new-title"> {{ value.title }} </div>
                </div>

                <div class="card-footer">
                  <section @click="onAddOrUpdate(value)">
                    <i class="el-icon-edit-outline" style="color: #409eff;"/>
                  </section>
                  <section @click="onComments(value)">
                    <i class="el-icon-chat-line-round" style="color: #409eff;"/>
                  </section>
                  <section @click="onDelete(value)">
                    <i class="el-icon-delete" style="color: #f56c6c;"/>
                  </section>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资讯库" name="stock" :disabled="loading">
        <div class="app-content">
          <div class="tab-box">
            <el-tabs v-model="activeCateName" tab-position="left" @tab-click="onHandleCate">
              <el-tab-pane :label="value.label" :name="`cate_${value.value}`" :key="index" v-for="(value, index) in newsCateLibraryOptions"/>
            </el-tabs>
          </div>
          <div class="app-box">
            <div>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="onCheckedAll">全选</el-checkbox>
            </div>
            <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据"></el-empty>
            <div v-else class="all-card">
              <el-card class="box-card" shadow="hover" :key="index" v-for="(value, index) in list">
                <div slot="header">
                  <div style="display: flex;justify-content: space-between;">
                    <div>
                      ID: {{ value.id }}
                    </div>
                    <div>
                      <el-checkbox v-model="value.checked" :true-label="value.id" false-label="" @change="onCheckedItem(value.id)" />
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <el-image
                    class="image-item"
                    :src="value.cover ? domin + value.cover : ''"
                    :preview-src-list="[value.cover ? domin + value.cover : '']"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <div class="ellipsis new-title"> {{ value.title }} </div>
                </div>

                <div class="card-footer card-footer1">
                  <section @click="onAddOrUpdate(value)">
                      <el-link type="primary" :underline="false">基于该资讯编辑</el-link>
                  </section>
                  <section @click="onPreview(value)">
                    <i class="el-icon-view" style="color: #409eff;"/>
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

    <!-- 评论 -->
    <comments
      v-if="commentsVisible"
      ref="comments"
    />

    <preview
      v-if="previewVisible"
      ref="preview"
    />

    <batch-check
      v-if="batchCheckVisible"
      ref="batchCheck"
      @refreshList="clearBatch"
    />
    
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData, setNewTop, dataLibraryList} from '@/api/new'
import { dataLibraryList as dataCateLibraryList } from '@/api/news-cate'
import { powerCateList } from '@/api/news-cate'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Comments from './components/Comments'
import Preview from './components/Preview'
import BatchCheck from './components/BatchCheck'

export default {
  name: 'new',
  components: { Pagination, AddOrUpdate, Comments, Preview, BatchCheck },
  data() {
    return {
      loading: false,
      addOrUpdateVisible: false,
      commentsVisible: false,
      previewVisible: false,
      batchCheckVisible: false,
      isIndeterminate: false,
      checkAll: false,
      domin: getToken(DominKey),
      activeName: 'my',
      activeCateName: 'cate_',
      newsCateOptions: [],
      newsCateLibraryOptions: [],
      checkedNews: [],
      list: [],
      search: {
        keywords: '',
        cate_id: '',
        is_top: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      topOptions: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCateList()
      this.getList()
      this.getCateLibraryList()
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
              return { ...v, stock: true, checked: false }
            } else {
              return { ...v, stock: false }
            }
          })
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    getCateList() {
      powerCateList()
        .then(response => {
          let cateOptions = [{ label: '全部', value: '' }]
          this.newsCateOptions = cateOptions.concat(response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          }))
        })
    },
    getCateLibraryList() {
      dataCateLibraryList()
        .then(response => {
          let cateOptions = [{ label: '全部', value: '' }]
          this.newsCateLibraryOptions = cateOptions.concat(response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          }))
        })
    },
    onDelete(row) {
      this.$confirm(`确定对[(#${row.id})]进行[删除]操作?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
        }
      )
        .then(() => {
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onNewTop(row) {
      this.$confirm(`确定对[(#${row.id})]进行[${row.is_top ? '取消' : ''}置顶]操作?${row.is_top ? '' : '每个栏目只能有一个置顶资讯，若已设置，则原有置顶取消！'}`, `${row.is_top ? '取消' : ''}置顶`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }
      )
        .then(() => {
          setNewTop({ id: row.id, status: row.is_top ? 0 : 1 })
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
        })
        .catch(() => {})
    },
    onHandleClick() {
      this.search.cate_id = ''
      this.activeCateName = 'cate_'
      this.getList(1)
    },
    onHandleCate() {
      this.search.cate_id = this.activeCateName.split('_')[1]
      this.getList(1)
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data, this.newsCateOptions)
      })
    },
    onComments(data) {
      this.commentsVisible = true
      this.$nextTick(() => {
        this.$refs.comments && this.$refs.comments.init(data)
      })
    },
    onPreview(data) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview && this.$refs.preview.init(data)
      })
    },
    onBatchNews(data) {
      this.batchCheckVisible = true
      this.$nextTick(() => {
        this.$refs.batchCheck && this.$refs.batchCheck.init(data, this.newsCateOptions)
      })
    },
    clearBatch() {
      this.checkedNews = []
      this.isIndeterminate = false
      this.getList()
    },
    onCheckedItem(val) {
      if (this.checkedNews.includes(val)) {
        this.checkedNews.splice(this.checkedNews.indexOf(val), 1)
        this.list.forEach((v, i) => {
          if (v.id === val) {
            this.list[i].checked = false
          }
        })
        if (this.checkedNews.length === 0) {
          this.checkAll = false
        }
      } else {
        this.checkedNews.push(val)
        this.list.forEach((v, i) => {
          if (v.id === val) {
            this.list[i].checked = true
          }
        })
        if (this.checkedNews.length === this.list.length) {
          this.checkAll = true
        }
      }
      this.checkedIndeterminate()
    },
    onCheckedAll(val) {
      if (val) {
        this.checkedNews = this.list.map(v => {
          return v.id
        })
      } else {
        this.checkedNews = []
      }

      this.list.forEach((v, i) => {
        this.list[i].checked = val
      })
      this.checkedIndeterminate()
    },
    checkedIndeterminate() {
      if(this.checkedNews.length > 0 && this.checkedNews.length < this.list.length) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
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
  
  .all-card {
    display: flex;
    flex-wrap: wrap;
    .box-card {
      width: 260px;
      min-height: 300px;
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
            width: 33.3%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:nth-child(2) {
              width: calc(33.3% - 2px);
              border-left: 1px solid #e6ebf5;
              border-right: 1px solid #e6ebf5;
            }
          }
        }
        .card-footer1 {
          section {
            width: 50%;
            &:nth-child(2) {
              width: calc(50% - 1px);
              border-right: 0;
            }
          }
        }
      }
    }
  }
}
.new-title {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
.image-item {
  height: 220px;
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