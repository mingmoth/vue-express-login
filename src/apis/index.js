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

export const logoutUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/auth/logout', payload)
        console.log('response', response)
        window.localStorage.removeItem('user')
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getPasskeyCredentialOptions = async (username) => {
    try {
        const response = await axiosInstance.post('/auth/registerRequest', {
            username: username,
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
        const response = await axiosInstance.post('/auth/registerResponse', {...credentials})
        console.log('response', response)
    } catch (error) {
        console.error(error)
    }
}