<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="APP隐藏商品" prop="intro_status">
        <el-switch
          v-model="form.is_hide"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-if="info.template_id !== 1" label="商品图片" prop="images">
        <div class="filter-list-box">
          <draggable v-model="form.images" v-bind="dragOptions" class="wrapper" @start="drag = true" @end="drag = false">
            <transition-group>
              <div v-for="(item,index) in form.images" :key="item" class="upload-images">
                <div class="upload-image">
                  <el-image :src="domin + item" />
                </div>
                <div class="upload-actions">
                  <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                  <i class="el-icon-delete" @click="onPictureRemove(item,index)" />
                </div>
              </div>
            </transition-group>
          </draggable><custom-upload
            class-name="avatar-uploader"
            @handleBeforeUpload="beforeAvatarUpload"
            @handleSuccess="handleAvatarSuccess"
          >
            <i slot="default" class="el-icon-plus avatar-uploader-icon" />
          </custom-upload>
        </div>
        <div class="notice">
          注意：商品主图尺寸建议为 750x750px
        </div>
      </el-form-item>
      <el-form-item label="所属专区" prop="zone">
        <el-select v-model="form.zone" @change="onChangeZone">
          <el-option v-for="item in zonesOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.zone" label="期数" prop="period_id">
        <el-select v-model="form.period_id">
          <el-option v-for="item in levelOptions.filter(v => v.zone === form.zone)" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="!levelOptions.filter(v => v.zone === form.zone).length" class="notice">
          提示：还没有对应{{ form.zone && form.zone.toUpperCase() }}的期数，请到<b @click="onGoto('/filLevels')">订单期数</b>中创建
        </div>
      </el-form-item>
      <el-form-item v-if="form.zone" label="商品分类" prop="cate_id">
        <el-select v-model="form.cate_id">
          <el-option v-for="item in cateOptions.filter(v => v.zone === form.zone)" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="!cateOptions.filter(v => v.zone === form.zone).length" class="notice">
          提示：还没有对应{{ form.zone && form.zone.toUpperCase() }}的商品分类，请到<b @click="onGoto('/category')">商品分类</b>中创建
        </div>
      </el-form-item>
      <el-form-item v-if="form.zone === 'fil'" label="商品属性" prop="cate">
        <el-select v-model="form.cate">
          <el-option v-for="item in catesOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.cate === 1" label="GAS费" prop="gass_fee">
        <el-input-number v-model="form.gass_fee" controls-position="right" placeholder="GAS费" :min="0" :precision="8" />
      </el-form-item>
      <el-form-item v-if="form.cate === 1" label="质押" prop="mortgage">
        <el-input-number v-model="form.mortgage" controls-position="right" placeholder="质押" :min="0" :precision="8" />
      </el-form-item>
      <el-form-item v-if="false" label="商品类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="['eth', 'btc'].includes(form.zone)" label="电费类型" prop="power_type">
        <el-select v-model="form.power_type">
          <el-option v-for="item in powerTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" controls-position="right" placeholder="商品名称" clearable />
      </el-form-item>
      <el-form-item label="商品单价(元)" prop="price">
        <el-input-number v-model="form.price" controls-position="right" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="['eth'].includes(form.zone) ? '算力(M)' : '算力(T)'" prop="spec">
        <el-input-number v-model="form.spec" controls-position="right" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item label="年限数量(天)" prop="years">
        <el-input-number v-model="form.years" controls-position="right" :precision="0" :min="0" />
        <div class="notice">
          注意：0 代表永久
        </div>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" controls-position="right" :precision="0" :min="0" />
      </el-form-item>
      <el-form-item v-if="['btc', 'eth'].includes(form.zone)" label="设备功耗(KW)" prop="power_waste">
        <el-input-number v-model="form.power_waste" controls-position="right" :min="0" />
        <div class="notice">
          单台设备每天耗电 <span>{{ form.electric_degree }}</span> 度
        </div>
      </el-form-item>
      <el-form-item label="排序(越大越靠前)" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :precision="0" :min="0" />
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="是否有市场奖励" prop="market_status">
            <el-switch
              v-model="form.market_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.market_status == 1" label="存储价格(元)" prop="storage_price">
            <el-input-number v-model="form.storage_price" controls-position="right" :precision="2" :min="0" />
            <span class="notice">
              <span>注意：存储价格即为市场奖励的计算基数，可与商品价格作区分</span>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="notice">
          <span>注意：商品市场奖励开关关闭之后用户下单不会产生市场奖励，具体市场逻辑请到<b @click="onGoto('/agents')">代理管理</b>中查看</span>
        </div>
      </el-form-item>

      <el-row>
        <el-col :span="5">
          <el-form-item label="是否限时优惠" prop="discount_status">
            <el-switch
              v-model="form.discount_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <div v-if="form.discount_status == 1">
            <el-form-item label="限时优惠结束时间" prop="dateRangeValue">
              <el-date-picker
                v-model="form.dateRangeValue"
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
            <el-form-item label="限时优惠价格(元)" prop="discount_price">
              <el-input-number v-model="form.discount_price" controls-position="right" :precision="2" :min="0" />
              <el-popover
                placement="top-start"
                trigger="hover"
              >
                <div class="preview-img">
                  <img src="@/assets/images/youhui.png" alt="">
                </div>
                <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
              </el-popover>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="是否做累计限购" prop="limit_status">
            <el-switch
              v-model="form.limit_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.limit_status == 1" label="累计限购数量" prop="limit_num">
            <el-input-number v-model="form.limit_num" controls-position="right" :precision="0" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="是否展示划线价格" prop="market_price_status">
            <el-switch
              v-model="form.market_price_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.market_price_status == 1" label="划线价格(元)" prop="market_price">
            <el-input-number v-model="form.market_price" controls-position="right" :precision="2" :min="0" />
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <div class="preview-img">
                <img src="@/assets/images/huaxianjia.png" alt="">
              </div>
              <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <el-form-item label="是否展示日产出说明" prop="daily_output_status">
            <el-switch
              v-model="form.daily_output_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.daily_output_status == 1" :label="`预计日产出(${form.zone && form.zone.toUpperCase()}/天)`" prop="daily_output">
            <el-input-number v-model="form.daily_output" controls-position="right" :min="0" />
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <div class="preview-img">
                <img src="@/assets/images/richanchu.png" alt="">
              </div>
              <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <el-form-item label="是否增加回本周期说明" prop="cycle_status">
            <el-switch
              v-model="form.cycle_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.cycle_status == 1" label="预计回本周期(天)" prop="cycle">
            <el-input-number v-model="form.cycle" controls-position="right" :min="0" />
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <div class="preview-img">
                <img src="@/assets/images/huibenzhouqi.png" alt="">
              </div>
              <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <el-form-item label="是否展示商品运营维护费" prop="operate_status">
            <el-switch
              v-model="form.operate_status"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item v-if="form.operate_status == 1" label="运营维护费(%)" prop="operate">
            <el-input-number v-model="form.operate" controls-position="right" :min="0" />
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <div class="preview-img">
                <img src="@/assets/images/weihufei.png" alt="">
              </div>
              <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
            </el-popover>
            <span class="notice">
              <span>注意：此处只做展示，业务扣费设置到期数管理中编辑查看</span>
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="是否增加设备算力说明" prop="power_status">
        <el-switch
          v-model="form.power_status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="form.power_status == 1" label="设备算力说明" prop="power">
        <el-input v-model="form.power" :rows="3" type="textarea" placeholder="设备算力说明" clearable />
        <el-popover
          placement="top-start"
          trigger="hover"
        >
          <div class="preview-img">
            <img src="@/assets/images/suanli.png" alt="">
          </div>
          <el-button slot="reference" type="text" icon="el-icon-search">预览</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="是否展示商品简介" prop="intro_status">
        <el-switch
          v-model="form.intro_status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="form.intro_status == 1" label="商品简介" prop="intro">
        <el-input v-model="form.intro" :rows="3" type="textarea" placeholder="商品简介" clearable />
      </el-form-item>

      <el-form-item v-if="false" label="单台设备耗电(度/天)" prop="electric_degree">
        <el-input-number v-model="form.electric_degree" controls-position="right" :min="0" />
      </el-form-item>

      <el-form-item label="购买须知" prop="purchase_notes">
        <el-input v-model="form.purchase_notes" :rows="3" type="textarea" placeholder="购买须知" clearable />
      </el-form-item>
      <el-form-item label="业务说明" prop="business_description">
        <el-link type="primary" :underline="false" @click="onTinymce(form)">点击编辑</el-link>
      </el-form-item>
      <el-form-item label="选择协议(可多选)" prop="agreement">
        <el-select v-model="form.agreement" multiple placeholder="请选择">
          <el-option
            v-for="item in agreementOptions.filter(v => form.zone === v.zone)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <edit-tinymce
      v-if="editTinymceVisible"
      ref="editTinymce"
      @info="onInfo"
    />

  </el-dialog>
