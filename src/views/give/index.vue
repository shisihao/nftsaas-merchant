<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="赠送人">
          <el-input v-model="search.user_keywords" placeholder="ID/手机号/钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="search.target_keywords" placeholder="ID/手机号/钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        label="赠送人信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="row.user && domin + row.user.avatar" />
            <div style="display: inline-block;margin-left: 10px;vertical-align: middle">
              <div>
                # {{ row.user.id }}
              </div>
              <div>
                {{ row.user.name }}
              </div>
              <div>
                {{ row.user.phone }}
              </div>
            </div>
          </div>
          <div v-else style="text-align: center">-</div>
        </template>
      </el-table-column>
      <el-table-column
        label="接收人信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.target_user">
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="row.target_user && domin + row.target_user.avatar" />
            <div style="display: inline-block;margin-left: 10px;vertical-align: middle">
              <div>
                # {{ row.target_user.id }}
              </div>
              <div>
                {{ row.target_user.name }}
              </div>
              <div>
                {{ row.target_user.phone }}
              </div>
            </div>
          </div>
          <div v-else style="text-align: center">-</div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row : { user_goods } }">
          <div v-if="user_goods && user_goods.goods">
            <div>
              商品名称：{{ user_goods.goods.name || '' }}
            </div>
            <div>
              商品编号：{{ user_goods.goods.serial || '' }}#{{ user_goods.num || '' }}/{{ user_goods.goods.stock +user_goods.goods.cast_goods_stock }}
            </div>
            <div>
              创作者：{{ user_goods.goods.author || '' }}
            </div>
          </div>
          <div v-else>
            <div>
              商品名称：-
            </div>
            <div>
              商品编号：-
            </div>
            <div>
              创作者：-
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="hash"
        label="交易HASH"
        width="160"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.hash || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="赠送时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { dataList } from '@/api/give'
import { pickerOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Give',
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      dateRangeValue: [],
      pickerOptions,
      domin: getToken(DominKey),
      search: {
        user_keywords: '',
        target_keywords: '',
        start_time: '',
        end_time: '',
        status: ''
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '处理中', value: 0 },
        { label: '已完成', value: 1 },
        { label: '失败', value: 2 }
      ],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
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
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
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
    }
  }
}
</script>
