<script setup>
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';


const activeIndex = ref('/frontPage')
const notShowLayoutList = ['/login', '/register']
// eslint-disable-next-line no-unused-vars
const handleSelect = (key, keyPath) => {
  //console.log(key, keyPath)
}

const showLayout = ref(false)
const route = useRoute()
const user = ref()
user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
watch(() => route.path, (val) => {
  user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
  if (notShowLayoutList.includes(val)) {
    showLayout.value = false
  } else {
    showLayout.value = true
  }
  activeIndex.value = val
})

const router = useRouter()
function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}

</script>

<template>
  <div class=" h-screen">
    <el-menu v-if="showLayout" :router="true" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
    @select="handleSelect" :ellipsis="false" menu-trigger="hover">
    <el-menu-item index="/login">Login</el-menu-item>
    <el-menu-item index="/register">Register</el-menu-item>
    <el-menu-item index="/frontPage">Front Page</el-menu-item>
    <div class=" flex-grow"></div>
    <el-sub-menu index="0">
      <template #title>
        <el-avatar size="default" class=" mx-3" :src="user.avatarUrl"></el-avatar>
        {{ user.name }}
      </template>
      <el-menu-item index="/myProfile">Profile</el-menu-item>
      <el-menu-item @click="logout">Logout</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <RouterView />
  </div>
</template>

<style>
body {
  background-color: #f5f5f5;
}
</style>
