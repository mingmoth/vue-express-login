<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPasskeyCredentialOptions, registerCredential, logoutUser } from '../apis'
import { createRegisterCredential } from '../libs/passkeys'

const router = useRouter()

const user = JSON.parse(localStorage.getItem('user'))

async function logout() {
    try {
        const response = await logoutUser()
        const { status, message } = response
        if(status !== 'ok') {
            throw new Error(message)
        }
        router.push('/')
    } catch (error) {
        console.error(error)
    }
}

const isSupportCreatePasskey = computed(() => window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    PublicKeyCredential.isConditionalMediationAvailable
)

async function checkBrowserSupportCreatePasskey() {
    try {
        const results = await Promise.all([
            // Is platform authenticator available in this browser?
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
            // Is conditional UI available in this browser?
            PublicKeyCredential.isConditionalMediationAvailable()
        ])
        if(results.every(Boolean)) {
            await createPasskey()
        } else {
            throw new Error
        }
    } catch (error) {
        console.error('This device does not support creating passkeys', error)
    }
}

async function createPasskey() {
    console.log('Start create passkey')
    try {
        const { data } = await getPasskeyCredentialOptions(user)
        console.log('data', data)

        const credentials = await createRegisterCredential(data)

        // // Send the result to the server and return the promise.
        const createResult = await registerCredential({
            credentials,
            username: user?.username,
            id: user?.id
        })
        console.log('createResult', createResult)
        return createResult

    } catch (error) {
        console.error('Fail to create passkey', error)
    }
}
</script>

<template>
    <h1>Home</h1>
    <button
        :disabled="!isSupportCreatePasskey"
        @click.prevent="checkBrowserSupportCreatePasskey"
    >
        Create Passkeys
    </button>
    <button @click.prevent="logout">Logout</button>
</template>