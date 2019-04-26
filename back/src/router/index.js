import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Index from '@/components/index'
import Welcome from '@/components/welcome'
import Users from '@/components/users'

Vue.use(Router)

var router = new Router({
  routes: [
    {path: '/login', component: Login},
    {
      path: '/index',
      component: Index,
      children: [
        {path: '/', redirect: '/welcome'},
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
