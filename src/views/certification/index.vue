<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="昵称">
          <el-input v-model="search.user_name" placeholder="昵称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="search.account" placeholder="手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="认证姓名">
          <el-input v-model="search.cer_name" placeholder="认证姓名" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="search.number" placeholder="身份证" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="search.status" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
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
        min-width="200"
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
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { name, number, phone } }">
          <div>姓名：{{ name }}</div>
          <div>身份证：{{ number }}</div>
          <div>手机号：{{ phone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="序列号"
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { result } }">
          <div> {{ result.seqNo }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="认证结果"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row: { result } }">
          <div v-if="result&&result.data">
            <div>地域：{{ result.data.province }}</div>
            <div>城市：{{ result.data.city }} </div>
            <div>运营商：{{ result.data.operator }} </div>
          </div>
          <div v-else-if="result && result.pictureUrl">
            <el-image
              class="image-item"
              fit="cover"
              :src="result.pictureUrl && domainUrl + result.pictureUrl"
              :preview-src-list="[domainUrl + result.pictureUrl]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
          <div v-else style="text-align: center"> - </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="失败原因"
        min-width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip popper-class="popover-box" effect="dark" :content="row.reason" placement="top">
            <div class="ellipsis">
              {{ row.reason || '' }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status, admin } }">
          <div v-if="status === 2">
            <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
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
        label="是否删除"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <span :style="`color: ${ row.is_delete ? '#ff4949' : '' }`">{{ row.is_delete | paraphrase(whetherOptions) }}</span>
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
          <el-button v-if="![1].includes(row.status)" type="success" @click="onPassOrReject(row,1)">通过</el-button>
          <el-button v-if="![1].includes(row.status)" type="warning" @click="onRelease(row)">解除上限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, exportOrder, relieve } from '@/api/certification'
import { getToken, DominKey } from '@/utils/auth'
import { examineStatusOptions, whetherOptions } from '@/utils/explain'

export default {
  name: 'Certification',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      whetherOptions,
      list: [],
      wait_count: 0,
      domainUrl: 'https://cn-shanghai-aliyun-cloudauth-1582222736062849.oss-cn-shanghai.aliyuncs.com/',
      search: {
        user_name: '',
        number: '',
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
      loading: false,
      downloadLoading: false
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
          this.list = response.data.data.map(v => {
            return Object.assign(v, { status: v.status === 0 ? 2 : v.status })
          })
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, name, user }, type) {
      const title = type === 1 ? '通过' : '驳回'
      const confirmType = type === 1 ? this.$confirm : this.$prompt

      confirmType(`用户昵称「${user?.name}」，用户姓名「${name}」`, `认证${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 1 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api = statusPass(id)
          api
            .then(() => {
              this.$message.success(`${type === 1 ? '已通过' : '已驳回'}认证`)
              this.init()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    },
    onRelease({ name, number }) {
      this.$confirm(`确定对用户姓名「${name}」进行[解除上限]操作?`, '解除上限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          relieve({ number })
            .then(({ msg = '解除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
              this.$message.error('解除失败')
            })
        })
        .catch(() => {})
    },
    onChangeStatus(value) {
      this.getList(1)
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
.el-radio-group {
  ::v-deep .badge-item {
  .el-badge__content {
    transform: translateY(-50%) translateX(50%);
    z-index: 1;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
    border-left: 0;
  }
  &:first-child .el-radio-button:first-child .el-radio-button__inner {
     border-left: 1px solid #DCDFE6;
     border-radius: 4px 0 0 4px;
   }
  &:last-child .el-radio-button:first-child .el-radio-button__inner {
     border-radius: 0 4px 4px 0;
   }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.RichContent-collapsedText {
  position: relative;
  left: 0;
  top: 0;
  padding-right: 60px;
}
.RichContent-lookText {
  position: absolute;
  right: 0;
  top: 0;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}
 .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
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
  }
</style>
