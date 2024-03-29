import axios from 'axios';

const baseUrl = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: baseUrl
})

axiosInstance.interceptors.request.use(
    config => {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if(user) {
            config.headers.Authorization = `Bearer ${ user.token }`
        }
        return config
    },
    err => Promise(reject(err))
)

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('response', response)
        const { data, status, statusText } = response
        if(status === 200) {
            return Promise.resolve(data)
        } else {
            return Promise.reject(statusText)
        }
    },
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
    )

export default axiosInstance