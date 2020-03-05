<template>
  <!-- 退出按钮 -->
  <el-container>
    <!-- header -->
    <el-header>
      <div class="logoBox">
        <img src="../assets/heima.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button class="logoutbtn" type="info" @click="logout">注销</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <!-- 是否折叠侧边俩按钮 -->
        <div class="tougle_button" @click="isFold">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu  v-for="item in MenuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单 -->
            <template slot="title">
              <i  :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <el-menu-item 
              :index=" '/' + _item.path" 
              v-for="_item in item.children" 
              :key="_item.id"
              @click="serveNavstate('/' + _item.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{_item.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 内容主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    
  </el-container>
</template>

<script>
import http from '../http/index.js'
export default {
  data() {
    return {
      // 菜单列表
      MenuList: [],
      // 是否折叠菜单栏
      collapse: false,
      // 当前被激活的链接地址
      activePath: '',
      // icon图标对象
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
    }
  },
  created () {
    //组件创建完拉取菜单栏
    this.getMeun();
    //组件创建完读取sessionStorage给Meun子组件高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出按钮
    logout() {
      // 清空token
      // 并跳转到lonin
      window.sessionStorage.clear()
      this.$router.push('/login')
      return this.$message.success('退出成功!')
    },

    // 这是拉取菜单的ajax
    getMeun(){
      http.get('getMeunList', (data) => {
        if(data.data.meta.status !== 200) return this.$message.error(data.data.meta.msg);
        const res = data.data
        this.MenuList = res.data;
      })
    },

  // 转换侧边栏折叠模式
    isFold(){
      this.collapse = !this.collapse
    },

    // 保存点击链接的path
    serveNavstate(v){
      window.sessionStorage.setItem('activePath', v);
      this.activePath = v;
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 24px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
  
}
.iconfont{
  padding-right: 20px;
}
.el-menu{
  border-right: none;
}
.tougle_button{
  width: 100%;
  height: 30px;
  color: white;
  background-color: #4A5064;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
// .logoutbtn{
//   position: relative;
//   top: 50%;
//   transform: translate(0, -50%);
//   float: right;
// }
</style>