import Vue from 'vue'
import VueRouter from 'vue-router'
import PageContainer from "@/components/PageContainer.vue"
import LogIn from '@/views/LogIn.vue';
import Home from "@/views/Home.vue"
import Show from "@/views/Show.vue"
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
        name: 'main',
        component: PageContainer,
        children: [
            {
                path: '/home',
                name: 'home',
                component: Home
            },
            {
                path: '/show',
                name: 'show',
                component: Show
            },
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
})

export default router
