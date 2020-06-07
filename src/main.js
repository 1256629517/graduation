import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import 'social-share.js/dist/css/share.min.css'
import 'social-share.js/dist/js/social-share.min.js'
import './assets/iconfont/iconfont.css'
import slideVerify from 'vue-monoplasty-slide-verify'
import './permission'
import store from  './vuex'

Vue.config.productionTip = false

Vue.prototype.axios = axios;
// let baseUrl = state.baseUrl;
Vue.use(ElementUI)
Vue.use(slideVerify);

// axios.interceptors.request.use(config => {
//   // 头部拦截
//   config.url = baseUrl.api + config.url;
//   return config;
// }, err=>{
//   return Promise.reject(err);
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
