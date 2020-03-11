<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="EditRoles('tjjs')">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="rolesList1" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag @close="removeRolesById(scope.row,item.id)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2, index2)  in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRolesById(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRolesById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑角色 -->
            <el-button
              :class="scope.row.id"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="EditRoles('bjjs', scope.row)"
            >编辑</el-button>
            <!-- 删除角色 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRolesModel(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 设置权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="showSetRoles" width="50%" :center="true">
      <!-- 树状控件 -->
      <el-tree
        :data="SetRolesData"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRoles = false">取 消</el-button>
        <el-button @click="showSetRolesDetermine" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="type === 'tjjs' ? '添加角色': '编辑角色'"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="outaddR"
    >
      <el-form
        :model="info"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名字" prop="roleName">
          <el-input v-model="info.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="info.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="DetermineADDR">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index.js'
export default {
  created() {
    this.getRoleslist()
  },
  data() {
    return {
      // 所有的角色列表信息
      rolesList1: [],
      // 是否显示设置权限对话框
      showSetRoles: false,

      // 权限列表
      SetRolesData: [],

      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 要展示的树状结构的子节点
      defkeys: [],
      // 当前的row的id
      RoleId: 1,
      // 是否开启编辑角色对话框
      EditDialog: false,
      dialogVisible: false,
      // 添加角色信息
      info: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色名字', trigger: 'blur' }
        ]
      },
      // ofEdit是否是编辑角色或者添加角色
      type: ''
    }
  },
  methods: {
    // 得到角色列表数据
    getRoleslist() {
      // 不带参数
      http.get('getRoleslist', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取角色列表失败!请重试!')
        this.rolesList1 = res.data.data
      })
    },
    // 根据id删除对应的权限
    async removeRolesById(row, Rolesid) {
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 取消删除
      if (res === 'cancel') return this.$message.info('取消删除!')
      const id = row.id
      http.delete('deleteRoles', { id, Rolesid }, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('删除失败!请重试!')
        row.children = res.data.data
        this.$message.success('删除成功!')
      })
    },

    // 获取所有权限列表
    showSetRolesModel(row) {
      // 当前row的id,等会给showSetRolesDetermine函数使用
      this.RoleId = row.id
      http.get('getRoleslist2', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('权限列表失败!请重试!')
        this.SetRolesData = res.data.data
        // 计算前清空数组
        this.defkeys.length = 0
        this.getRoleschildren(row, this.defkeys)
        this.showSetRoles = true
      })
    },

    // 递归函数,得到所有3级权限列表的的id值,并保存为数组
    getRoleschildren(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getRoleschildren(item, arr))
    },

    // 设置权限的确定按钮
    showSetRolesDetermine() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // keys转换为字符串并以逗号隔开发给服务器
      const keysArr = keys.join(',')

      http.post('upRoles', { id: this.RoleId, keysArr: keysArr }, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('权限更新失败!请重试')
        this.showSetRoles = false
        this.$message.success('权限更新成功!')
        this.getRoleslist()
      })
    },
    // 编辑或者添加按钮角色按钮
    EditRoles(type, row) {
      this.type = type
      if (this.type === 'tjjs') {
        this.info = this.info = {
          roleName: '',
          roleDesc: ''
        }
        // console.log(this.info)
      } else if (type === 'bjjs') {
        this.info = {
          id: row.id,
          roleName: row.roleName,
          roleDesc: row.roleDesc
        }
        // console.log(this.info)
      }
      this.dialogVisible = true
    },
    // 删除角色按钮
   async deleteRoles(row) {
      const Whether = await this.$confirm(
        '此操作将永久删除该角色!, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if(Whether=== 'cancel') return this.$message.info('取消删除')
      http.delete('deleteRoles',row.id,res => {
        if(res.data.meta.status !== 200) return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
        this.getRoleslist()
      })
    },
    // 关闭添加角色对话框
    outaddR() {
      this.info = {
        roleName: '',
        roleDesc: ''
      }
      this.$refs.ruleForm.resetFields()
    },
    // 确定添加角色按钮
    DetermineADDR() {
      if (this.type === 'tjjs') {
        http.post('addroles', this.info, res => {
          if (res.data.meta.status !== 201)
            return this.$message.error('添加角色失败!')
          this.$message.success('添加角色成功!')
          this.getRoleslist()
        })
        this.dialogVisible = false
      } else if (this.type === 'bjjs') {
        http.put('UProless', this.info, res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('角色更新失败!')
          this.$message.success('角色更新成功!')
          this.getRoleslist()
        })
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>