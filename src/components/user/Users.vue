<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入搜索内容"
            class="input-with-select"
            clearable
            @clear="empty"
          >
            <el-button slot="append" icon="el-icon-search" @click="getqueryInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isShowmode = true">添加新用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="username" label="姓名" width="180"></el-table-column>

        <el-table-column prop="email" label="邮箱地址"></el-table-column>

        <el-table-column prop="role_name" label="角色"></el-table-column>

        <el-table-column prop="mobile" label="联系电话"></el-table-column>

        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <div>
              <el-switch v-model="scope.row.mg_state" @change="changeSwitch(scope.row)"></el-switch>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop label="操作" width="180">
          <template slot-scope="scope">
            <div>
              <div :class="scope.row.id"></div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="isShowusermodochange(scope.row.id)"
              ></el-button>
              <el-button
                @click="opendeleteuser(scope.row.id)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配权限"
                placement="top"
                :enterable="false"
              >
                <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加新用户" :visible.sync="isShowmode" width="50%" @close="outaddForm">
      <el-form
        :model="adduserForm"
        :rules="addrules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="adduserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="adduserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="adduserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="adduserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowmodeDetermine" type="primary">确 定</el-button>
        <el-button @click="isShowmode = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="isShowusermodo" width="50%" @closed="outuserdataForm">
      <el-form
        :model="userIdData"
        :rules="addrules"
        ref="outuserdataForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userIdData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="userIdData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="userIdData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chanGeuserdata">确 定</el-button>
        <el-button @click="isShowusermodo = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index'
export default {
  created() {
    // 拉取用户数据列表
    this.getqueryInfo()
  },
  data() {
    // 验证邮箱
    const cheEmail = (rule, value, callback) => {
      const rulesEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (rulesEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱地址'))
    }

    // 验证密码
    const NumberR = (rule, value, callback) => {
      const rulesNumber = /^1[3456789]\d{9}$/
      if (rulesNumber.test(value)) return callback()
      callback(new Error('请输入合法的手机号码!'))
    }
    // 验证密码
    const password = (rule, value, callback) => {
      const rulesPassword = /^\w{6,18}$/
      if (rulesPassword.test(value)) return callback()
      callback(new Error('密码由6-18位的数字、字母、下划线组成'))
    }

    return {
      // ajax参数列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 数据总条数
      total: 1,
      // 用户数据集
      userList: [],
      // 添加用的对话框的显示与隐藏
      isShowmode: false,
      // 添加用户表单
      adduserForm: {
        name: '',
        password: '',
        email: '',
        number: ''
      },
      // 添加用户表单的验证规则
      addrules: {
        username: [
          { required: true, message: '请输入正确的用户名称!', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确的用户密码!', trigger: 'blur' },
          { validator: password, trigger: 'blur' }
        ],
        email: [
          {
            required: false,
            message: '请输入正确的邮箱地址!',
            trigger: 'blur'
          },
          { validator: cheEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: false,
            message: '请输入正确的手机号码!',
            trigger: 'blur'
          },
          { validator: NumberR, trigger: 'blur' }
        ]
      },
      // 是否显示修改用户对话框
      isShowusermodo: false,
      // 查询Id的用户数据
      userIdData: {}
    }
  },
  methods: {
    // 拉取用户数据列表
    getqueryInfo() {
      http.get('getqueryInfo', { params: this.queryInfo }, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('用户数据列表失败! 请从试!')
        this.total = res.data.data.total
        this.userList = res.data.data.users
      })
    },

    // 分页监听
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getqueryInfo()
    },

    // 监听用户状态改变
    changeSwitch(userStatus) {
      http.put(
        'Userstatus',
        { userId: userStatus.id, Status: userStatus.mg_state },
        res => {
          if (res.data.meta.status !== 200) {
            userStatus.mg_state = !userStatus.mg_state
            return this.$message.error('修改用户状态失败! 请从试!')
          }
          this.$message.success('更新用户状态成功!')
        }
      )
    },

    // 清空搜索框
    empty() {
      this.getqueryInfo()
    },

    // 监听用户对话框是否关闭
    outaddForm() {
      this.$refs.addForm.resetFields()
    },

    // 添加用户确定按钮
    isShowmodeDetermine() {
      this.$refs.addForm.validate(res => {
        if (!res)
          return this.$message.error('添加用户失败!用户数据格式不正确,请重试!')

        const username = this.adduserForm.username
        const password = this.adduserForm.password
        const email = this.adduserForm.email
        const mobile = this.adduserForm.number
        // 组建用户数据
        const adduserForm = {
          username,
          password,
          email,
          mobile
        }
        // 添加用户post请求
        http.post('addusers', adduserForm, data => {
          if (data.data.meta.status !== 201)
            return this.$message.error('用户创建失败!请重试!')
          this.$message.success('添加用户成功!')
          // ??????
          this.getqueryInfo()
          this.isShowmode = false
        })
      })
    },

    // 查询id用户数据监听
    isShowusermodochange(id) {
      http.get('getuserIdData', id, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取用户数据失败! 请重试!')
        this.userIdData = res.data.data
        // 显示对话框
        this.isShowusermodo = true
      })
    },

    // 修改用户信息
    chanGeuserdata() {
      this.$refs.outuserdataForm.validate(res => {
        if (!res) return this.$message.error('用户信息不正确!')
        http.put('changuserdata', this.userIdData, res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('更新用户失败! 请重试!')
          this.$message.success('更新用户成功!')
          this.getqueryInfo()
          this.isShowusermodo = false
        })
      })
    },
    // 关闭用户信息对话框监听
    outuserdataForm() {
      this.$refs.outuserdataForm.resetFields()
    },
    //
    async opendeleteuser(id) {
      const confirmRes = await this.$confirm(
        '此操作将删除该用户!, 是否继续?',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmRes === 'cancel')
        return this.$message({
          type: 'scuccess',
          message: '取消删除!'
        })
      http.delete('deleteUser', id, res => {
        if(res.data.meta.msg === '不允许删除admin账户') return this.$message({
          type: 'error',
          message: res.data.meta.msg
        })
        if(res.data.meta.status !== 200) return this.$message({
          type: 'error',
          message: '删除用户失败!请从试!'
        })
        this.getqueryInfo()
        this.$message.success('删除用户用户成功!');
        return;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px !important;
}
.el-table {
  margin-top: 20px;
  font-size: 13px;
  margin-bottom: 20px;
}
</style>
