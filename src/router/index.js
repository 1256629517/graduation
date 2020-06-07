import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: resolve => require(["../pages/homePage.vue"], resolve),
    },
    {
      path: '/login',
      name: '登录',
      component: resolve => require(["../pages/Login/login.vue"], resolve),
    },
    {
      path: '/register',
      name: '注册',
      component: resolve => require(["../pages/Login/register.vue"], resolve),
    },
    {
      path: '/findPassword',
      name: '找回密码',
      component: resolve => require(["../pages/Login/findPassword.vue"], resolve),
    },
    {
      path: '/homePage',
      name: '首页',
      component:  resolve => require(["../pages/homePage.vue"], resolve),
      children: [
        {
          path: '/',
          name: '首页',
          component: resolve => require(["../pages/FirstPage/firstPage.vue"], resolve),
        },
        {
          path: '/firstPage',
          name: '首页',
          component: resolve => require(["../pages/FirstPage/firstPage.vue"], resolve),
        },
        {
          path: '/order',
          name: '订单',
          component: resolve => require(["../pages/Order/order.vue"], resolve),
          meta: {
            requireAuth: true,
          }
        },
        {
          path: '/user',
          name: '用户',
          component:  resolve => require(["../pages/user/user.vue"], resolve),
          meta: {
            requireAuth: true,
          }
        },
      ]
    },
    {
      path: '/shopDetails',
      name: '商品详情',
      component:  resolve => require(["../pages/ShopDetails/shopDetails.vue"], resolve),
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/submitOrder',
      name: '订单详情',
      component:  resolve => require(["../pages/SubmitOrder/submitOrder.vue"], resolve),
      meta: {
        requireAuth: true,
      }
    },
  ]
})
