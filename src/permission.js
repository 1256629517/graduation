import router from './router'
import store from './vuex'

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.userName == '') {
      console.log("未登录")
      next('/login')
    } else {
      console.log("已登录")
      next()
    }
  } else {
    next()
  }
})
