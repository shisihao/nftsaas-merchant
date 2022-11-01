<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="钱包地址">
          <el-input v-model="search.address" placeholder="请输入钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <!-- <el-form-item label="用户身份">
          <el-select v-model="search.identity_id" clearable @change="getList(1)">
            <el-option v-for="item in identityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="实名认证">
          <el-select v-model="search.is_auth" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="服务商">
          <el-select v-model="search.partner_id" clearable placeholder="选择服务商" @change="getList(1)">
            <el-option v-for="item in partnerOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否禁用">
          <el-select v-model="search.state" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否禁言">
          <el-select v-model="search.is_forbid" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="现金消费额区间">
          <el-input-number v-model="search.cny_start" controls-position="right" :min="0" :precision="2" /> ~ <el-input-number v-model="search.cny_end" controls-position="right" :min="0" :precision="2" />
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
        <el-button type="success" icon="el-icon-document" @click="onHandleDownloadSerial">
          指定藏品{{ $t('table.export') }} Excel
        </el-button>
        <el-button v-if="integral_use" type="primary" icon="el-icon-plus" @click="airBalanceBtn">
          用户资产空投
        </el-button>
        <el-button type="primary" icon="el-icon-document" @click="onHandleDownloadFeeRank">
          导出用户消费金额排名
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
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-avatar :key="row.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.avatar ? (domin + row.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              {{ row.name }}
              <span v-if="row.certification">
                <el-divider direction="vertical" />
                <el-tag effect="plain">{{ row.certification.name }}</el-tag>
              </span>
            </div>
            <div>
              {{ row.phone || row.email }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="认证信息"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row : { certification }}">
          <div v-if="certification">
            <div>
              {{ certification.number }}
            </div>
          </div>
          <div v-else style="text-align: center">未认证</div>
        </template>
      </el-table-column>
      <el-table-column
        label="钱包地址"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.address">
            {{ row.address || '' }}
          </div>
          <div v-else style="text-align: center">-</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="用户身份"
        width="90"
        align="center"
      >
        <template slot-scope="{ row: { identity } }">
          <div v-if="identity">{{ identity.name }}</div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="所属服务商"
        min-width="140"
        align="center"
      >
        <template slot-scope="{ row: { partner } }">
          <div v-if="partner">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="partner.logo ? (domin + partner.logo) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ partner.name }}
              </div>
              <div>
                {{ partner.code }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="code"
        label="邀请码"
        width="80"
        align="center"
      />
      <el-table-column
        prop=""
        min-width="140"
        label="消费额"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>现金消费： {{ row.cny_spend || 0.00 }}</div>
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
      <!-- <el-table-column
        prop="forbid_time"
        label="解除禁言时间"
        width="140"
        align="center"
      >
        <template slot-scope="{ row: { forbid_time } }">
          {{ forbid_time || '-' }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button plain type="primary" @click="onSubset(row)">团队</el-button>
            <!-- <el-button plain type="primary" @click="onFollow(row)">关注</el-button>
            <el-button plain type="primary" @click="onFans(row)">粉丝</el-button> -->
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
          <el-button-group style="margin-top: 5px;">
            <!-- <el-button plain type="primary" @click="onUserLikes(row)">他的喜欢</el-button> -->
            <el-button plain type="primary" @click="onCollection(row)">他的藏品</el-button>
            <el-button plain type="primary" @click="onWallet(row)">钱包流水</el-button>
            <!-- <el-button type="warning" :disabled="!row.forbid_time" style="border-left-color: #a3d3ff;" @click="forbidCancels(row)">解除禁言</el-button> -->
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

    <!-- 他的喜欢-->
    <user-likes
      v-if="userLikesVisible"
      ref="userLikes"
      @refreshList="getList()"
    />

    <!-- 他的收藏-->
    <collection-update
      v-if="collectionUpdateVisible"
      ref="collection"
      @refreshList="getList()"
    />

    <!-- 关注-->
    <follow
      v-if="followVisible"
      ref="follow"
      @refreshList="getList()"
    />

    <!-- 粉丝-->
    <fans
      v-if="fansVisible"
      ref="fans"
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

    <!-- 导出指定藏品用户 -->
    <export-serial
      v-if="exportSerialVisible"
      ref="exportSerial"
    />
    <!-- 用户资产空投 -->
    <air-balance
      v-if="airBalanceVisible"
      ref="airBalance"
    />
    <!-- 导出消费金额排名 -->
    <fee-rank
      v-if="feeRankVisible"
      ref="feeRank"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { dataList, deleteData, exportOrder } from '@/api/user'
import { forbidCancel } from '@/api/topic'
import { identityList } from '@/api/common'
import AddOrUpdate from './components/AddOrUpdate'
import Subset from './components/Subset'
import Wallet from './components/Wallet'
import ExportSerial from './components/ExportSerial'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, whetherOptions } from '@/utils/explain'
import UserLikes from '@/views/user/components/UserLikes'
import CollectionUpdate from '@/views/user/components/CollectionUpdate'
import follow from '@/views/user/components/follow'
import fans from '@/views/user/components/fans'
import AirBalance from '@/views/user/components/AirBalance'
import FeeRank from '@/views/user/components/FeeRank'

export default {
  name: 'User',
  components: { UserLikes, CollectionUpdate, Pagination, AddOrUpdate, Subset, Wallet, follow, fans, ExportSerial, AirBalance, FeeRank },
  data() {
    return {
      domin: getToken(DominKey),
      pickerOptions,
      dateRangeValue: [],
      list: [],
      search: {
        keywords: '',
        address: '',
        identity_id: '',
        is_auth: '',
        start_time: '',
        end_time: '',
        state: '',
        is_forbid: '',
        cny_start: 0,
        cny_end: 0
        // partner_id: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      identityOptions: [{ label: '全部', value: '' }],
      partnerOptions: [{ label: '全部', value: '' }],
      whetherOptions,
      loading: false,
      addOrUpdateVisible: false,
      exportSerialVisible: false,
      subsetVisible: false,
      walletVisible: false,
      downloadLoading: false,
      updateAddressVisible: false,
      collectionUpdateVisible: false,
      fansVisible: false,
      followVisible: false,
      userLikesVisible: false,
      airBalanceVisible: false,
      feeRankVisible: false
    }
  },
  computed: {
    ...mapGetters(['integral_use'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      // this.getPartnerOptions()
    },
    identityLists() {
      identityList().then(response => {
        this.identityOptions.push(...response.data.map(v => {
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
    // getPartnerOptions() {
    //   filterPartner({ type: 'all' }).then((response) => {
    //     response.data.map((v) => {
    //       this.partnerOptions.push({
    //         label: v.name,
    //         value: v.id
    //       })
    //     })
    //   })
    // },
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
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data, this.identityOptions)
      })
    },
    onFollow(data) {
      this.followVisible = true
      this.$nextTick(() => {
        this.$refs.follow && this.$refs.follow.init(data, this.identityOptions)
      })
    },
    onFans(data) {
      this.fansVisible = true
      this.$nextTick(() => {
        this.$refs.fans && this.$refs.fans.init(data, this.identityOptions)
      })
    },
    onSubset(data) {
      this.subsetVisible = true
      this.$nextTick(() => {
        this.$refs.subset && this.$refs.subset.init(data)
      })
    },
    onUserLikes(data) {
      this.userLikesVisible = true
      this.$nextTick(() => {
        this.$refs.userLikes && this.$refs.userLikes.init(data)
      })
    },
    onCollection(data) {
      this.collectionUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.collection && this.$refs.collection.init(data)
      })
    },
    onWallet(data) {
      this.walletVisible = true
      this.$nextTick(() => {
        this.$refs.wallet && this.$refs.wallet.init(data)
      })
    },
    onDelete({ name, id }) {
      this.$confirm(`确定对(#${id})[${name}]进行[删除]操作`, '删除', {
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
    forbidCancels(row) {
      this.$confirm(`确定对[(#${row.id})(${row.name})]进行[解除禁言]操作?`, '解除禁言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          forbidCancel(row.id)
            .then(({ msg = '解除禁言成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {
              this.$message.error('解除禁言失败')
            })
        })
        .catch(() => {})
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    },
    onHandleDownloadSerial() {
      this.exportSerialVisible = true
      this.$nextTick(() => {
        this.$refs.exportSerial && this.$refs.exportSerial.init()
      })
    },
    airBalanceBtn() {
      this.airBalanceVisible = true
      this.$nextTick(() => {
        this.$refs.airBalance && this.$refs.airBalance.init()
      })
    },
    onHandleDownloadFeeRank() {
      this.feeRankVisible = true
      this.$nextTick(() => {
        this.$refs.feeRank && this.$refs.feeRank.init()
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
