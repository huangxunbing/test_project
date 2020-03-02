/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
  //访问跟(/)路径的时候重定向(redirect)到login
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../components/Home.vue')
  }
]

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // 访问login直接放行
  if(to.path === '/login') return next();
  // 每次路由跳转前判断是否有token
  // 如果没有直接强制跳转到登录界面
  const TokenStr = window.sessionStorage.getItem('token');
  console.log(TokenStr);
  if(!TokenStr) return next('login');

  // 有token直接方行
  next();
})

export default router
