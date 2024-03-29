<template>
  <div class="w-8/12 mx-auto mt-2">
    <el-card class="mx-auto">
      <div class="mx-auto flex justify-center">
        <div class="mx-auto">
          <el-avatar :size="150" :src="formUser.avatarUrl"></el-avatar>
        </div>
        <el-form :model="formUser" label-position="top" class="w-8/12">
          <el-form-item label="Name:" size="large" prop="name">
            <div>{{ formUser.name }}</div>
          </el-form-item>
          <el-form-item label="Self introduction:" prop="description">
            <div v-if="formUser.description == null" class=" ">
              The person has not introduced himself/herself...
            </div>
            <el-text v-else class="text-lg">{{ formUser.description }}</el-text>
          </el-form-item>
        </el-form>
        <div class="mx-auto">
          <div class="h-full hidden">
            <el-button class="my-auto" type="primary" @click="checkEdit = true" icon="Edit"
              >Edit</el-button
            >
          </div>
        </div>
      </div>
    </el-card>
    <el-row>
      <el-col :span="16">
        <ProfilePostListComponent />
      </el-col>
      <el-col :span="8">
        <div class="ml-2 mt-3">
          <el-card>
            <el-button
              type="primary"
              @click="handleClick"
              :plain="showAdd"
              size="large"
              class="w-full"
              :disabled="showAdd"
              >{{ buttonText }}</el-button
            >
          </el-card>
          <el-card v-if="showAdd" class=" mt-2">
            <el-button
              type="danger"
              @click="deleteFriend"
              size="large"
              class="w-full"
              >Remove from friendlist</el-button
            >
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import request from '../utils/request'
import ProfilePostListComponent from '../components/Profile/ProfilePostListComponent.vue'
import { useRoute } from 'vue-router'
import router from '../router'
import { ElMessage } from 'element-plus'

const formUser = ref({})
const checkEdit = ref(false)

const route = useRoute()
const userId = ref(route.params.userId)

function fetchUserInfo() {
  request
    .get('/user/getUserById', {
      params: {
        userId: userId.value
      }
    })
    .then((res) => {
      formUser.value = res.data
    })
}

const localUser = JSON.parse(localStorage.getItem('user'))
watch(
  userId,
  () => {
    if (userId.value == localUser.userId) {
      router.replace({ path: '/myProfile' })
    }
  },
  { immediate: true }
)

onMounted(() => {
  fetchUserInfo()
  handleInit()
})

const showAdd = ref(false)
function handleClick() {
  request
    .post('/friendship/addFriend', {
      user1Id: localUser.userId,
      user2Id: userId.value
    })
    .then((res) => {
      if (res.code === '200') {
        showAdd.value = false
        ElMessage.success('Add friend successfully')
        nextTick(() => {
          window.location.reload()
        })
      } else {
        ElMessage.error(res.message)
      }
    })
}

function handleInit() {
  request
    .get('/friendship/checkFriend', {
      params: {
        user1Id: localUser.userId,
        user2Id: userId.value
      }
    })
    .then((res) => {
      if (res) {
        showAdd.value = true
        buttonText.value = 'Already Added'
      } else {
        showAdd.value = false
      }
    })
}

const buttonText = ref('Add friend')

function deleteFriend() {
  request
    .post('/friendship/deleteFriend', {
      user1Id: localUser.userId,
      user2Id: userId.value
    })
    .then((res) => {
      if (res.code === '200') {
        showAdd.value = false
        ElMessage.success('Delete friend successfully')
        nextTick(() => {
          window.location.reload()
        })
      } else {
        ElMessage.error(res.message)
      }
    })
}
</script>

<style scoped>
:deep().el-form-item__label {
  font-weight: bold;
  color: black;
}

:deep().el-input {
  width: 200px;
}
</style>
