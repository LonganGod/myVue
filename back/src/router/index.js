import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Index from '@/components/index'
import Welcome from '@/components/welcome'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import Categories from '@/components/categories'
import Params from '@/components/params'
import Goods from '@/components/goods'
import AddGoods from '@/components/addGoods'

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
        {path: '/users', component: Users},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/categories', component: Categories},
        {path: '/params', component: Params},
        {path: '/goods', component: Goods},
        {path: '/addGoods', component: AddGoods}
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
