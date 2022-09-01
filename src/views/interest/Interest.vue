<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input
            v-model="search.name"
            placeholder="请输入藏品名称搜索"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
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
        label="藏品信息"
        min-width="300"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src=" row.goods && row.goods.images.length > 0 && domin + row.goods.images[0]"
              :preview-src-list="[ row.goods && row.goods.images.length > 0 && domin + row.goods.images[0] ]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div style="margin-left: 10px">
              <div>#{{ row.goods.id || '' }}</div>
              <div v-if="row.goods && row.goods.name">
                名称：{{ row.goods.name || '' }}
              </div>
              <div>藏品编号：{{ row.goods.serial }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="权益信息"
        min-width="440"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="interest" style="display: flex; overflow-x: auto;">
            <div v-for="(item, key, index) in row.interests" :key="index" style="margin-right: 10px;min-width: 200px;margin-bottom: 10px">
              <div>权益名称： <el-tag type="info" effect="plain">{{ key | paraphrase(keyOptions) }}</el-tag> </div>
              <div>权益类型： <el-tag :type="item.type | paraphrase(interestsOptions, 'value', 'type') ">{{ item.type | paraphrase(interestsOptions) | entityType(key, item) }}</el-tag> </div>
              <div v-if="key === 'rebate' && item.type === 'long'">是否开启：{{ item.num === 1 ? '是' : '否' }}</div>
              <div v-else-if="key === 'entity' && !item.grade_id">折扣：{{ item.discount }}</div>
              <div v-else>权益次数：{{ item.num }}</div>
              <div v-if="item.type === 'once'">是否销毁： {{ item.is_destroy === 1 ? '是' : '否' }}</div>
              <div>权益时间： {{ item.expire_time || '-' }}</div>
              <div v-if="key === 'entity'">
                类型：{{ item.grade_id > 0 ? '等级' : '折扣' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="intro"
        label="权益描述"
        min-width="200"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip popper-class="popover-box" effect="dark" :content="row.intro" placement="top">
            <div class="ellipsis">
              {{ row.intro }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        prop="created_at"
        label="创建时间"
        header-align="center"
      />
      <el-table-column
        label="操作"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
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
  </div>
</template>

<script>
import { goodsdDataList } from '@/api/interest'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, interestsOptions } from '@/utils/explain'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'

export default {
  name: 'Interest',
  components: { AddOrUpdate, Pagination },
  filters: {
    entityType(value, key, item) {
      return key === 'entity' && item.type === 'appoint' ? '指定商品' : value
    }
  },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      pickerOptions,
      interestsOptions,
      keyOptions: [
        { label: '优先购', value: 'prior' },
        { label: '转赠', value: 'give' },
        { label: '话题上链', value: 'topic' },
        { label: '折扣购', value: 'rebate' },
        { label: '实体商品折扣购', value: 'entity' }
      ],
      list: [],
      search: {
        name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      addOrUpdateVisible: false
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
      goodsdDataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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

::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .RichContent-collapsedText {
  position: relative;
  left: 0;
  top: 0;
  padding-right: 60px;
}
::v-deep .RichContent-lookText {
  position: absolute;
  right: 0;
  top: 0;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}
.el-tag {
  margin-right: 4px;
}
.hot-tag {
  position: absolute;
  font-size: 36px;
  left: 0;
  top: 0;
}

.interest::-webkit-scrollbar {
  height: 6px;
}
.interest::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.interest::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}

</style>
