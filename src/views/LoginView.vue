<template>
  <div class="bg-sky-500 h-screen flex justify-center items-center">
    <div class="flex w-1/2 bg-white rounded-md overflow-hidden">
      <div class="flex-1">
        <img src="../assets/login.png" style="width: 100%" />
      </div>
      <div class="flex-1 flex items-center justify-center">
        <el-form :model="user" :rules="rules" ref="myForm" class="w-10/12">
          <h1 class="text-lg font-bold text-center mb-4">Login</h1>
          <el-form-item prop="username">
            <el-input
              prefix-icon="user"
              size="default"
              v-model="user.username"
              placeholder="Please enter your username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="lock"
              size="default"
              show-password
              v-model="user.password"
              placeholder="Please enter your password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login">Login</el-button>
          </el-form-item>
          <div class="flex">
            <div style="color: #409eff; cursor: pointer" class="flex-1">Forgotten password?</div>
            <div style="color: #409eff; cursor: pointer" class="flex-1 text-right">
              Create account
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
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
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
