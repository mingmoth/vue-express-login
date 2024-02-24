<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { loginUser } from '../apis'

const router = useRouter()

const goLogin = async ({ username, password }) => {
    if(!username || !password) {
        alert('Please enter username and password')
        return
    }
    try {
        const response = await loginUser({
            username,
            password
        })
        const { status, message, data } = response
        if(status !== 'ok') {
            throw new Error(message)
        }
        const { token } = data
        if(!token) {
            throw new Error('Get token failed')
        }
        window.localStorage.setItem('token', token)
        router.push('/home')
    } catch (error) {
        console.error(error)
        alert('Login failed', error)
    }
}

</script>

<template>
    <h1>Login</h1>
    <UserForm @submit="goLogin"/>
    <p> Have no account yet? go
        <router-link to="/register">
            Register
        </router-link>
    </p>
</template>