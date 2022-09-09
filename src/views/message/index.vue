<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item v-if="false" label="时间">
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
        <el-button v-if="false" icon="el-icon-search" @click="getList(1)">
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
        prop="title"
        label="消息标题"
        header-align="center"
      />
      <el-table-column
        prop="content"
        label="系统消息"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="onContent(row)">点击查看</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="管理员信息"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.sender ? row.sender.name : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="发送时间"
        width="150"
        align="center"
      />
      <el-table-column
        v-if="false"
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete({ row, $index })">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
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
      :add-or-update-visible.sync="addOrUpdateVisible"
      @refreshList="getList()"
    />

    <!-- 消息内容 -->
    <el-dialog
      :title="form.title"
      width="800px"
      append-to-body
      :visible.sync="editTinymceVisible"
    >
      <div class="dialog-img" v-html="form.content" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import { dataList, deleteData } from '@/api/message'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'Message',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        start: '',
        end: ''
      },
      form: {
        title: '',
        content: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      addOrUpdateVisible: false,
      editTinymceVisible: false
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
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start = value[0]
        this.search.end = value[1]
      } else {
        this.search.start = ''
        this.search.end = ''
        this.getList(1)
      }
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
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    },
    onContent(row) {
      this.form = { ...row }
      this.editTinymceVisible = true
    }
  }
}
</script>
<style scoped>
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
</style>
