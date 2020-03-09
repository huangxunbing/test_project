<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert title="注意: 只允许为第三级分类设置参数!!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 现在商品分类 -->

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联菜单 -->
          <el-cascader
            v-model="ParamsItemArr"
            :options="ParamsList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            class="btnmargin"
            type="primary"
            size="mini"
            :disabled="isBtndisbled"
            @click="addopendialogHan"
          >添加参数</el-button>
          <!-- Table -->
          <el-table :data="manyTableData" border stripe>
            <!--  -->
            <el-table-column type="expand">

              <template slot-scope="scope">
                <!-- tag标签区域 -->
                <el-tag @close="ChangeHandora(index,scope.row)"  closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 添加标签按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>

            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEideDilog(scope.row.attr_id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteChange(scope.row.attr_id)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only" :disabled="isBtndisbled">
          <!-- 添加参数按钮 -->
          <el-button
            class="btnmargin"
            type="primary"
            size="mini"
            :disabled="isBtndisbled"
            @click="addopendialogHan"
          >添加参数</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
               <template slot-scope="scope">
                <!-- tag标签区域 -->
                <el-tag @close="ChangeHandora(index,scope.row)"  closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 添加标签按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <!-- 编辑按钮 -->
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEideDilog(scope.row.attr_id)"
                  >编辑</el-button>
                  <!-- 删除按钮 -->
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteChange(scope.row.attr_id)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>

    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addisOpendialog"
      width="50%"
      @close="addhandleClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addParasFrom"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addisOpendialog = false">取 消</el-button>
        <el-button type="primary" @click="addParamsChange">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑' + dialogTitle"
      :visible.sync="editisOpendialog"
      width="50%"
      @close="edithandleClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editFrom"
        :rules="addFromRules"
        ref="editParasFrom"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editisOpendialog = false">取 消</el-button>
        <el-button type="primary" @click="editParamsChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index.js'
export default {
  created() {
    this.getParamsList()
  },
  data() {
    return {
      // 级联菜单数据
      ParamsList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 当前选中的三级分类数组
      ParamsItemArr: [],
      //  Tabs页签默认v-model
      activeName: 'many',
      // 动态数据
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 是否打开添加参数(属性)对话框
      addisOpendialog: false,
      //是否打开编辑参数(属性)对话框
      editisOpendialog: false,
      // 添加参数的表单
      addFrom: {
        attr_name: ''
      },

      editFrom: {
        attr_name: ''
      },
      // 添加参数的表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      nowId: 1
    }
  },
  methods: {
    // created的获取级联菜单数据
    getParamsList() {
      http.get('getParamsList', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取级联菜单数据失败!')
        this.ParamsList = res.data.data
      })
    },
    // 级联菜单的变化监听
    handleChange() {
      if(this.ParamsItemArr.length === 1) return
      if(this.ParamsItemArr.length === 2) {
        this.ParamsItemArr.length = []
        return this.$message.info('只能选择第三类')
      }
      this.getParamsData()
    },
    // 获取数据
    getParamsData() {
      http.get(
        'getParams',
        { catId: this.catId, selName: this.activeName },
        res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('获取参数失败!!')
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          if (this.activeName === 'many') {
            this.manyTableData = res.data.data
          } else {
            this.onlyTableData = res.data.data
          }
        }
      )
    },
    // tabs的点击处理函数
    handleClick() {
      if (this.ParamsItemArr.length < 3) return
      this.getParamsData()
    },

    // 关闭添加对话框监听
    addhandleClose() {
      this.$refs.addParasFrom.resetFields()
    },
    //关闭编辑对话框监听
    edithandleClose() {
      this.$refs.editParasFrom.resetFields()
    },
    // 点击添加参数按钮
    addopendialogHan() {
      this.addisOpendialog = true
    },
    // 添加确定按钮
    addParamsChange() {
      this.$refs.addParasFrom.validate(valid => {
        if (!valid) return this.$message.error('参数格式不正确!')
        http.post(
          'addParams',
          {
            id: this.ParamsItemArr[2],
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          },
          res => {
            console.log(res.data.data)
            this.$message.success('添加成功!')
            this.getParamsData()
            this.addisOpendialog = false
          }
        )
      })
    },
    // 编辑对话框
    showEideDilog(id) {
      this.nowId = id
      http.get(
        'getIdData',
        { Id: this.ParamsItemArr[2], attrId: id, attr_sel: this.activeName },
        res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('获取数据失败!')
          this.editFrom = res.data.data
        }
      )
      this.editisOpendialog = true
    },
    // 编辑确定按钮
    editParamsChange() {
      this.$refs.editParasFrom.validate(valid => {
        if (!valid) return this.$message.error('参数格式不正确!')
        http.put(
          'editParams',
          {
            id: this.ParamsItemArr[2],
            attr_name: this.editFrom.attr_name,
            attr_id: this.nowId,
            attr_sel: this.activeName
          },
          res => {
            console.log(res.data.meta)
            if (res.data.meta.status !== 200)
              return this.$message.error('编辑失败!')
            this.$message.success('添加成功!')
            this.getParamsData()
            this.editisOpendialog = false
          }
        )
      })
    },
    // 删除参数按钮
    async deleteChange(attrId) {
      const netx = await this.$confirm(
        '此操作将删除该数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (netx === 'cancel') return
      http.delete(
        'deleteParams',
        { id: this.ParamsItemArr[2], attrId: attrId },
        res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('删除失败!!')
          this.$message.success('删除成功!')
          this.getParamsData()
        }
      )
    },
    // 添加标签监听,回车和失去焦点
    handleInputConfirm(row) {
      row.inputVisible = false
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false,
      this.SaveAttVals(row)
    },
    // 更新和删除tag的请求
    SaveAttVals(row){
      http.put(
        'upParams',
        {
          Id: this.ParamsItemArr[2],
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        },
        res => {
          if(res.data.meta.status !== 200) return this.$message.error('更新失败!')
          this.$message.success('更新成功')
        }
      )
    },
    //
    showInput(row) {
      row.inputVisible = true
      // $nextTick是页面渲染完成的时候执行的回调
      // 如果不写$nextTick而直接执行获取元素代码可能会报错
      // 因为页面还没渲染出该元素
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag标签监听
    ChangeHandora(index,row){
      row.attr_vals.splice(index,1)
      this.SaveAttVals(row)
    }
  },

  // 计算属性
  computed: {
    isBtndisbled() {
      if (this.ParamsItemArr.length !== 3) {
        return true
      }
      return false
    },
    catId() {
      if (this.ParamsItemArr.length === 3) {
        return this.ParamsItemArr[2]
      }
      return null
    },
    dialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
  margin-bottom: 15px;
}
.btnmargin {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>