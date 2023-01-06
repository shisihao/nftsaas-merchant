<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="用户账号">
          <el-input v-model="search.account" placeholder="账号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="盲盒ID">
          <el-input v-model="search.box_id" placeholder="盲盒ID" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        header-align="center"
        align="center"
        label="盲盒图片"
        width="120"
      >
        <template slot-scope="{row:{box}}">
          <el-image
            class="image-item"
            fit="contain"
            :src=" box.images.length>0&&domin + box.images[0]"
            :preview-src-list="[box.images.length > 0 &&domin + box.images[0]]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="盲盒名称"
        header-align="center"
        prop="box.name"
      />
      <el-table-column
        label="信息"
        header-align="center"
      >
        <template slot-scope="{ row:{user},row:{set_appoint_goods} }">
          <div>
            用户：
            <el-avatar size="small" icon="el-icon-user-solid" style="vertical-align: bottom;margin-right: 5px" :src="user.avatar && domin + user.avatar" /> #{{ user.id }}
          </div>
          <div>
            昵称：{{ user.name ||'' }}
          </div>
          <div>
            电话：{{ user.phone || '' }}
          </div>
          <div v-if="set_appoint_goods">
            指定开启物品：
            <el-popover
              placement="bottom"
              width="270"
              trigger="hover"
            >
              <div v-if="set_appoint_goods.goods_id">
                <div class="info-wrapper">
                  <el-image
                    class="image-item"
                    fit="contain"
                    :src="set_appoint_goods.goods.images.length > 0 && domin + set_appoint_goods.goods.images[0]"
                    :preview-src-list="[set_appoint_goods.goods.images.length > 0 && domin + set_appoint_goods.goods.images[0]]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                  <div style="margin-left: 10px">
                    #{{ set_appoint_goods.goods.id || '' }}
                    <div>名称：{{ set_appoint_goods.goods.name ||'' }}</div>
                    <div>
                      编号：<el-tag>{{ set_appoint_goods.goods.serial ||'' }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>{{ integral }}：{{ set_appoint_goods. integral_num }}</div>
              <i slot="reference" class="el-icon-zoom-in" />
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        label="所开物品"
      >
        <template slot-scope="{row:{open_goods}}">
          <template v-if="open_goods">
            <div v-if="!open_goods.goods_id">
              <div>{{ integral }}：{{ open_goods.integral_num }}</div>
            </div>
            <div v-else>
              <div class="info-wrapper">
                <el-image
                  class="image-item"
                  fit="contain"
                  :src="open_goods.goods.images.length > 0 && domin + open_goods.goods.images[0]"
                  :preview-src-list="[open_goods.goods.images.length > 0 && domin + open_goods.goods.images[0]]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div style="margin-left: 10px">
                  #{{ open_goods.goods.id || '' }}
                  <div>名称：{{ open_goods.goods.name ||'' }}</div>
                  <div>
                    编号：<el-tag>{{ open_goods.goods.serial ||'' }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        prop="prop"
        label="指定开启物品"
      >
        <template slot-scope="{row:{set_appoint_goods}}">
          <template v-if="set_appoint_goods">
            <div v-if="set_appoint_goods.goods_id">
              <div class="info-wrapper">
                <el-image
                  class="image-item"
                  fit="contain"
                  :src="set_appoint_goods.goods.images.length > 0 && domin + set_appoint_goods.goods.images[0]"
                  :preview-src-list="[set_appoint_goods.goods.images.length > 0 && domin + set_appoint_goods.goods.images[0]]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div style="margin-left: 10px">
                  #{{ set_appoint_goods.goods.id || '' }}
                  <div>名称：{{ set_appoint_goods.goods.name ||'' }}</div>
                  <div>
                    编号：<el-tag>{{ set_appoint_goods.goods.serial ||'' }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>{{integral}}：{{ set_appoint_goods. integral_num }}</div>
          </template>
        </template>
      </el-table-column> -->
      <el-table-column
        label="是否开启"
        width="80"
        align="center"
      >
        <template slot-scope="{row}">
          <div :style="row.is_open === 1 ? 'color:#67C23A;' : ''">{{ row.is_open?'是':'否' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>创建：{{ row.created_at }}</div>
          <div>更新：{{ row.updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="prop"
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button v-if="row.set_status" type="primary" plain @click="onHandleSet(row)">指定开启</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 指定开启物品弹框 -->
    <set-blind-box
      v-if="setBlindBoxVisible"
      ref="setBlindBox"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import { dataList } from '@/api/boxUserList'
import Pagination from '@/components/Pagination/index'
import { getToken, DominKey } from '@/utils/auth'
import { statusOptions } from '@/utils/explain'
import setBlindBox from './components/setBlindBox'
import { mapGetters } from 'vuex'
export default {
  name: 'BoxUserList',
  components: { Pagination, setBlindBox },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      setBlindBoxVisible: false,
      search: {
        account: '',
        box_id: ''
      },
      list: [],
      statusOptions,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  computed: {
    ...mapGetters(['integral'])
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
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onHandleSet(data) {
      this.setBlindBoxVisible = true
      this.$nextTick(() => {
        this.$refs.setBlindBox && this.$refs.setBlindBox.init(data)
      })
    }
  }
}
</script>

<style lang="scss"  scoped>
.info-wrapper {
  display: flex;
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
}
.el-icon-zoom-in {
  color: #409eff;
  font-size: 16px;
  vertical-align: middle;
}
</style>
