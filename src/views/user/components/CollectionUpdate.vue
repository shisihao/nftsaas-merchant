<template>
  <div>
    <el-dialog top="30px" :title="`用户${form.name}的藏品`" :visible.sync="visible" @closed="onClose()">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品类型">
          <el-select v-model="search.target_type" clearable @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" placeholder="请输入关键词搜索" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="danger" icon="el-icon-collection-tag" :disabled="selectValue.length === 0" @click="onDeleteMore()">
          批量转移
        </el-button>
      </el-form>
      <h4>商品总数: {{ pages.total }}</h4>
      <el-table
        v-loading="loading"
        border
        highlight-current-row
        :data="list"
        @selection-change="onHandleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="getSelectEnable"
        />
        <el-table-column
          prop="id"
          label="ID"
          width="60"
          align="center"
        />
        <el-table-column
          width="320"
          label="藏品信息"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <el-image
              class="img-box"
              style="width: 100px; height: 100px;display: inline-block;vertical-align: text-top;"
              fit="contain"
              :src="row.goods && row.goods.images[0]? `${domin}${row.goods.images[0]}` : ''"
              :preview-src-list="[row.goods && row.goods.images[0]?`${domin}${row.goods.images}` : '']"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="goods-info">
              <div class="goods-name">
                <span>
                  名称：{{ row.goods && row.goods.name || '-' }}
                </span>
              </div>
              <div>藏品编号：{{ row.goods && row.goods.serial || '-' }}</div>
              <div>编号：{{ row.num }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="链上标识"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.identification">
              {{ row.identification }}
            </div>
            <div v-else> - </div>
          </template>
        </el-table-column>
        <el-table-column
          label="收藏时间"
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.updated_at || '-' }}
          </template>
        </el-table-column>
        <el-table-column width="70" label="冻结状态" align="center">
          <template slot-scope="{ row, $index }">
            <el-switch
              v-model="row.frozen_status"
              :active-value="1"
              :inactive-value="0"
              @change="onChangeStatus(row, $index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row, $index }">
            <el-button-group>
              <el-button type="danger" @click="onDelete(row, $index)">转移</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

      <look-all-tag
        v-if="lookAllTagVisible"
        ref="lookAllTag"
        @refreshList="getList()"
      />
    </el-dialog>
    <div v-if="GoogleCodeVisible" class="content">
      <google-code ref="GoogleCode" @refreshList="getList()" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { userCollection, setStatus } from '@/api/user'
import LookAllTag from './LookAllTag'
import GoogleCode from './GoogleCode'
export default {
  name: 'CollectionUpdate',
  components: { Pagination, LookAllTag, GoogleCode },
  data() {
    return {
      typeOptions: [
        { label: '全部', value: '' },
        { label: '常规藏品', value: 'order' },
        { label: '盲盒藏品', value: 'box' },
        { label: '空投藏品', value: 'airdrop' },
        { label: '合成藏品', value: 'synthesis' }
        /* { label: '铸造藏品', value: 'cast' } */
      ],
      visible: false,
      GoogleCodeVisible: false,
      loading: false,
      lookAllTagVisible: false,
      list: [],
      domin: getToken(DominKey),
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        target_type: '',
        keywords: ''
      },
      form: {
        id: '',
        name: ''
      },
      selectValue: []
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form.id = data.id
      this.form.name = data.name
      this.getList()
    },
    lookAll(data) {
      this.lookAllTagVisible = true
      this.$nextTick(() => {
        this.$refs.lookAllTag && this.$refs.lookAllTag.init(data)
      })
    },
    onChangeStatus(row) {
      setStatus({ user_goods_id: row.id, frozen_status: row.frozen_status })
        .then(({ msg = '设置成功' }) => {
          this.$message.success(msg)
        })
        .catch((msg = '设置失败') => {
          row.frozen_status = row.frozen_status ? 0 : 1
          this.$message.error(msg)
        })
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      userCollection(this.form.id, { page, limit: this.pages.limit, ...this.search })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total || 0
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.visible = false
    },
    onDelete(row, index) {
      this.GoogleCodeVisible = true
      this.$nextTick(() => {
        this.$refs.GoogleCode && this.$refs.GoogleCode.init(row)
      })
    },
    getSelectEnable(row, rowIndex) {
      if (row.status === 0) {
        return true
      }
    },
    onHandleSelectionChange(val) {
      this.selectValue = val
    },
    onDeleteMore() {
      const ids = this.selectValue.map(item => item.id)
      this.GoogleCodeVisible = true
      this.$nextTick(() => {
        this.$refs.GoogleCode && this.$refs.GoogleCode.init({ id: ids })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog {
    width: 850px;
  }
  .goods-box {
    display: flex;
    .img-box {
      flex-shrink: 0;
    }
    .goods-info {
      display: inline-block;
      margin-left: 10px;
      vertical-align: top;
      .goods-name {
        height: 80px;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      div:nth-child(2) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .goods-info {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;

    .goods-name {
      width: 185px;
      height: 60px;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    div:nth-child(2) {
      width: 169px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-content {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
