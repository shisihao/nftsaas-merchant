<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="转款人">
          <el-input v-model="search.transfer" placeholder="ID/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="">
          <span class="reverse-box" :class="{ 'reverse': reverseBtn }" @click="onTransfer">
            <svg-icon icon-class="transfer" />
          </span>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input v-model="search.receiver" placeholder="ID/手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="search.currency" clearable @change="getList(1)">
            <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
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
        label="转款人"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar icon="el-icon-user-solid" :src="row.user ? (row.user.avatar ? domin + row.user.avatar : '') : ''" />
            <div style="display: inline-block;margin-left: 10px">
              <div>
                {{ row.user ? row.user.name : '' }}
              </div>
              <div>
                {{ row.user ? ( row.user.phone || row.user.email) : '' }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="收款人"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.target_user ">
            <el-avatar icon="el-icon-user-solid" :src="row.target_user ? (row.target_user.avatar ? domin + row.target_user.avatar : '') : ''" />
            <div style="display: inline-block;margin-left: 10px">
              <div>
                {{ row.target_user ? row.target_user.name : '' }}
              </div>
              <div>
                {{ row.target_user ? (row.target_user.phone || row.target_user.email) : '' }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="信息"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            资产类型：<svg-icon :icon-class="row.currency" /> <span class="uppercase">{{ row.currency }}</span>
          </div>
          <div>
            数量：{{ row.num | cutZero }}
          </div>
          <div>
            手续费：{{ row.fee | cutZero }}
          </div>
          <div>
            可用：{{ row.transfer_balance | cutZero }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 2">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="row.reason"
            >
              <el-tag slot="reference" :type="tagTypeOptions[row.status]">
                {{ row.status | paraphrase(statusOptions) }} <i class="el-icon-info" />
              </el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="tagTypeOptions[row.status]">
              {{ row.status | paraphrase(statusOptions) }}
            </el-tag>
          </div>
          <div v-if="row.admin">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ row.admin.id }}
                </div>
                <div>
                  {{ row.admin.name }}
                </div>
              </div>
              <div slot="reference">
                审核人<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        align="center"
      >
        <template slot-scope="{ row: { created_at, updated_at, status } }">
          <div>创建：{{ created_at }}</div>
          <div v-if="[1, 2].includes(status)">审核：{{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 0">
            <el-button type="success" @click="onPassOrReject(row,1)">通过</el-button>
            <el-button type="danger" @click="onPassOrReject(row,2)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, statusReject } from '@/api/transfer'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, examineStatusOptions, currencyOptions } from '@/utils/explain'

export default {
  name: 'Certification',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      dateRangeValue: [],
      list: [],
      search: {
        status: '',
        transfer: '',
        receiver: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: examineStatusOptions,
      tagTypeOptions: [
        'warning',
        'success',
        'danger'
      ],
      pickerOptions,
      currencyOptions,
      wait_count: 0,
      loading: false,
      reverseBtn: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, user: { name }}, type) {
      const title = type === 1 ? '通过' : '驳回'
      const confirmType = type === 1 ? this.$confirm : this.$prompt

      confirmType(`#${id} 用户「${name}」转账申请`, `${title}转账申请`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 1 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api =
            type === 1
              ? statusPass(id)
              : statusReject(id, value)
          api
            .then(() => {
              this.$message.success(`${type === 1 ? '已通过' : '已驳回'}转账申请`)
              this.init()
            })
            .catch(() => {})
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
    onChangeStatus(value) {
      this.getList(1)
    },
    onTransfer() {
      if (!this.search.transfer || !this.search.receiver) {
        return false
      }
      const transfer = this.search.transfer
      const receiver = this.search.receiver
      this.search.transfer = receiver
      this.search.receiver = transfer
      this.reverseBtn = !this.reverseBtn
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
::v-deep .item .el-badge__content {
  transform: translateY(-50%) translateX(50%);
  z-index: 1;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
  border-left: 0;
}
::v-deep .item:first-child .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid #DCDFE6;
  border-radius: 4px 0 0 4px;
}
::v-deep .item:last-child .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}
.reverse-box {
  cursor: pointer;
  user-select: none;
}
.reverse-box svg {
  transition: all 0.3s;
}
.reverse svg {
  transform: rotateY(180deg);
}
</style>
