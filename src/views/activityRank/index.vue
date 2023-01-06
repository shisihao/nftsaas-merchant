<template>
  <div class="app-container">
    <el-card shadow="never" class="card-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="开启榜单" prop="switch">
          <el-switch
            v-model="form.switch"
            active-value="on"
            inactive-value="off"
          />
        </el-form-item>
        <el-form-item label="排行榜标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="dateRangeValue2"
            clearable
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            align="right"
            @change="onChangeDateRange2"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
            {{ $t('table.confirm') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键字">
          <el-input
            v-model="search.keywords"
            placeholder="昵称/电话号码"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="消费金额范围">
          <el-input-number v-model="search.min_amount" controls-position="right" :controls="false" style="width: 150px;" placeholder="请输入最低金额" :min="0" :precision="2" />
          -
          <el-input-number v-model="search.max_amount" controls-position="right" :controls="false" style="width: 150px;" placeholder="请输入最高金额" :min="0" :precision="2" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="onHandleDownload"
        >
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-table v-loading="loading" border highlight-current-row :data="list">
      <el-table-column type="index" label="排名" width="120" align="center" />
      <el-table-column label="昵称" header-align="center">
        <template slot-scope="{ row }">
          <div>{{ row.user ? row.user.name : '' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="电话" header-align="center">
        <template slot-scope="{ row }">
          <div>{{ row.user ? row.user.phone : '' }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="amount" label="消费金额" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshList="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import { dataList, dataConfig, putDataConfig, exportOrder } from '@/api/activityRank'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'ActivityRank',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      search: {
        keywords: '',
        min_amount: '',
        max_amount: ''
      },
      form: {
        switch: 'off',
        title: '',
        time: { start: '', end: '' }
      },
      rules: {
        switch: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        title: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        time: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      },
      list: [],
      loading: false,
      btnLoading: false,
      downloadLoading: false,
      dateRangeValue2: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      choiceDate: '',
      pickerOptions2: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate && minDate) this.choiceDate = ''
        },
        disabledDate: time => {
          if (this.choiceDate) {
            const one = 7 * 24 * 3600 * 1000
            const minTime = this.choiceDate - one
            const maxTime = this.choiceDate + one
            return (
              time.getTime() <= minTime ||
              time.getTime() >= maxTime
            )
          }
        }
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
      this.getFormData()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange2(value) {
      if (Array.isArray(value)) {
        this.form.time.start = value[0]
        this.form.time.end = value[1]
      } else {
        this.form.time.start = this.form.time.end = ''
      }
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    async getFormData() {
      const { data } = await dataConfig()
      this.form = data.value
      this.dateRangeValue2 = data.value.time ? [data.value.time.start, data.value.time.end] : []
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then((response) => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {})
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { msg } = await putDataConfig(this.form)
          this.$message.success(msg)
          this.getFormData()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.card-box {
	.el-input {
		width: 600px;
	}
}
.filter-container {
	margin-top: 20px;
}
.el-picker-panel__footer{
  button:first-child{
    display: none;
  }
}
</style>
