<template>
  <div class="app-container">
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
        prop="name"
        label="权益名称"
        align="center"
      />
      <el-table-column
        prop="describe"
        label="权益描述"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip popper-class="popover-box" effect="dark" :content="row.describe" placement="top">
            <div class="ellipsis">
              {{ row.describe }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        width="120"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.type | paraphrase(interestsOptions, 'value', 'type') ">
            {{ row.type | paraphrase(interestsOptions) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        prop="created_at"
        label="创建时间"
        header-align="center"
      />
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { dataList } from '@/api/interest'
import { pickerOptions, interestsOptions } from '@/utils/explain'
import AddOrUpdate from './components/AddOrUpdate'
export default {
  name: 'InterestManagement',
  components: { AddOrUpdate },
  data() {
    return {
      loading: false,
      pickerOptions,
      interestsOptions,
      list: [],
      pages: {
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
      dataList({ page, limit: this.pages.limit })
        .then(response => {
          this.list = response.data
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
  .el-tag {
    margin-right: 4px;
  }
  .hot-tag {
    position: absolute;
    font-size: 36px;
    left: 0;
    top: 0;
  }
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
