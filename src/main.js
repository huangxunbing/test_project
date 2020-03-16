import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 富文本插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import 'nprogress/nprogress.css'


Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 定义全局过滤器
// Vue.filter('dateFliter', function (originVal) {
//  const dt =  new Date(originVal)
//   const y = dt.getFullYear()
//   const m = (dt.getFullYear() + 1).padStart(2, '0')
//   const d = (dt.getDate() + '').padStart(2, '0')

//   const hh = (dt.getHours() + '').padStart(2, '0')
//   const mm = (dt.getMinutes() + '').padStart(2, '0')
//   const ss = (dt.getSeconds() + '').padStart(2, '0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
