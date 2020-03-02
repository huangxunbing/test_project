<template>
  <div class="login_cantainer">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <div>
        <el-form
          ref="loginfromRef"
          :model="loginFrom"
          :rules="rules"
          label-width="0px"
          class="longin_form"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginFrom.username" placeholder="用户名" :clearable="true">
              <i slot="prefix" class="iconfont icon-user"></i>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginFrom.password"
              type="password"
              placeholder="密码"
              :clearable="true"
            >
              <i slot="prefix" class="iconfont icon-3702mima"></i>
            </el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item class="btnBox">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetloginFrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../http/index.js'
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // from表单的验证规则
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginfromRef.validate(valid => {
        // 判断登录表单是否合法
        if (!valid) return
        // 表单合法发ajax
        http.post('login', this.loginFrom, result => {
          const { data } = result
          if (data.meta.status !== 200)
            return this.$message.error('登录失败! 账号或密码错误')
          this.$message.success('登录成功!')
          // 把服务器返回的token存到sessionStorage
          window.sessionStorage.setItem('token', data.data.token)
          console.log(data.data.token)
          this.$router.push('/home')
        })
      })
    },
    // 重置按钮重置表单
    resetloginFrom() {
      // console.log(this);
      this.$refs.loginfromRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_cantainer {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.btnBox {
  display: flex;
  justify-content: flex-end;
}
.longin_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
