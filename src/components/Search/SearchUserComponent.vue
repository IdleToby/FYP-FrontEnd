<template>
  <!-- Friend List -->
  <div class="mt-3" v-if="showFriendList">
    <el-scrollbar height="800px">
      <el-card>
        <div v-for="friend in friendList" :key="friend.friendId">
          <div class="flex items-center border-b mt-4 pb-2">
            <el-avatar :src="friend.avatarUrl" size="default"></el-avatar>
            <span class="ml-2"
              ><el-text>{{ friend.name }}</el-text></span
            >
            <div class="flex-grow"></div>
            <div>
              <el-button type="primary" size="default" @click="handleClick(friend)" link
                >View</el-button
              >
            </div>
          </div>
        </div>
      </el-card>
    </el-scrollbar>
  </div>
  <div class="mt-3" v-else>
    <el-card>
      <el-empty
        description="You haven't added any friends yet. Go find like-minded people!"
        image="src\assets\friend_list_empty.png"
      ></el-empty>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import request from '../../utils/request'
import { useRouter } from 'vue-router'

const props = defineProps({
  keyword: {
    type: String,
    required: true
  }
})

onMounted(() => {
  nextTick(() => {
    fetchData()
  })
})

const friendList = ref([
  // {
  //     friendId: 1,
  //     name: 'John Doe',
  //     avatarUrl: 'test.jpg'
  // }
])

const localUser = JSON.parse(localStorage.getItem('user'))
const showFriendList = ref(false)

const router = useRouter()
function handleClick(friend) {
  router.push({ path: '/profile/' + friend.friendId })
}

function fetchData(){
  request
    .get('/search/user', {
      params: {
        keyword: props.keyword,
      }
    })
    .then((res) => {
      if (res.data.length > 0) {
        showFriendList.value = true
        friendList.value = res.data
      }
    })
}
</script>
<style></style>
