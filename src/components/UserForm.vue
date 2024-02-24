<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const username = ref('')
const password = ref('')

const submit = () => {
    emit('submit', { username: username.value, password: password.value })
}

</script>

<template>
    <form action="" class="login-form">
        <input type="text" id="login" aria-labelledby="username-label" autocomplete="username webauthn" autofocus
            v-model="username" placeholder="username" class="login-input">
        <input type="password" id="password" v-model="password" placeholder="password" class="login-input">
        <button @click.prevent="submit">Go</button>
    </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
}

.login-label {
  font-size: 1.5em;
}

.login-input {
  padding: 12px;
  border-radius: 8px;
}
</style>
