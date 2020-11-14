import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

import axios from 'axios';
//设置axios请求头加入token
axios.interceptors.request.use(config => {
    if (config.push === '/') {
    } else {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }
    }
    return config;
},
    error => {
        console.log("axios.interceptors.request", error)
    });
