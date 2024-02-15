<script setup>
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { registerUser } from '../apis'

const router = useRouter()

const goRegister = async ({ username, password }) => {
    if(!username || !password) {
        alert('Please enter username and password')
        return
    }
    try {
        const response = await registerUser({
            username,
            password
        })
        const { status, message } = response
        if(status !== 'ok') {
            throw new Error(message)
        }
        router.push('/')
    } catch (error) {
        console.error(error)
        alert('Register failed', error)
    }
}
</script>

<template>
    <h1>Register</h1>
    <UserForm @submit="goRegister"/>
    <p> Already have a account! go
        <router-link to="/">
            Login
        </router-link>
    </p>
</template>