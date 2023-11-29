<template>
    <el-card class=" w-1/4 mx-auto mt-2">
        <div class=" flex justify-center">
            <el-form :model="changePasswordUser" :rules="rules" ref="changePasswordForm" class="w-3/4 mt-2 mb-2">
                <h1 class="text-lg font-bold text-center mb-4">Change My Password</h1>
                <el-form-item prop="oldPassword">
                    <el-input prefix-icon="lock" size="default" show-password v-model="changePasswordUser.oldPassword"
                        placeholder="old password"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword">
                    <el-input prefix-icon="lock" size="default" show-password v-model="changePasswordUser.newPassword"
                        placeholder="new password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input prefix-icon="lock" size="default" show-password v-model="changePasswordUser.confirmPassword"
                        placeholder="confirm new password">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="changePassword">Reset
                        Password</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'
import router from '../router'

onMounted(() => {
    changePasswordUser.value.userId = JSON.parse(localStorage.getItem('user')).userId
})

const changePasswordUser = ref({
    userId: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const rules = ref({
    oldPassword: [
        { required: true, message: 'Please enter your old password', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: 'Please enter your new password', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: 'Please enter your new password again', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
    ]
})

function validatePass(rule, value, callback) {
    if ((changePasswordUser.value.newPassword !== changePasswordUser.value.confirmPassword) && changePasswordUser.value.confirmPassword !== '') {
        callback(new Error('The two passwords you entered did not match!'))
    } else {
        callback()
    }
}

const changePasswordForm = ref(null)

function changePassword() {
    changePasswordForm.value.validate((valid) => {
        if (valid) {
            request.post('/user/changePassword', changePasswordUser.value).then(res => {
                if (res.code === '200') {
                    ElMessage.success('Password changed successfully, please log in again')
                    localStorage.removeItem('user')
                    router.push('/login')
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}
</script>
  
<style></style>
  