</template>

<script>
import { addOrUpdate } from '@/api/goods'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'
import draggable from 'vuedraggable'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { powerLevelList as filLevel, specNameList as specList } from '@/api/fil-level'
import { toFixedDigit } from '@/utils'
import { zoneOptions, pickerOptions, powerTypeOptions, catesOptions } from '@/utils/explain'
import EditTinymce from './EditTinymce'
import { powerCategoryList } from '@/api/category'
import { powerAgreementList } from '@/api/agreement'
import { powerZoneList } from '@/api/zone'
import { mapGetters } from 'vuex'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, draggable, ElImageViewer, EditTinymce },
  data() {
    const validateReplace = (rule, value, callback) => {
      if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        callback(new Error('必须是大于0的数字'))
      } else {
        callback()
      }
    }

    const validateUsername = (rule, value, callback) => {
      if (value.length < 1 || value.length > 80) {
        callback(new Error('名称1位到80位之间'))
      } else {
        callback()
      }
    }

    const validateDate = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('请选择时间范围'))
      } else {
        callback()
      }
    }

    const validateIntro = (rule, value, callback) => {
      if (this.form.intro_status === 1 && !value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }

    const validatePower = (rule, value, callback) => {
      if (this.form.power_status === 1 && !value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      btnLoading: false,
      imageViewer: false,
      domin: getToken(DominKey),
      drag: false,
      imageViewerList: [],
      levelOptions: [],
      cateOptions: [],
      catesOptions: catesOptions.slice(1),
      zoneOptions: zoneOptions.slice(1),
      zonesOptions: [],
      specOptions: [],
      typeOptions: [
        { label: '普通', value: 'common' },
        { label: '注册可领', value: 'register' },
        { label: '新手特供', value: 'novice' }
      ],
      powerTypeOptions: powerTypeOptions.slice(1),
      pickerOptions,
      agreementOptions: [],
      form: {
        id: 0,
        name: '',
        period_id: '',
        cate_id: '',
        cate: '',
        gass_fee: 0,
        mortgage: 0,
        price: 0,
        market_price_status: 0,
        market_price: 0,
        market_status: 0,
        images: [],
        agreement: [],
        dateRangeValue: [],
        spec: 0,
        years: 0,
        stock: 0,
        limit: 0,
        power_status: 0,
        power: '',
        power_waste: 0,
        daily_output_status: 0,
        daily_output: 0,
        before: 0,
        after: 0,
        custody_rate: 0,
        electric_degree: 0,
        storage_price: 0,
        discount_status: 0,
        discount_start_time: '',
        discount_end_time: '',
        discount_price: 0,
        limit_status: 0,
        limit_num: 0,
        intro_status: 0,
        intro: '',
        cycle_status: 0,
        cycle: 0,
        zone: '',
        type: 'common',
        power_type: 0,
        rate: '',
        rate_desc: '',
        purchase_notes: '',
        business_description: '',
        operate_status: 0,
        operate: 0,
        is_hide: 0,
        sort: 0
      },
      rules: {
        images: [
          { required: true, message: '请上传商品图片', trigger: ['blur', 'change'] }
        ],
        period_id: [
          { required: true, message: '请选择期数', trigger: ['blur', 'change'] }
        ],
        zone: [
          { required: true, message: '请选择所属专区', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择商品类型', trigger: ['blur', 'change'] }
        ],
        cate_id: [
          { required: true, message: '请选择商品分类', trigger: ['blur', 'change'] }
        ],
        cate: [
          { required: true, message: '请选择商品属性', trigger: ['blur', 'change'] }
        ],
        gass_fee: [
          { required: true, message: '请输入gas费', trigger: ['blur', 'change'] }
        ],
        mortgage: [
          { required: true, message: '请输入抵押数量', trigger: ['blur', 'change'] }
        ],
        power_type: [
          { required: true, message: '请选择电费类型', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        price: [
          { required: true, message: '商品价格(元)不能为空' },
          { type: 'number', message: '商品价格(元)必须为数字' },
          { validator: validateReplace, trigger: ['blur', 'change'] }
        ],
        market_price: [
          { required: true, message: '市场价格(元)不能为空' },
          { type: 'number', message: '市场价格(元)必须为数字' }
        ],
        spec: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] },
          { validator: validateReplace, trigger: ['blur', 'change'] }
        ],
        years: [
          { required: true, message: '年限数量不能为空' },
          { type: 'number', message: '年限数量必须为数字' }
        ],
        stock: [
          { required: true, message: '库存不能为空' },
          { type: 'number', message: '库存必须为数字' }
        ],
        limit: [
          { required: true, message: '限购数量不能为空' },
          { type: 'number', message: '限购数量必须为数字' }
        ],
        intro: [
          { validator: validateIntro, trigger: ['blur', 'change'] }
        ],
        power: [
          { validator: validatePower, trigger: ['blur', 'change'] }
        ],
        power_waste: [
          { required: true, message: '设备功耗(KW)不能为空' },
          { type: 'number', message: '设备功耗(KW)必须为数字' }
        ],
        daily_output: [
          { required: true, message: '预计产出不能为空' },
          { type: 'number', message: '预计产出必须为数字' }
        ],
        cycle: [
          { required: true, message: '预计回本周期(天)不能为空' },
          { type: 'number', message: '预计回本周期(天)必须为数字' }
        ],
        before: [
          { required: true, message: '运营维护费回本前(%)不能为空' },
          { type: 'number', message: '运营维护费回本前(%)必须为数字' }
        ],
        after: [
          { required: true, message: '运营维护费回本后(%)不能为空' },
          { type: 'number', message: '运营维护费回本后(%)必须为数字' }
        ],
        custody_rate: [
          { required: true, message: '托管费率(%)不能为空' },
          { type: 'number', message: '托管费率(%)必须为数字' }
        ],
        sort: [
          { required: true, message: '商品排序不能为空' },
          { type: 'number', message: '商品排序必须为数字' }
        ],
        storage_price: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        discount_price: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        limit_num: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        operate: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        dateRangeValue: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] },
          { validator: validateDate, trigger: ['blur', 'change'] }
        ],
        risk_description: [
          { required: true, message: '请输入风险说明', trigger: ['blur', 'change'] }
        ],
        purchase_notes: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ],
        agreement: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      },
      editTinymceVisible: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    ...mapGetters([
      'info'
    ])
  },
  watch: {
    'form.power_waste'(val) {
      this.form.electric_degree = toFixedDigit(val * 24, 2)
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getFileLevelList()
      this.getCategoryList()
      this.getAgreementList()
      this.getZoneList()
      if (data) {
        this.form = Object.assign(this.form, data, data.extend)
        if (this.form.discount_start_time && this.form.discount_end_time) {
          this.form.dateRangeValue = [this.form.discount_start_time, this.form.discount_end_time]
        }
      }
    },
    getZoneList() {
      powerZoneList()
        .then(response => {
          response.data.forEach(v => {
            this.zonesOptions.push({
              label: v.name.toUpperCase(),
              value: v.name
            })
          })
        })
        .catch(() => {
        })
    },
    getFileLevelList() {
      filLevel()
        .then(response => {
          this.levelOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id,
              zone: v.type
            }
          })
        })
        .catch(() => {
        })
    },
    getCategoryList() {
      powerCategoryList()
        .then(response => {
          this.cateOptions = response.data.map(v => {
            return {
              label: v.name,
              value: v.id,
              zone: v.zone
            }
          })
        })
        .catch(() => {
        })
    },
    getAgreementList() {
      powerAgreementList()
        .then(response => {
          let title
          this.agreementOptions = response.data.map(v => {
            title = v.title.substring(0, 6)
            if (v.title.length > 6) {
              title = title + '...'
            }
            return {
              label: title,
              value: v.id,
              zone: v.zone
            }
          })
        })
        .catch(() => {
        })
    },
    onChangePeriod(data) {
      const level = this.levelOptions.find(v => {
        return v.value === data
      })
      this.getSpecList({ name: level.label })
    },
    getSpecList(data) {
      specList(data)
        .then(response => {
          this.specOptions = response.data.map(v => {
            return {
              label: v.spec.name,
              value: v.spec.id
            }
          })
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          if (data.zone !== 'fil') {
            data.cate = ''
          }

          addOrUpdate(data)
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
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.images.push(response)
      this.$refs.form.validateField('images')
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    onPictureRemove(img, index) {
      this.form.images.splice(index, 1)
    },
    closeViewer() {
      this.imageViewer = false
    },
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    onInfo(value) {
      this.form.business_description = value
    },
    onChangeZone() {
      this.form.cate_id = ''
      this.form.period_id = ''
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.discount_start_time = value[0]
        this.form.discount_end_time = value[1]
      } else {
        this.form.discount_start_time = this.form.discount_end_time = ''
      }
    },
    onGoto(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 200px;
}
.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
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
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
::v-deep .el-dialog {
  width: 1000px;
}
::v-deep .filter-list-box .wrapper {
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
}
.upload-images .upload-image {
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
}
.upload-images .upload-image > img {
  width: 100%;
}
.upload-images .upload-actions {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  text-align: center;
  display: none;
}
.upload-images:hover .upload-actions {
  display: block;
}
.upload-images .upload-actions i {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
.notice span {
  color: #E6A23C;
}
.notice b {
  color: #409eff;
  cursor: pointer;
}
.preview-img {
  width: 187.5px;
}
.preview-img img {
  width: 100%;
}
</style>
