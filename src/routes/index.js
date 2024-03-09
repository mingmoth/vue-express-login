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

router.beforeEach((to, from, next) => {
    if(to.name === 'Home' && !localStorage.getItem('user')) {
        return next({ name: 'Login' })
    } else if ((to.name === 'Login' || to.name === 'Register') && localStorage.getItem('user')) {
        return next({ name: 'Home'})
    }
    next()
})