import axios from "axios";
import router from "../router";
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: 'http://localhost:8080', //interface to backend
    timeout: 30000
})

request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    let user = JSON.parse(localStorage.getItem('user') || '{}')
    config.headers['token'] = user.token

    return config
}, error => {
    console.log('request error: ' + error) // for error debug
    return Promise.reject(error)
})

request.interceptors.response.use(response => {
    //  res.code
    let res = response.data
    
    if(res.code === '401') {
        router.push('/login')
        ElMessage.error('Please login')
    }

    return res
}, error => {
    console.log('response error: ' + error) // for error debug
    return Promise.reject(error)
})

export default request
