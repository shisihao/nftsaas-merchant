<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="search.agency_id" clearable @change="getList(1)">
            <el-option v-for="item in agencyOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="实名">
          <el-select v-model="search.is_auth" clearable @change="getList(1)">
            <el-option v-for="item in authOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

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
        label="账号"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-avatar :key="row.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.avatar ? (domin + row.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              {{ row.name }}
              <span v-if="row.certification">
                <el-divider direction="vertical"></el-divider>
                <el-tag effect="plain">{{ row.certification.name }}</el-tag>
              </span>
            </div>
            <div>
              {{ row.phone || row.email}}
            </div>
            <div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="等级"
        width="100"
        align="center"
      >
        <template slot-scope="{ row: { agency } }">
          <div v-if="agency">{{ agency.name }}</div>
          <div v-else>注册用户</div>
        </template>
      </el-table-column>
      <el-table-column
        label="上级用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.parent">
            <el-avatar :key="row.parent.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.parent.avatar ? (domin + row.parent.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.parent.name }}
                <span v-if="row.parent.certification">
                  <el-divider direction="vertical"></el-divider>
                  <el-tag effect="plain">{{ row.parent.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.parent.phone || row.parent.email }}
              </div>
              <div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="邀请码"
        width="80"
        align="center"
      />
      <el-table-column
        label="查看提现地址"
        align="center"
      >
        <template slot-scope="{ row: { currency_address } }">
          <div v-if="currency_address">
            <el-tooltip class="item" effect="light" placement="bottom-start">
              <div slot="content">
                <div>FIL： {{ currency_address.fil_address }}</div>
                <div>ERC20： {{ currency_address.erc_address }}</div>
                <div>BTC： {{ currency_address.btc_address }}</div>
                <div>TRC20： {{ currency_address.usdt_trx_address }}</div>
                <div>XCH： {{ currency_address.xch_address }}</div>
              </div>
              <div class="ellipsis">
                <el-button type="text">查看提现地址</el-button>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawal"
        label="提现状态"
        align="center"
      >
        <template slot-scope="{ row: { withdrawal } }">
          <div v-if="withdrawal">
            <span :key="index" v-for="(value, key, index) in withdrawal">
              <span v-if="value === 0" style="margin-right: 2px;display: inline-block;text-decoration:line-through;">{{ key.toUpperCase() }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="bonus_status"
        label="分红奖励"
        width="70"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.bonus_status"
            :inactive-value="0"
            :active-value="1"
            @change="onChangeMore(row, 'bonus_status')"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="sales_status"
        label="销售奖励"
        width="70"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.sales_status"
            :inactive-value="0"
            :active-value="1"
            @change="onChangeMore(row, 'sales_status')"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="60"
        align="center"
      >
        <template slot-scope="{ row: { state } }">
          <el-tag v-if="state === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button plain type="primary" @click="onSubset(row)">团队</el-button>
            <el-button plain type="primary" style="border-left-color: #a3d3ff;" @click="onWallet(row)">钱包流水</el-button>
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

    <!-- 查看邀请 -->
    <subset
      v-if="subsetVisible"
      ref="subset"
    />

    <!-- 钱包 -->
    <wallet
      v-if="walletVisible"
      ref="wallet"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData, moreStatus, exportOrder } from '@/api/user'
import { dataList as agentList } from '@/api/agent'
import AddOrUpdate from './components/AddOrUpdate'
import Subset from './components/Subset'
import Wallet from './components/Wallet'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'user',
  components: { Pagination, AddOrUpdate, Subset, Wallet },
  data() {
    return {
      domin: getToken(DominKey),
      pickerOptions,
      dateRangeValue: [],
      list: [],
      search: {
        keywords: '',
        agency_id: '',
        is_auth: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      agencyOptions: [],
      authOptions: [
        { label: '全部', value: '' },
        { label: '否', value: 0 },
        { label: '是', value: 1 }
      ],
      loading: false,
      addOrUpdateVisible: false,
      subsetVisible: false,
      walletVisible: false,
      downloadLoading: false,
      updateAddressVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.onAgentList()
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
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
    onAgentList() {
      agentList()
        .then((response) => {
          this.agencyOptions = [{ label: '全部', value: '' }, { label: '注册用户', value: 0 }].concat(response.data.map(v => {
            return {
              label: v.name,
              value: v.id
            }
          }))
        })
        .catch(() => {})
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data, this.agencyOptions)
      })
    },
    onSubset(data) {
      this.subsetVisible = true
      this.$nextTick(() => {
        this.$refs.subset && this.$refs.subset.init(data)
      })
    },
    onWallet(data) {
      this.walletVisible = true
      this.$nextTick(() => {
        this.$refs.wallet && this.$refs.wallet.init(data)
      })
    },
    onDelete({ name, id }) {
      this.$confirm(`确定对(#${id})[${name}]进行[删除]操作？删除用户对整个市场关系影响较大？
      <div style="color: #f56c6c;">注：删除用户之后无法找回，并且该用户原有伞下用户整体向上移动层级，请谨慎操作</div>`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'error'
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
    onChangeMore(row, type) {
      let text
      if (type === 'bonus_status') {
        text = '关闭之后用户将无法获得您在[市场管理-代理管理]中设置的<b style="color: #f56c6c;">分红奖励</b>，是否确认禁用？'
      } else if (type === 'sales_status') {
        text = '关闭之后用户将无法获得您在[市场管理-代理管理]中设置的<b style="color: #f56c6c;">直推和间推奖励</b>，是否确认禁用？'
      }
      
      if (row[type] === 1 ) {
        this.handleMoreStatus(row, type)
      } else {
        this.$confirm(`确定对[(#${row.id})]进行操作?${text}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }
        )
          .then(() => {
            this.handleMoreStatus(row, type)
          })
          .catch(() => {
            row[type] = row[type] ? 0 : 1
          })
      }
    },
    handleMoreStatus(row, type) {
      moreStatus({id: row.id, type: type, status: row[type] })
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          row[type] = row[type] ? 0 : 1
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  width: 100%;
}
::v-deep .ellipsis span {
  display: inline-block;
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
