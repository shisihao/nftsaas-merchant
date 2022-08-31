<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="评论列表" top="30px" :visible.sync="visible" @closed="onClose()">
      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="昵称">
            <el-input v-model="search.username" placeholder="昵称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-form-item label="评论内容">
            <el-input v-model="search.keywords" placeholder="评论内容(支持模糊搜索)" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-button icon="el-icon-search" @click="getList(1)">
            {{ $t('table.search') }}
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
          label="账号"
          min-width="140"
          header-align="center"
        >
          <template slot-scope="{ row: { user } }">
            <div v-if="user">
              <el-avatar :key="user.id" icon="el-icon-user-solid" :src="user.avatar ? (domin + user.avatar) : ''" />
              <div style="display: inline-block;margin-left: 2px">
                <div>
                  {{ user.name }}
                </div>
                <div>
                  {{ user.phone || user.email }}
                </div>
              </div>
            </div>
            <div v-else>
              用户已删除
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          align="center"
        />
        <el-table-column
          prop="like_num"
          label="点赞数量"
          align="center"
        />
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="160"
          align="center"
        />
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getCommentsList, deleteComment } from '@/api/new'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Comments',
  components: { Pagination },
  data() {
    return {
      visible: false,
      domin: getToken(DominKey),
      list: [],
      data: {
        id: 0
      },
      search: {
        username: '',
        keywords: '',
        is_delete: 0
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page

      getCommentsList(this.data.id, { page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onDelete(row) {
      this.$confirm(
        `确定对[(#${row.id})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteComment(this.data.id,row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(({ msg = '删除失败' }) => {
              this.$message.error(msg)
            })
        })
        .catch(() => {})
    },
    onClose() {
      this.$reset('search', false)
      this.$reset('walletData', false)
      this.$reset('data', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1000px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
