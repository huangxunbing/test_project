<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddCat">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="TreeTable"
        :show-index="true"
        index-text="#"
        :border="true"
        :selection-type="false"
        :expand-type="false"
        :data="cateList"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 等级 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="dleCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 6, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addcatModel" width="50%" @close="outaddCat">
      <el-form
        :model="addCatForm"
        :rules="rules"
        ref="addCatFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 表单区域 -->
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectdKeys"
            :options="parentCateList"
            :props="cascaderProps"
            popper-class="cascaderBox"
            size="mini"
            @change="changeCatlisst"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatModel = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index.js'
export default {
  created() {
    this.getcateList()
  },
  data() {
    return {
      // 商品分类列表
      cateList: [],
      total: 1,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          lable: '分类名称',
          prop: 'cat_name'
        },
        {
          lable: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          lable: '排序',
          type: 'template',
          template: 'order'
        },
        {
          lable: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 是否显示添加分类对话框
      addcatModel: false,
      // 添加分类表单数据对象
      addCatForm: {
        // 商品名称
        cat_name: '',
        // 父级id
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      // 添加分类表单验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      //
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 父级分类的v-model
      selectdKeys: [],
      dialogVisible: false
    }
  },
  methods: {
    // 获取商品分类列表
    getcateList() {
      http.get('getcateList', this.queryInfo, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取商品分类列表,请重试!')
        this.cateList = res.data.data.result
        this.total = res.data.data.total
        this.pagesize = res.data.data.pagesize
      })
    },
    // 更新页码
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getcateList()
    },
    // 更新页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getcateList()
    },
    // 添加分类按钮
    showaddCat() {
      // 先获取父级分类数据
      this.getParentCateList()
      this.addcatModel = true
    },
    // 拉取父级分类数据
    getParentCateList() {
      http.get('getParentCateList', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取父级分类数据失败!')
        this.parentCateList = res.data.data
      })
    },
    // 级联选择器变化监听
    changeCatlisst() {
      if (this.selectdKeys.length > 0) {
        this.addCatForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        this.addCatForm.cat_level = this.selectdKeys.length
        return
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 对话框确定按钮
    addCat() {
      this.$refs.addCatFormRef.validate(valid => {
        if (!valid) return this.$message.error('商品名称格式不正确!')
        http.post('addCat', this.addCatForm, res => {
          if (res.data.meta.status !== 201)
            return this.$message.error('添加分类失败!')
          this.$message.success('添加分类成功!')
          this.getcateList()
          this.addcatModel = false
        })
      })
    },
    // 关闭添分类的对话框
    outaddCat() {
      this.selectdKeys = []
      this.$refs.addCatFormRef.resetFields()
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    },
    async dleCate(id) {
      const Whether = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if(Whether === 'cancel') return this.$message.info('取消删除')
      http.delete('deleteIdCate',id,res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
        this.getcateList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.TreeTable {
  margin-top: 10px;
  margin-bottom: 10px;
}
.cascaderBox {
  height: 200px;
}
</style>