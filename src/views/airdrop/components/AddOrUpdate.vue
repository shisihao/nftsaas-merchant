<template>
  <el-dialog top="30px" width="1000px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <div v-if="!form.id">
        <el-form-item label="铸造藏品" prop="cast_goods_id">
          <el-select v-model="form.cast_goods_id" filterable placeholder="请选择铸造藏品" :disabled="!!form.id" @change="changeCast">
            <el-option
              v-for="(item, index) in castOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              <span>#{{ item.value }}</span>
              <el-image
                class="good-img"
                fit="cover"
                :src="item.image && domin + item.image"
              />
              <span>
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="铸造藏品库存">
          <el-input-number v-model="stock" disabled :precision="0" :min="0" />
        </el-form-item>
      </div>
      <el-form-item label="藏品名称" prop="name">
        <el-input v-model="form.name" disabled placeholder="请输入藏品名称" />
      </el-form-item>
      <el-form-item label="藏品类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择藏品类型" :disabled="!!form.id">
          <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" :disabled="!!form.id" :precision="0" :min="0" :step="1" placeholder="请输入库存" />
      </el-form-item>
      <div v-if="!form.id">
        <el-form-item label="空投类型" prop="cate">
          <el-select v-model="form.cate" placeholder="请选择空投类型" clearable :disabled="!!form.id" @change="getAirdropList">
            <el-option v-for="(item, index) in airOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="[1].includes(form.cate)">
        <el-form-item label="活动名称" prop="activity_name">
          <el-select v-model="form.activity_name" clearable placeholder="请选择活动名称" :disabled="!!form.id">
            <el-option v-for="(item, index) in activitiesOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <span v-if="form.activity_name" style="margin-left: 10px">剩余: {{ activitiesOptions.find(v => v.value === form.activity_name).left }} </span>
        </el-form-item>
      </div>
      <el-form-item label="是否展示3D" prop="is_three">
        <el-radio-group v-model="form.is_three" disabled>
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="藏品标签" prop="tags">
        <el-select v-model="form.tags" style="width: 100%;" multiple clearable placeholder="请选择藏品标签">
          <el-option v-for="(item, index) in tagsOptions" :key="index" :disabled="form.tags.length >= 3" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <div v-if="form.is_three === 1">
        <div v-if="form.three_url.three_type === 'obj'">
          <el-form-item label="上传mtl文件" prop="three_url.three_mtl">
            <custom-upload
              class-name=""
              ref-name="three_url.three_mtl"
              :limit="1"
              :show-file-list="true"
              :file-list="mtlList"
              @handleBeforeUpload="beforeAvatarUpload3d"
              @handleSuccess="handleAvatarSuccess"
              @handleError="handleError"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @elProgress="elProgress"
            >
              <el-button type="primary" disabled>点击上传</el-button>
            </custom-upload>
            <el-progress v-if="![0, 1].includes(mtlPercentage)" :percentage="mtlPercentage * 100" />
          </el-form-item>
          <el-form-item label="上传obj文件" prop="three_url.three_obj">
            <custom-upload
              class-name=""
              ref-name="three_url.three_obj"
              :limit="1"
              :show-file-list="true"
              :file-list="objList"
              @handleBeforeUpload="beforeAvatarUpload3d"
              @handleSuccess="handleAvatarSuccess"
              @handleError="handleError"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @elProgress="elProgress"
            >
              <el-button type="primary" disabled>点击上传</el-button>
            </custom-upload>
            <el-progress v-if="![0, 1].includes(objPercentage)" :percentage="objPercentage * 100" />
          </el-form-item>
        </div>
        <div v-if="form.three_url.three_type === 'gltf'">
          <el-form-item label="上传gltf文件" prop="three_url.three_gltf">
            <custom-upload
              class-name=""
              ref-name="three_url.three_gltf"
              :limit="1"
              :show-file-list="true"
              :file-list="gltfList"
              @handleBeforeUpload="beforeAvatarUpload3d"
              @handleSuccess="handleAvatarSuccess"
              @handleError="handleError"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @elProgress="elProgress"
            >
              <el-button type="primary" disabled>点击上传</el-button>
            </custom-upload>
            <el-progress v-if="![0, 1].includes(gltfPercentage)" :percentage="gltfPercentage * 100" />
          </el-form-item>
          <el-form-item label="上传bin文件" prop="three_url.three_bin">
            <custom-upload
              class-name=""
              ref-name="three_url.three_bin"
              :limit="1"
              :show-file-list="true"
              :file-list="binList"
              @handleBeforeUpload="beforeAvatarUpload3d"
              @handleSuccess="handleAvatarSuccess"
              @handleError="handleError"
              @handleExceed="handleExceed"
              @handleRemove="handleRemove"
              @elProgress="elProgress"
            >
              <el-button type="primary" disabled>点击上传</el-button>
            </custom-upload>
            <el-progress v-if="![0, 1].includes(binPercentage)" :percentage="binPercentage * 100" />
          </el-form-item>
        </div>
        <el-form-item label="3d渲染image文件">
          <div class="filter-list-box">
            <div v-for="(item, index) in form.three_url.three_image" :key="index" class="upload-images">
              <el-image :src="item && domin + item" @click="onPicturePreview(item)" />
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="藏品图片" prop="images">
        <div class="filter-list-box">
          <div v-for="(item, index) in form.images" :key="index" class="upload-images">
            <el-image :src="item && domin + item" class="upload-image" fit="cover" @click="onPicturePreview(item)" />
          </div>
          <div v-if="form.images.length === 0" class="upload-images err-image">
            <el-image>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="藏品展示图">
        <div class="filter-list-box">
          <div v-if="!!form.show_image" class="upload-images">
            <el-image :src="domin + form.show_image" class="upload-image" fit="cover" @click="onPicturePreview(form.author_avatar)" />
          </div>
          <div v-else class="err-image">
            <el-image>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="创作者" prop="author">
        <el-input v-model="form.author" disabled placeholder="请输入创作者" />
      </el-form-item>
      <el-form-item label="创作者头像" prop="author_avatar">
        <div class="filter-list-box">
          <div v-if="!!form.author_avatar" class="upload-images">
            <el-image :src="domin + form.author_avatar" class="upload-image" fit="cover" @click="onPicturePreview(form.author_avatar)" />
          </div>
          <div v-else class="err-image">
            <el-image>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </div>
      </el-form-item>
      <el-divider content-position="left">商品价格</el-divider>
      <el-form-item label="人民币价格" prop="cny_price">
        <el-input-number v-model="form.cny_price" :precision="2" :min="0" placeholder="请输入人民币价格" />
      </el-form-item>
      <el-form-item v-if="integral_use" :label="`${integral}价格`" prop="integral_price">
        <el-input-number v-model="form.integral_price" :precision="2" :min="0" placeholder="请输入价格" />
      </el-form-item>
      <el-divider />
      <el-form-item label="限购数量" prop="limit_num">
        <el-input-number v-model="form.limit_num" :precision="0" :min="1" placeholder="请输入限购数量" />
      </el-form-item>
      <el-form-item :label="`奖励${integral}`" prop="integral_reward">
        <el-input-number v-model="form.integral_reward" :precision="0" :min="0" :placeholder="`请输入奖励${integral}价格`" />
      </el-form-item>
      <div v-if="!form.id">
        <el-form-item label="发行方" prop="issuer">
          <el-input v-model="form.issuer" disabled placeholder="请输入发行方" />
        </el-form-item>
        <el-form-item label="开售时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开售时间"
            :picker-options="pickerOptions0"
            clearable
          />
        </el-form-item>
      </div>
      <el-form-item label="转赠时间">
        <el-date-picker
          v-model="form.give_time"
          type="datetime"
          placeholder="转赠时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions0"
          clearable
        />
      </el-form-item>
      <el-form-item label="能否转赠" prop="give_status">
        <el-radio-group v-model="form.give_status">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="[0].includes(form.type)">
        <el-form-item label="是否预告" prop="is_pre">
          <el-radio-group v-model="form.is_pre">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖" prop="is_hot">
          <el-radio-group v-model="form.is_hot">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="是否同步奇藏果" prop="sync_status">
        <el-radio-group v-model="form.sync_status">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0" :disabled="form.sync_gwj_status===0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否同步甘文交" prop="sync_gwj_status">
        <el-radio-group v-model="form.sync_gwj_status">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0" :disabled="form.sync_status===0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="权益说明" prop="desc">
        <el-input v-model="form.desc" type="textarea" disabled :rows="4" placeholder="权益说明" />
      </el-form-item>
      <el-form-item label="详情说明" prop="detail">
        <el-link type="primary" :underline="false" :disabled="!form.cast_goods_id" @click="onTinymce()">点击查看</el-link>
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

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <el-dialog
      title="详情说明"
      width="800px"
      append-to-body
      :visible.sync="editTinymceVisible"
    >
      <div class="dialog-img" v-html="form.detail" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import CustomUpload from '@/components/Upload/CustomUpload'
