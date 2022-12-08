import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'
// import loading from '@/utils/loading'
import router from '@/router'

const http = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
})

let load
http.interceptors.request.use(config => {

    //有token就上token
    if (localStorage.getItem('token') !== null) {
        config.headers.authorization = localStorage.getItem('token')
    }

    //开始loading
    if (config.loading !== undefined) {
        load = loading.start()
    }

    return Promise.resolve(config)
}, error => {
    //console.log(error)
    ElMessage.error('网络异常')
    return Promise.reject(error)
})

http.interceptors.response.use(response => {
    if (load !== undefined) {
        load.close()
    }
    return Promise.resolve(response)
}, error => {
    if (load !== undefined) {
        load.close()
    }

    if (error.response.status === 401) {
        //状态失效
        localStorage.setItem('token', null)
        localStorage.setItem('username', null)
        setTimeout(() => {
            router.push({name: 'login'}).then(r => ElMessage.error('您的登陆状态已失效，请重新登陆'))
        }, 800)
    }

    return Promise.reject(error)
})

export default http