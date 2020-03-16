<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-alert title="添加商品信息" center type="info" show-icon></el-alert>
      <!-- 任务步骤条 -->
      <el-steps class="alertBxo" :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="步骤1" description="基本信息"></el-step>
        <el-step title="步骤2" description="商品参数"></el-step>
        <el-step title="步骤3" description="商品属性"></el-step>
        <el-step title="步骤4" description="商品图片"></el-step>
        <el-step title="步骤5" description="商品内容"></el-step>
        <el-step title="步骤6" description="完成"></el-step>
      </el-steps>
      <!-- 商品整体表单 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- Tabs标签页 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabsHan"
          @tab-click="TabsclickHan"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name" width="300px"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" width="300px"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" width="300px"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" width="300px"></el-input>
            </el-form-item>
            <!-- 级联菜单 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateListData"
                :props="cascaderProps"
                @change="selecthandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数 -->
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(_item, index) in item.attr_vals"
                  :key="index"
                  :label="_item"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性 -->
            <el-form-item v-for="(item, index) in onlyData" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              list-type="picture"
              :headers="headerObj"
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器插件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="btnMaring" type="primary" @click="addCate">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <img :src="previewURL" alt="图片丢失了" class="proveImg" />
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index.js'
import _ from 'lodash'
export default {
  created() {
    this.getcateList()
  },
  data() {
    return {
      activeIndex: '0',
      // 商品整体表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',

        // 商品所属的分类数组
        goods_cat: [],
        // 图片临时地址
        pics: [],
        // 富文本内容
        goods_introduce: '',
        // 动态参数和静态属性的集合
        attrs: []
      },
      // 级联菜单数据
      cateListData: [],
      // 级联菜单配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },

      // 商品表单验证规则
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      // 图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewURL: '',
      dialogVisible: false
    }
  },

  methods: {
    getcateList() {
      http.get('getList', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取商品列表失败!')
        this.cateListData = res.data.data
      })
    },

    selecthandleChange() {
      if (this.addForm.goods_cat.length === 1) return
      if (this.addForm.goods_cat.length === 2) {
        this.addForm.goods_cat.length = []
        return this.$message.info('只能选择第三类')
      }
    },
    beforeTabsHan(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类!')
        return false
      }
    },
    TabsclickHan() {
      if (this.activeIndex === '1') {
        this.getParamssData('many')
      } else if (this.activeIndex === '2') {
        this.getParamssData('only')
      }
    },
    // 拉取属性或参数
    getParamssData(valss) {
      http.get(
        'getmanyParams',
        { id: this.addForm.goods_cat[2], sel: valss },
        res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('获取信息失败!')

          res.data.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          // 如果是动态参数
          if (valss === 'many') {
            this.manyData = res.data.data
          } else if (valss === 'only') {
            // 如果是静态属性
            res.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? '' : item.attr_vals.join(',')
            })
            this.onlyData = res.data.data
            // console.log(this.onlyData)
          }
        }
      )
    },

    // 删除图片钩子
    handleRemove(file) {
      this.addForm.pics.forEach((item, index) => {
        if (item.pic === file.response.data.tmp_path) {
          this.addForm.pics.splice(index, 1)
        }
      })
    },
    // 图片上传成功钩子
    onSuccess(esponse) {
      const picInof = {
        pic: esponse.data.tmp_path
      }
      this.addForm.pics.push(picInof)
    },
    // 图片预览
    handlePreview(file) {
      this.previewURL = file.response.data.url
      this.dialogVisible = true
      // console.log(file.response.data.url);
    },
    // 添加商品完成整体表单验证
    addCate() {
      this.$refs.addruleForm.validate(vilde => {
        // 判断表单是否通过验证规则
        if (!vilde) return this.$message.error('请填写表单的必要项')
        // 深克隆一下
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyData.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newinfo)
        })
        this.onlyData.forEach(item => {
          const newinfos = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newinfos)
        })
        form.attrs = this.addForm.attrs
        // post添加商品
        http.post('addCateFrom', form, res => {
          if (res.data.meta.status !== 201)
            return this.$message.error('添加失败!')
          this.$message.success('添加成功!')
          this.$router.push({
            path: '/goods'
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.alertBxo {
  margin-bottom: 40px;
  margin-top: 20px;
}
.el-checkbox {
  margin: 0px;
}
.proveImg {
  width: 100%;
}
.btnMaring {
  margin-top: 15px;
}
</style>