import { tagList } from '@/api/common'
import { goodsItem } from '@/api/collection'
import { airdropList, addAirdrop } from '@/api/airdrop'
import { DominKey, getToken } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { castList } from '@/api/cast'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, ElImageViewer },
  data() {
    const validateStock = (rule, value, callback) => {
      if (!this.form.id && this.form.cast_goods_id && (this.form.stock > this.stock)) {
        callback(new Error('库存不能大于铸造藏品库存'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      visible: false,
      btnLoading: false,
      editTinymceVisible: false,
      imageViewer: false,
      imageViewerList: [],
      domin: getToken(DominKey),
      tagsOptions: [],
      airOptions: [
        { label: '藏品', value: 0 },
        { label: '空投活动', value: 1 }
      ],
      typeOptions: [
        { label: '空投藏品', value: 2 },
        { label: '资格券', value: 5 }
      ],
      activitiesOptions: [],
      castOptions: [],
      currentName: '',
      percentage: 0,
      stock: 0,
      mtlList: [],
      objList: [],
      castList: [],
      gltfList: [],
      binList: [],
      objPercentage: 0,
      mtlPercentage: 0,
      gltfPercentage: 0,
      binPercentage: 0,
      form: {
        cast_goods_id: '',
        id: 0,
        type: '',
        is_three: 0,
        name: '',
        activity_name: '',
        cate: '',
        author: '',
        author_avatar: '',
        show_image: '',
        issuer: '',
        desc: '',
        detail: '',
        start_time: new Date(),
        images: [],
        cny_price: '',
        limit_num: '',
        stock: '',
        tags: [],
        is_hot: 0,
        is_pre: 0,
        give_time: '',
        give_status: 0,
        sync_status: 1,
        sync_gwj_status: 1,
        three_url: {
          three_type: '',
          three_mtl: '',
          three_obj: '',
          three_gltf: '',
          three_bin: '',
          three_image: []
        },
        sort: '',
        integral_reward: 0
      },
      rules: {
        cast_goods_id: [
          { required: true, message: '请选择铸造藏品', trigger: ['blur', 'change'] }
        ],
        tags: [
          { required: true, message: '请选择藏品标签', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择藏品类型', trigger: ['blur', 'change'] }
        ],
        cate: [
          { required: true, message: '请选择空投类型', trigger: ['blur', 'change'] }
        ],
        activity_name: [
          { required: true, message: '请选择活动名称', trigger: ['blur', 'change'] }
        ],
        is_three: [
          { required: true, message: '请选择是否展示3D', trigger: ['blur', 'change'] }
        ],
        'three_url.three_mtl': [
          { required: true, message: '请上传mtl文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_obj': [
          { required: true, message: '请上传obj文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_gltf': [
          { required: true, message: '请上传gltf文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_bin': [
          { required: true, message: '请上传bin文件', trigger: ['blur', 'change'] }
        ],
        'three_url.three_image': [
          { required: true, message: '请上传图片文件', trigger: ['blur', 'change'] }
        ],
        images: [
          { required: true, message: '请选择藏品图片', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入藏品名称', trigger: ['blur', 'change'] }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: ['blur', 'change'] },
          { validator: validateStock, trigger: ['blur', 'change'] }
        ],
        cny_price: [
          { required: true, message: '请输入人民币价格', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '请输入创作者', trigger: ['blur', 'change'] }
        ],
        author_avatar: [
          { required: true, message: '请选择创作者头像', trigger: ['blur', 'change'] }
        ],
        issuer: [
          { required: true, message: '请输入发行方', trigger: ['blur', 'change'] }
        ],
        limit_num: [
          { required: true, message: '请输入限购数量', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '请选择开售时间', trigger: ['blur', 'change'] }
        ],
        detail: [
          { required: true, message: '请输入详情说明', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '请输入权益说明', trigger: ['blur', 'change'] }
        ],
        give_status: [
          { required: true, message: '请选择能否转赠', trigger: ['blur', 'change'] }
        ],
        sync_status: [{ required: true, message: '请选择是否同步', trigger: ['blur', 'change'] }],
        sync_gwj_status: [{ required: true, message: '请选择是否同步', trigger: ['blur', 'change'] }],
        integral_reward: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    ...mapGetters(['integral', 'integral_use'])
  },
  methods: {
    initAboutIntegral() {
      if (this.integral_use) {
        this.form = { ...this.form, integral_price: '' }
        this.rules = { ...this.rules, integral_price: [{ required: true, message: `价格不能为空`, trigger: ['blur', 'change'] }] }
      }
    },
    init(data) {
      this.visible = true
      this.initAboutIntegral()
      this.tagLists()
      this.castLists()
      if (data) {
        this.form.id = data.id
        this.getDetails()
      }
    },
    tagLists() {
      tagList().then(response => {
        this.tagsOptions = response.data.map(v => {
          return {
            label: v.name,
            value: v.id
          }
        })
      })
    },
    castLists() {
      castList().then(response => {
        this.visible = true
        this.castList = response.data
        this.castOptions = response.data.map(v => {
          return {
            label: v.name,
            value: v.id,
            image: v.images && v.images[0]
          }
        })
      })
    },
    changeCast(id) {
      this.stock = this.castList.find(v => v.id === id).stock
      this.form = Object.assign(this.form, this.castList.find(v => v.id === id), { stock: 0, id: 0 })
      if ([1].includes(this.form.is_three)) {
        const three_mtl = this.form.three_url.three_mtl
        const three_bin = this.form.three_url.three_bin
        const three_gltf = this.form.three_url.three_gltf
        const three_obj = this.form.three_url.three_obj
        this.mtlList = [{ name: three_mtl, url: three_mtl }]
        this.gltfList = [{ name: three_gltf, url: three_gltf }]
        this.binList = [{ name: three_bin, url: three_bin }]
        this.objList = [{ name: three_obj, url: three_obj }]
      }
    },
    getDetails() {
      goodsItem(this.form.id)
        .then(response => {
          this.form = Object.assign(response.data, { tags: response.data.tags.map(v => v.id) })
          if ([1].includes(response.data.is_three)) {
            const three_mtl = this.form.three_url.three_mtl
            const three_obj = this.form.three_url.three_obj
            const three_gltf = this.form.three_url.three_gltf
            const three_bin = this.form.three_url.three_bin
            this.mtlList = three_mtl ? [{ name: three_mtl, url: three_mtl }] : []
            this.objList = three_obj ? [{ name: three_obj, url: three_obj }] : []
            this.gltfList = three_gltf ? [{ name: three_gltf, url: three_gltf }] : []
            this.binList = three_bin ? [{ name: three_bin, url: three_bin }] : []
          } else {
            this.form = Object.assign(this.form, { three_url: { three_type: '', three_mtl: '', three_obj: '', three_gltf: '', three_bin: '', three_image: [] }})
          }
        })
        .catch(() => {})
    },
    getAirdropList(value) {
      if (value === 1) {
        airdropList()
          .then(response => {
            this.activitiesOptions = response.data.map(v => {
              return { label: v.name, value: v.name, left: v.left }
            })
          })
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            this.$confirm(`确定对[(#${this.form.id})]进行修改?`, '编辑', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.hanldaddOrUpdate()
              })
              .catch(() => {
              })
          } else {
            this.hanldaddOrUpdate()
          }
        }
      })
    },
    hanldaddOrUpdate() {
      const data = JSON.parse(JSON.stringify(this.form))
      if (data.three_url && data.three_type === 'obj') {
        delete data.three_url.three_gltf
        delete data.three_url.three_bin
      } else if (data.three_url && data.three_type === 'gltf') {
        delete data.three_url.three_mtl
        delete data.three_url.three_obj
      }
      this.btnLoading = true
      addAirdrop(data)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    onTinymce(data) {
      this.editTinymceVisible = true
    },
    onInfo(value) {
      this.form.detail = value
    },
    onClose() {
      this.$reset()
    },
    handleRemove(file, fileList) {
      this.form.three_url[`three_${file.name.split('.')[1]}`] = ''
      this[`${file.name.split('.')[1]}List`] = []
    },
    closeViewer() {
      this.imageViewer = false
    },
    beforeAvatarUpload3d(file, cb, refName) {
      const a = file.name.split('.')
      const isLt20M = file.size / 1024 / 1024 < 20
      if (a[a.length - 1] !== refName.replace('three_url.three_', '')) {
        this.$message.error(`上传文件只能是 ${refName.replace('three_url.three_', '')} 格式!`)
        cb(false)
        return
      }
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'images') {
        this.form[this.currentName].push(response)
      } else if (this.currentName.indexOf('three_url') >= 0) {
        if (this.currentName.indexOf('image') >= 0) {
          this.form.three_url.three_image.push(response)
        } else {
          const a = this.currentName.split('.')
          this.form[a[0]][a[1]] = response
        }
      } else {
        this.form[this.currentName] = response
      }
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleError() {
      this[`${this.currentName.replace('three_url.three_', '')}List`] = []
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    elProgress(p, cpt, res) {
      this.percentage = p
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input-number {
    width: 200px;
  }
  .avatar-uploader {
    display: inline-block;
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
      object-fit: contain;
    }
  }
  .filter-list-box {
    .wrapper {
      display: inline;
      vertical-align: top;
    }

    .upload-images {
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      margin: 0 8px 8px 0;
      display: inline-block;
      position: relative;
      cursor: grabbing;
      .upload-image {
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        & > img {
          width: 100%;
        }
      }
      .upload-actions {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,0.5);
        text-align: center;
        display: none;
        i {
          margin-left: 6px;
          margin-top: 6px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      &:hover .upload-actions {
        display: block;
      }
      .upload-actions i {
        color: #fff;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .err-image {
      width: 100px;
      height: 100px;
      border: 1px solid #c0ccda;
      background: #f5f7fa;
      border-radius: 6px;
      .el-image{
        margin-left: 35px;
        margin-top: 35px;
      }
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
  .good-img {
    width: 30px;
    margin-left: 5px;
    height: 30px;
    vertical-align: middle;
    flex-shrink: 0;
  }
  .notice {
    margin: 10px 0 0 0;
    color: #909399;
    font-size: 12px;
    line-height: 1.5;
  }
  .recommend-page {
    width: 291px;
    margin: 0;
    .swiper-button-prev,.swiper-button-next {
      display: none;
      pointer-events: auto;
      cursor: pointer;
    }
    .swiper-button-prev::after, .swiper-button-next::after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover .swiper-button-prev, &:hover .swiper-button-next {
      display: flex;
    }
    .images-list {
      width: 80px;
      height: 80px;
      .image-item {
        height: 100%;
        cursor: pointer;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        img {
          height: auto;
        }
      }
    }
  }
  ::v-deep .el-upload-list__item .el-icon-close{
    display: none;
  }
</style>
