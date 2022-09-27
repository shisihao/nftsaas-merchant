<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio v-if="false" :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeMaps[form.type] + '名称'" prop="name">
        <el-input v-model="form.name" :placeholder="typeMaps[form.type] + '名称：' + typeMaps[form.type] + '管理'" clearable />
      </el-form-item>
      <el-form-item :label="typeMaps[form.type] + '别名'" prop="alias">
        <el-input v-model="form.alias" :placeholder="typeMaps[form.type] + '别名：menu'" clearable />
      </el-form-item>
      <el-form-item v-if="form.type === 1" label="跳转地址" prop="url">
        <el-input v-model="form.url" type="url" placeholder="跳转地址：menu" clearable />
      </el-form-item>
      <el-form-item v-if="form.type !== 2" :label="typeMaps[form.type] + '图标'" prop="icon">
        <el-popover
          v-model="iconVisible"
          placement="bottom-start"
          popper-class="p-menu__icon-popover"
          trigger="click"
          :append-to-body="false"
        >
          <span v-for="item of svgIcons" :key="item" class="popover-icons" @click="onHandleIcon(item)">
            <svg-icon :icon-class="item" class="popover-icon-item" />
          </span>
          <el-input slot="reference" v-model="form.icon" :placeholder="typeMaps[form.type] + '图标'" clearable>
            <template v-if="form.icon" slot="append">
              <svg-icon :icon-class="form.icon" />
            </template>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item :label="'上级' + typeMaps[(form.type === 0 ? 1 : form.type) -1]" prop="pid">
        <el-popover
          ref="menuListPopover"
          v-model="menuVisible"
          trigger="click"
          placement="bottom-start"
        >
          <el-tree
            v-if="menuVisible"
            ref="menuListTree"
            :data="menuList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="menuListTreeCurrentChangeHandle"
          />

          <el-input
            slot="reference"
            v-model="form.parentName"
            :placeholder="'上级' + typeMaps[(form.type === 0 ? 1 : form.type) - 1]"
            clearable
            @clear="onClearPid"
          />
        </el-popover>

      </el-form-item>
      <el-form-item v-if="form.type === 0" label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="排序" />
        <div class="notice">注：用于菜单栏展示顺序</div>
      </el-form-item>
      <el-form-item v-if="form.type !== 2" label="是否显示" prop="show">
        <el-radio-group v-model="form.show">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
        <div class="notice">注：标识是否在侧边栏显示</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { dataList, addOrUpdate } from '@/api/menu'
import { listTree } from '@/utils/index'
import svgIcons from '@/utils/svg-icons'

export default {
  name: 'AddOrUpdate',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('只能是中英文'))
      } else {
        callback()
      }
    }
    return {
      svgIcons,
      visible: false,
      btnLoading: false,
      iconVisible: false,
      menuVisible: false,
      form: {
        id: 0,
        name: '',
        type: 0,
        pid: 0,
        url: '',
        alias: '',
        icon: '',
        show: 1,
        sort: 0,
        parentName: ''
      },
      typeMaps: ['目录', '菜单', '按钮'],
      menuRawList: [],
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        alias: [
          { required: true, message: '别名不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    menuList: {
      get() {
        const types = [[0], [0], [0, 1]][this.form.type]
        return listTree(
          this.menuRawList.filter(m => types.includes(m.type)),
          'id'
        )
      }
    }
  },
  methods: {
    init(list, data) {
      this.visible = true
      this.onMenuList(data && data.id)
      if (data) {
        this.form = Object.assign({}, data)
        if (data.pid) {
          const parentArray = list.filter(v => {
            return v.id === data.pid
          })
          this.form.parentName = parentArray[0].name
        }
      }
    },
    onMenuList(id) {
      dataList().then(({ data = [] }) => {
        const menuItem = data.filter(m => m.id === id)[0]
        if (id) {
          Object.keys(this.form).forEach(k => {
            this.form[k] = menuItem[k]
          })
        }
        data = data.filter(m => m.id !== id)
        this.menuRawList = data
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data /* , node */) {
      this.form.pid = data.id
      this.form.parentName = data.name
      this.menuVisible = false
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          console.log(this.form)
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClearPid() {
      this.form.pid = 0
    },
    onClose() {
      this.$reset()
    },
    onHandleIcon(data) {
      this.form.icon = data
      this.iconVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  color: #909399;
  font-size: 12px;
}
::v-deep .p-menu__icon-popover {
  max-width: 400px;
}
.popover-icons {
  width: 34px;
  height: 34px;
  display: inline-block;
  text-align: center;
  .popover-icon-item {
    font-size: 18px;
    cursor: pointer
  }
}
</style>
