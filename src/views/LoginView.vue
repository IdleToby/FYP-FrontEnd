<template>
  <div class=" h-screen flex justify-center items-center" style="background-color: #409eff;">
    <div class="flex w-1/2 bg-white rounded-md overflow-hidden">
      <div class="flex-1">
        <img src="../assets/login.png" style="width: 100%" />
      </div>
      <div class="flex-1 flex items-center justify-center">
        <el-form :model="user" :rules="rules" ref="myForm" class="w-10/12">
          <h1 class="text-lg font-bold text-center mb-4">Welcome to platform</h1>
          <el-form-item prop="username">
            <el-input
              prefix-icon="user"
              size="default"
              v-model="user.username"
              placeholder="Username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="lock"
              size="default"
              show-password
              v-model="user.password"
              placeholder="Password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login">Login</el-button>
          </el-form-item>
          <div class="flex">
            <div class="flex-1">
              <span style="color: #409eff; cursor: pointer" @click="$router.push('/forgetPassword')">
                Forgotten password?
              </span>
            </div>
            <div class="flex-1 text-right">
              <span style="color: #409eff; cursor: pointer"  @click="$router.push('/register')">
                Create account
              </span>
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
  password: ''
})

const rules = ref({
  username: [{ required: true, message: 'Username should not be empty', trigger: 'blur' }],
  password: [{ required: true, message: 'Password should not be empty', trigger: 'blur' }]
})

const myForm = ref(null)

function login() {
  myForm.value.validate((valid) => {
    if (valid) {
      request.post('/login', user.value).then((res) => {
        if (res.code === '200') {
          //localStorage.setItem("token", res.token)
          localStorage.setItem('user', JSON.stringify(res.data))
          router.push({ path: '/test' })
          ElMessage.success('Login successful')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
</script>

<style></style>
