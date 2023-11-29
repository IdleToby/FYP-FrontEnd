<template>
    <div class="h-screen flex justify-center items-center" style="background-color: #626aef">
        <div class="flex w-1/4 bg-white rounded-md overflow-hidden">
            <div class="flex-1 flex items-center justify-center">
                <el-form :model="user" :rules="rules" ref="registerForm" class="w-3/4 mt-2 mb-2">
                    <h1 class="text-lg font-bold text-center mb-4">Reset Your Password</h1>
                    <el-form-item prop="email">
                        <el-input prefix-icon="message" size="default" v-model="user.email"
                            placeholder="Please enter your email address"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="lock" size="default" show-password v-model="user.password"
                            placeholder="Please enter your new password"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="flex w-full">
                            <div class="flex-2">
                                <el-input prefix-icon="ChatLineRound" size="default" v-model="user.code"
                                    placeholder="Verification code"></el-input>
                            </div>
                            <div class="flex flex-1 items-center">
                                <el-button color="#626aef" type="primary" class="ml-auto" :disabled="countdown > 0"
                                    @click="sendVerificationCode">
                                    {{ countdown > 0 ? `${countdown} seconds` : 'Send code' }}
                                </el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button color="#626aef" type="primary" style="width: 100%" @click="changePassword">Reset
                            Password</el-button>
                    </el-form-item>
                    <div class="flex">
                        <div class="flex-1"></div>
                        <div class="flex-1 text-right">
                            <span style="color: #626aef; cursor: pointer" @click="router.push('/login')">Back to
                                login</span>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'
import router from '../router'

const user = ref({
    username: '',
    password: '',
    email: '',
    code: ''
})

const rules = ref({
    password: [{ required: true, message: 'Password cannot be empty', trigger: 'blur' }],
    email: [{ required: true, message: 'Email cannot be empty', trigger: 'blur' },
    {
        type: 'email',
        message: 'Invalid email format',
        trigger: ['blur', 'blur']
    },
    {
        validator: validateEmailSuffix, // 自定义验证函数，检查邮箱后缀
        trigger: 'blur'
    }],
})

function validateEmailSuffix(rule, value, callback) {
    if (value && value.endsWith('xmu.edu.my')) {
        callback()
    } else {
        // callback()
        callback(new Error('Email suffix must be xmu.edu.my'))// 验证失败
    }
}

const registerForm = ref(null)

const countdown = ref(0) // 添加倒计时变量

const sendVerificationCode = () => {
    registerForm.value.validate((valid) => {
        if (valid) {
            //检查邮箱是否存在
            request.post('/user/checkEmail', user.value).then((res) => {
                if (res.code !== '200') {
                    ElMessage.error(res.msg)
                    countdown.value = 0
                    return
                } else {
                    //发送邮件
                    request.post('/user/sendVerificationCode', user.value).then((res) => {
                        if (res.code === '200') {
                            ElMessage.success('Verification code has been sent to your email')
                            localStorage.setItem('forgetCode', JSON.stringify(res.data))
                        } else {
                            ElMessage.error(res.msg)
                        }
                    })
                }
            })

            // 防止连续点击
            if (countdown.value > 0) {
                return
            }

            countdown.value = 30 // 设置倒计时初始值

            // 创建一个定时器来每秒减少倒计时
            const timer = setInterval(() => {
                if (countdown.value > 0) {
                    countdown.value--
                } else {
                    clearInterval(timer) // 倒计时结束后清除定时器
                }
            }, 1000)


        }
    })
}

function changePassword() {
    registerForm.value.validate((valid) => {
        if (valid) {
            if (user.value.code != JSON.parse(localStorage.getItem('forgetCode'))) {
                ElMessage.error('Verification code is wrong')
                return
            }
            request.post('/user/resetPassword', user.value).then((res) => {
                if (res.code === '200') {
                    router.push({ path: '/login' })
                    ElMessage.success('Reset password successfully')
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}
</script>
  
<style></style>
  