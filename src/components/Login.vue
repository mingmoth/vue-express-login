<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { loginUser, signinRequest, signinResponse } from '../apis'
import { authenticateWithPasskey } from '../libs/passkeys'

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
        window.localStorage.setItem('user', JSON.stringify(data))
        router.push('/home')
    } catch (error) {
        console.error(error)
        alert('Login failed', error)
    }
}

const isSupportInitPasskeyLogin = computed(() => window.PublicKeyCredential &&
    PublicKeyCredential.isConditionalMediationAvailable
)

async function initPasskeyLogin() {
    if(!isSupportInitPasskeyLogin.value) return
    try {
        const cma = await PublicKeyCredential.isConditionalMediationAvailable();
        console.log('cma', cma)
        if(cma) {
            const options = await signinRequest()
            const credential = await authenticateWithPasskey(options)
            console.log('credential', credential)
            const response = await signinResponse(credential)
            console.log('response', response)

            const { status, message, data } = response
            if(status !== 'ok') {
                throw new Error(message)
            }
            const { token } = data
            if(!token) {
                throw new Error('Get token failed')
            }
            window.localStorage.setItem('user', JSON.stringify(data))
            router.push('/home')
        }
    } catch (error) {
        console.error(error)
    }
}

</script>

<template>
    <h1>Login</h1>
    <UserForm @submit="goLogin"/>
    <button @click.prevent="initPasskeyLogin">Login with Passkeys</button>
    <p> Have no account yet? go
        <router-link to="/register">
            Register
        </router-link>
    </p>
</template>