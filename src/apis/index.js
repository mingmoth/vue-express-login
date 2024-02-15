import axiosInstance from "./axios";

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/auth/register', payload)
        console.log('response', response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/auth/login', payload)
        console.log('response', response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getPasskeyCredentialOptions = async () => {
    try {
        const response = await axiosInstance.post('/registerRequest', {
            username: 'mingmoth'
        })
        console.log('response', response)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const registerCredential = async (credentials) => {
    console.log('credentials', credentials)
    try {
        const response = await axiosInstance.post('/registerResponse', {...credentials})
        console.log('response', response)
    } catch (error) {
        console.error(error)
    }
}