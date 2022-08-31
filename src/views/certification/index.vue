<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="昵称">
          <el-input v-model="search.user_name" placeholder="昵称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="search.account" placeholder="手机号/邮箱" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="认证姓名">
          <el-input v-model="search.cer_name" placeholder="认证姓名" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="onChangeStatus">
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
        label="用户信息"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar icon="el-icon-user-solid" :src="row.user.avatar && domin + row.user.avatar" />
            <div style="display: inline-block;margin-left: 10px">
              <div>
                {{ row.user.name }}
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="认证信息"
        header-align="center"
      >
        <template slot-scope="{ row: { name, number } }">
          <div>姓名：{{ name }}</div>
          <div>身份证：{{ number }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="认证凭证"
        width="280"
        header-align="center"
      >
        <template slot-scope="{ row: { fpic, bpic, hpic } }">
          <el-image
            style="width: 80px; height: 80px;display: inline-block;vertical-align: text-top;margin-right: 8px"
            :src="fpic ? domin + fpic : ''"
            :preview-src-list="[fpic ? domin + fpic : '']"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <el-image
            style="width: 80px; height: 80px;display: inline-block;vertical-align: text-top;margin-right: 8px"
            :src="bpic ? domin + bpic : ''"
            :preview-src-list="[bpic ? domin + bpic : '']"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <el-image
            style="width: 80px; height: 80px;display: inline-block;vertical-align: text-top;"
            :src="hpic ? domin + hpic : ''"
            :preview-src-list="[hpic ? domin + hpic : '']"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status, reason, admin } }">
          <div v-if="status === 2">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
          </div>
          <div v-if="admin">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ admin.id }}
                </div>
                <div>
                  {{ admin.name }}
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
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建：{{ created_at }}</div>
          <div>审核：{{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button v-if="[0].includes(row.status)" type="success" @click="onPassOrReject(row,1)">通过</el-button>
          <el-button v-if="[0, 1].includes(row.status)" type="danger" @click="onPassOrReject(row,2)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, statusReject } from '@/api/certification'
import { getToken, DominKey } from '@/utils/auth'
import { examineStatusOptions } from '@/utils/explain'

export default {
  name: 'Certification',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      wait_count: 0,
      search: {
        user_name: '',
        status: '',
        account: '',
        cer_name: ''
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
      loading: false
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
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, user: { name }}, type) {
      const title = type === 1 ? '通过' : '驳回'
      const confirmType = type === 1 ? this.$confirm : this.$prompt

      confirmType(`用户「${name}」实名认证`, `认证${title}`, {
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
              this.$message.success(`${type === 1 ? '已通过' : '已驳回'}认证`)
              this.init()
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        })
        .catch(() => {})
    },
    onChangeStatus(value) {
      this.getList(1)
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
</style>
