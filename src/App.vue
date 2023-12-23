<script setup>
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const activeIndex = ref('/frontPage')
const notShowLayoutList = [
  '/login',
  '/register',
  '/forgetPassword',
  '/admin',
  '/admin/userManagement',
  '/admin/postManagement',
  '/admin/newsManagement',
  '/admin/reportManagement'
]
// eslint-disable-next-line no-unused-vars
const handleSelect = (key, keyPath) => {
  //console.log(key, keyPath)
}

const showLayout = ref(false)
const route = useRoute()
const user = ref()
user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
watch(
  () => route.path,
  (val) => {
    user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
    if (notShowLayoutList.includes(val)) {
      showLayout.value = false
    } else {
      showLayout.value = true
    }
    activeIndex.value = val
  }
)

const router = useRouter()
function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}

import { useSearchStore } from './stores/search'
const searchStore = useSearchStore()
const types = searchStore.types

const searchType = ref('Post')
const searchKeyword = ref('')

function handleSearch() {
  router.push({ path: '/search', query: { type: searchType.value, keyword: searchKeyword.value } })
}
</script>

<template>
  <div class="h-screen">
    <el-affix>
      <el-menu
        v-if="showLayout"
        :router="true"
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        :ellipsis="false"
        menu-trigger="hover"
      >
        <!-- <el-menu-item index="/login">Login</el-menu-item>
        <el-menu-item index="/register">Register</el-menu-item> -->
        <el-menu-item index="/frontPage">Front Page</el-menu-item>
        <el-menu-item index="/news">News</el-menu-item>
        <div class="flex-grow"></div>
        <div class="flex h-10 my-auto">
          <el-form :inline="true" size="large">
            <el-form-item>
              <el-select v-model="searchType" placeholder="">
                <el-option
                  v-for="type in types"
                  :key="type.value"
                  :label="type.value"
                  :value="type.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 500px">
              <el-input
                v-model="searchKeyword"
                placeholder="Search"
                prefix-icon="Search"
                clearable
                @clear="search = ''"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch"> Search </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-menu-item index="/admin" v-if="user.role == 'admin'">Admin</el-menu-item>
        <el-sub-menu index="0">
          <template #title>
            <el-avatar size="default" class="mx-3" :src="user.avatarUrl"></el-avatar>
            {{ user.name }}
          </template>
          <el-menu-item index="/myProfile">My Profile</el-menu-item>
          <el-menu-item index="/changePassword">My Account</el-menu-item>
          <el-menu-item @click="logout">Logout</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-affix>
    <RouterView />
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<style>
body {
  background-color: #f5f5f5;
}
</style>
