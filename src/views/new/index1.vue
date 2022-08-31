<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="标题">
          <el-input v-model="search.keywords" placeholder="标题" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="栏目">
          <el-select v-model="search.cate_id" placeholder="请选择" clearable @clear="getList(1)" @change="getList(1)">
            <el-option
              v-for="item in newsCateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="url"
        label="封面"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            class="image-item"
            :src="row.cover ? domin + row.cover : ''"
            :preview-src-list="[row.cover ? domin + row.cover : '']"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        header-align="center"
      />

      <el-table-column
        prop="cate.name"
        label="栏目"
        header-align="center"
      />
      <el-table-column
        label="置顶"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag v-if="row.is_top" effect="plain" style="cursor: pointer;" @click="onNewTop(row)">已置顶</el-tag>
          <el-tag v-else type="info" effect="plain" style="cursor: pointer;" @click="onNewTop(row)">设置置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="数据"
        header-align="center"
      >
        <template slot-scope="{ row: { like_num, comment_num } }">
          <div>喜欢：{{ like_num }}</div>
          <div>评论：{{ comment_num }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="210"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="onComments(row)">评论</el-button>
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

    <!-- 评论 -->
    <comments
      v-if="commentsVisible"
      ref="comments"
    />

  </div>
</template>

<script>
import { dataList, deleteData, setNewTop } from '@/api/new'
import { powerCateList } from '@/api/news-cate'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import Comments from './components/Comments'
import Pagination from '@/components/Pagination'

export default {
  name: 'New',
  components: { Pagination, AddOrUpdate, Comments },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      newsCateOptions: [],
      topOptions: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
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
      addOrUpdateVisible: false,
      commentsVisible: false,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.getCateList()
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
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(error => {
        })
        .finally(() => {
          this.loading = false
        })
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
    }
  }
}
</script>
<style scoped>
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
::v-deep .el-image {
  width: 80px;
  min-height: 80px;
  margin: 0 auto;
}
.image-item {
  height: 100%;
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
