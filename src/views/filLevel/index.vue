<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="名称">
          <el-input v-model="search.keywords" placeholder="期数名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="专区">
          <el-select v-model="search.type" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in zoneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="search.cate" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in catesOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否分发">
          <el-select v-model="search.is_issue" clearable @clear="getList(1)" @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}期数
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
        prop="node"
        label="节点号"
        header-align="center"
      />
      <el-table-column
        prop="name"
        label="期数"
        align="center"
      />
      <el-table-column
        prop="type"
        label="专区"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.type ? row.type.toUpperCase() : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cate"
        label="期数类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type)">
            {{ row.cate | paraphrase(catesOptions) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="spec_name"
        label="规格"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type)">
            {{ row.specs ? row.specs.name : '-' }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="今日是否分发"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link v-if="row.issue_status" type="success" :underline="false">是</el-link>
          <el-link v-else type="danger" :underline="false">否</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="利息"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type)">
            {{ parseFloat(row.interest) }}%
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gas"
        label="剩余借贷Gas"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type)">
            {{ parseFloat(row.gas) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pledge"
        label="剩余借贷质押"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type)">
            {{ parseFloat(row.pledge) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_bonus"
        label="分红奖励"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.is_bonus"
            :inactive-value="0"
            :active-value="1"
            @change="onChangeMore(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="比例"
        min-width="160"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.extend && ['fil'].includes(row.type)">
            <div>
              可提现金额比例：{{ row.extend.withdrawable }}
            </div>
            <div>
              锁仓金额比例：{{ row.extend.lock }}
            </div>
            <div>
              抵押金额比例：{{ row.extend.pawn }}
            </div>
            <div>
              冻结金额比例：{{ row.extend.frozen }}
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="归还利息比例"
        min-width="160"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="['fil'].includes(row.type) && row.cate === 0">
            <div>
              应还利息比例：{{ row.should_radio }}
            </div>
            <div>
              欠款利息比例：{{ row.arrears_radio }}
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="运营维护费"
        min-width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>回本前：{{ parseFloat(row.before) }}%</div>
          <div>回本后：{{ parseFloat(row.after) }}%</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="270"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button plain type="primary" @click="onAddPeriodsd(row)">分发收益</el-button>
            <el-button plain type="primary" style="border-left-color: #a3d3ff;" @click="onLevelLogs(row)">分发记录</el-button>
            <el-button v-if="['fil'].includes(row.type) && [0].includes(row.cate)" plain type="primary" style="border-left-color: #a3d3ff;" @click="onPeriodsBack(row)">归还流水</el-button>
          </el-button-group>
          <el-button-group style="margin-top: 6px;">
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
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

    <!-- 弹窗, 新增 / 修改 -->
    <level-logs
      v-if="levelLogsVisible"
      ref="levelLogs"
    />

    <!-- 弹窗, 新增 / 修改 -->
    <add-periodsd
      v-if="addPeriodsdVisible"
      ref="addPeriodsd"
      @refreshList="getList()"
    />

    <!-- 归还流水-->
    <periods-back
      v-if="periodsBackVisible"
      ref="periodsBack"
    />

  </div>
</template>

<script>
import { dataList, deleteData, moreStatus } from '@/api/fil-level'
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import AddOrUpdate from './components/AddOrUpdate'
import LevelLogs from './components/LevelLogs'
import AddPeriodsd from './components/AddPeriod'
import PeriodsBack from './components/PeriodsBack'
import { zoneOptions, catesOptions, whetherOptions } from '@/utils/explain'

export default {
  name: 'FilLevel',
  components: { Pagination, AddOrUpdate, LevelLogs, AddPeriodsd, PeriodsBack },
  provide: function() {
    return {
      refreshList: this.init
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      zoneOptions,
      catesOptions,
      whetherOptions,
      search: {
        type: '',
        cate: '',
        keywords: '',
        is_issue: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false,
      levelLogsVisible: false,
      addPeriodsdVisible: false,
      periodsBackVisible: false,
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
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onLevelLogs(data) {
      this.levelLogsVisible = true
      this.$nextTick(() => {
        this.$refs.levelLogs && this.$refs.levelLogs.init(data)
      })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onAddPeriodsd(data) {
      this.addPeriodsdVisible = true
      this.$nextTick(() => {
        this.$refs.addPeriodsd && this.$refs.addPeriodsd.init(data)
      })
    },
    onPeriodsBack(row) {
      this.periodsBackVisible = true
      this.$nextTick(() => {
        this.$refs.periodsBack && this.$refs.periodsBack.init(row)
      })
    },
    onDelete({ name, id }) {
      this.$confirm(
        `确定对[${name}(#${id})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onChangeMore(row) {
      moreStatus({ id: row.id, is_bonus: row.is_bonus })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          row.is_bonus = row.is_bonus ? 0 : 1
        })
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
.el-link {
  cursor: auto;
}
</style>
