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
        prop="message.title"
        label="消息标题"
        header-align="center"
      />
      <el-table-column
        prop="message.content"
        label="系统消息"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div class="RichContent-collapsedText" :class="{ellipsis: row.ellipsis}">
            {{ row.message.content }}
            <div class="RichContent-lookText" @click="onLookAll($index)">
              {{ row.ellipsis ? '查看全部' : '收起内容' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="发送时间"
        width="150"
        align="center"
      />
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="danger" :loading="row.loadingDel" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getMessage, delMessage } from '@/api/tenant'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'Whisper',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        start: '',
        end: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      dateRangeValue: [],
      pickerOptions,
      loading: false,
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
      getMessage({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            return Object.assign(v, { ellipsis: true, loadingDel: false })
          })
          this.pages.total = response.data.total

          // 重新获取消息未读
          this.$store.dispatch('user/getMsgCount')
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
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
          type: 'error'
        }
      )
        .then(() => {
          row.loadingDel = true
          delMessage(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              row.loadingDel = true
              this.getList()
            })
            .catch(() => {
              row.loadingDel = false
            })
        })
        .catch(() => {})
    },
    onLookAll(index) {
      if (this.list[index].ellipsis) {
        this.list[index].ellipsis = false
      } else {
        this.list[index].ellipsis = true
      }
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
