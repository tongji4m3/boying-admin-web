import Vue from 'vue'
import VueRouter from 'vue-router'
import PageContainer from "@/components/PageContainer.vue"
import LogIn from '@/views/LogIn.vue';
import Home from "@/views/Home.vue"
import Show from "@/views/Show.vue"
import Category from "@/views/Category.vue"
import AddShow from "@/views/AddShow.vue"
import Order from "@/views/Order.vue"
import Admin from "@/views/Admin.vue"
import UpdateShow from "@/views/UpdateShow.vue"
import Role from "@/views/Role.vue"
import Resource from "@/views/Resource.vue"
import Menu from "@/views/Menu.vue"
import AddPromo from "@/views/AddPromo.vue"
import Promo from "@/views/Promo.vue"
import ResourceCategory from "@/views/ResourceCategory.vue"
import History from "@/views/History.vue"
import User from "@/views/User.vue"
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '#',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: LogIn
    },
    {
        path: '/main',
        name: '首页',
        component: PageContainer,
        children: [
            {
                path: '/home',
                name: '首页',
                component: Home
            },
            {
                path: '/showList',
                name: '演出',
                component: Show
            },
            {
                path: '/category',
                name: '演出目录',
                component: Category
            },
            {
                path: '/addshow',
                name: "添加演出",
                component: AddShow
            },
            {
                path: '/orderList',
                name: '订单列表',
                component: Order
            },
            
            {
                path: '/history',
                name: '订单历史',
                component: History
            },
            {
                path: '/admin',
                name: '账号列表',
                component: Admin
            }, {
                path: '/UpdateShow',
                name: '修改演出',
                component: UpdateShow

            }, {
                path: '/Role',
                name: '角色管理',
                component: Role

            },
            {
                path: '/Resource',
                name: '资源管理',
                component: Resource
            }
            ,
            {
                path: '/Menu',
                name: '菜单管理',
                component: Menu
            }
            ,
            {
                path: '/PromoList',
                name: '活动列表',
                component: Promo
            }
            ,
            {
                path: '/AddPromo',
                name: '添加活动',
                component: AddPromo
            }
            ,
            {
                path: '/ResourceCategory',
                name: '资源目录',
                component: ResourceCategory
            },
            {
                path: '/User',
                name: '用户列表',
                component: User
            }
        ]
    },

    //   {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    //   }
]

const router = new VueRouter({
    routes
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        window.sessionStorage.clear();
        return next();
    }
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    //无token强制跳转到登录页面
    if (!tokenStr) return next('/login');
    next();
})

export default router
