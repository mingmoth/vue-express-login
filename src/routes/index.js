import { createRouter, createWebHashHistory } from 'vue-router';

import Login from '../components/Login.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../components/Register.vue'),
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../components/Home.vue'),
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})