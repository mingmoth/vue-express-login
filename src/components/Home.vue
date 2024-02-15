<script setup>
import { computed } from 'vue'
// import { getPasskeyCredentialOptions, registerCredential } from '../apis'
// import { createRegisterCredential } from '../libs/passkeys'

// const isSupportCreatePasskey = computed(() => window.PublicKeyCredential &&
//     PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
//     PublicKeyCredential.isConditionalMediationAvailable
// )

// async function checkBrowserSupportCreatePasskey() {
//     try {
//         const results = await Promise.all([
//             // Is platform authenticator available in this browser?
//             PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
//             // Is conditional UI available in this browser?
//             PublicKeyCredential.isConditionalMediationAvailable()
//         ])
//         if(results.every(Boolean)) {
//             await createPasskey()
//         } else {
//             throw new Error
//         }
//     } catch (error) {
//         console.error('This device does not support creating passkeys', error)
//     }
// }

// async function createPasskey() {
//     console.log('Start create passkey')
//     try {
//         const options = await getPasskeyCredentialOptions()
//         console.log('options', options)

//         const credentials = await createRegisterCredential(options)

//         // Send the result to the server and return the promise.
//         const createResult = await registerCredential(credentials)
//         console.log('createResult', createResult)
//         return createResult

//     } catch (error) {
//         console.error('Fail to create passkey', error)
//     }
// }
</script>

<template>
    <h1>Home</h1>
    <!-- <button
        :disabled="!isSupportCreatePasskey"
        @click.prevent="checkBrowserSupportCreatePasskey"
    >
        Create Passkeys
    </button> -->
</template>