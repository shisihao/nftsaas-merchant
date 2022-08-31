<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
        {{ $t('table.add') }}
      </el-button>
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
        prop="icon"
        label="图标"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            v-if="row.icon"
            style="width: 80px;"
            :src="row.icon && domin + row.icon"
            :preview-src-list="[row.icon && domin + row.icon]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center"
      />
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="{ row,$index }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button v-show="( $index+ 1 ) === list.length" type="danger" @click="onDelete(row)">删除</el-button>
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
import { dataList } from '@/api/agent'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import { deleteData } from '@/api/agent'

export default {
  name: 'Agent',
  components: { AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      addOrUpdateVisible: false,
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      dataList()
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data
        })
        .catch(() => {
        })
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
    onDelete({ id }) {
      this.$confirm(`确定对[(#${id})]进行[删除]操作?<div style="color: #e6a23c;">若该等级下存在用户，用户等级归0，业绩不归0</div>`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
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
    }
  }
}
</script>
