<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="资产流水详情" top="30px" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <span>
            当前用户：
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="data.avatar && domin + data.avatar" />
            {{ data.name }}
          </span>
          <el-divider direction="vertical" />
          {{ data.phone || data.email }}
          <el-divider direction="vertical" />
          <el-button type="primary" size="mini" @click="onSetWallet(data)">资产增加/扣除</el-button>
        </el-col>
      </el-row>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <span style="color: #409eff;">{{ `${collapseTitle ? '收起' : '展开' }资产详情` }}</span>
          </template>
          <div v-for="(item, index) in walletDetail" :key="index">
            <template v-if="item.currency === 'integral'">
              <el-divider content-position="left">{{ integral }}数量</el-divider>
              <el-row>
                <el-col :span="8">剩余：{{ item.balance || 0 | cutZero }}</el-col>
                <el-col :span="8">收入：{{ item.income || 0 | cutZero }}</el-col>
                <el-col :span="8">支出：{{ item.expend || 0 | cutZero }}</el-col>
              </el-row>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
      <p />
      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="收支">
            <el-select v-model="search.action" clearable @change="getList(1)" @clear="getList(1)">
              <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="资产类型">
            <el-select v-model="search.currency" @clear="getList(1)" @change="getList(1)">
              <el-option v-for="item in payTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="流水类型">
            <el-select v-model="search.type" @clear="getList(1)" @change="getList(1)">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
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
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
            导出流水Excel
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
          label="标题"
          align="center"
        />
        <el-table-column
          prop="amount"
          label="数量"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.amount | cutZero }}
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="收支类型"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.action === 1 ? 'primary' : 'danger'"> {{ row.action | paraphrase(actionOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="资产类型"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag> {{ row.currency | paraphrase(payTypeOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="流水类型"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag> {{ row.type | paraphrase(typeOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="140"
          align="center"
        />
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>
    <!-- 增加/扣除 -->
    <set-wallet
      v-if="setWalletVisible"
      ref="setWallet"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { wallet, walletList, exportExcel } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'
import SetWallet from './SetWallet'
import { pickerOptions, payTypeOptions } from '@/utils/explain'

export default {
  name: 'Wallet',
  components: { Pagination, SetWallet },
  data() {
    return {
      visible: false,
      downloadLoading: false,
      payTypeOptions,
      typeOptions: [
        { label: '全部', value: '' },
        { label: '完成任务', value: 'complete_task' },
        { label: '开启盲盒', value: 'box_open' },
        { label: '购买商品', value: 'goods' },
        { label: '购买盲盒', value: 'box' },
        // { label: '藏品铸造', value: 'cast' },
        // { label: '铸造券购买', value: 'cast_buy' },
        // { label: '话题上链', value: 'topic' },
        { label: '申购抽签', value: 'activity' },
        // { label: '徽章兑换', value: 'badge' },
        { label: '退款', value: 'refund' },
        { label: '其它', value: 'admin_assets' },
        { label: '实体商品', value: 'entity_goods' },
        { label: `${this.integral}奖励`, value: 'integral_reward' }
      ],
      domin: getToken(DominKey),
      data: {
        id: 0,
        name: '',
        phone: '',
        email: '',
        avatar: ''
      },
      walletCustomData: {
        balance: 0,
        income: 0,
        expend: 0
      },
      list: [],
      search: {
        currency: '',
        action: '',
        type: '',
        start_time: '',
        end_time: '',
        cate: '',
        user_id: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      actionOptions: [
        { label: '全部', value: '' },
        { label: '收入', value: 1 },
        { label: '支出', value: 2 }
      ],
      walletDetail: [
      ],
      dateRangeValue: [],
      activeNames: ['1'],
      collapseTitle: 1,
      pickerOptions,
      loading: false,
      loadingWallet: false,
      setWalletVisible: false
    }
  },
  computed: {
    ...mapGetters(['integral'])
  },
  watch: {
    activeNames(val, oldVal) { // 普通的watch监听
      this.collapseTitle = val.length ? 1 : 0
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = data
        this.search.user_id = data.id
        this.getList()
        this.wallets()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      walletList({ user_id: this.data.id, page, ...this.search, limit: this.pages.limit })
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
    wallets() {
      wallet({ uid: this.data.id }).then(response => {
        this.walletDetail = response.data
      })
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
    onClose() {
      this.$reset('data', false)
    },
    onSetWallet(data) {
      this.setWalletVisible = true
      this.$nextTick(() => {
        this.$refs.setWallet && this.$refs.setWallet.init(data)
      })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportExcel(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1240px;
}
::v-deep .user-avatar{
  vertical-align: middle;
}
</style>
