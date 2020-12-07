import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

import admin from "../views/admin"
import adminWelcome from "../components/adminWelcome"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
  },
  {
    path: '/adminHome',
    component: admin,
    redirect: '/adminWelcome',
    children:[
      {path: '/adminWelcome', component: adminWelcome}
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
