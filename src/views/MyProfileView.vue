<template>
  <div class=" w-8/12 mx-auto mt-2">
    <el-card class=" mx-auto">
      <div class=" mx-auto flex justify-center">
        <div class=" mx-auto self-center">
          <el-upload action="http://localhost:8080/file/upload" :headers="{ token: localUser.token }"
            :showFileList=false :on-success="handleAvatarUploadSuccess" v-if="checkEdit == true">
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-avatar :size="150" :src="formUser.avatarUrl" v-else></el-avatar>
        </div>
        <el-form :model="formUser" label-position="top" class=" w-8/12">
          <el-form-item label="Name:" size="large" prop="name">
            <el-input v-model="formUser.name" v-if="checkEdit == true"></el-input>
            <div v-else>{{ formUser.name }}</div>
          </el-form-item>
          <el-form-item label="Self introduction:" prop="description">
            <el-input v-model="formUser.description" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="Introduce yourself..." v-if="checkEdit == true"></el-input>
            <div v-else-if="formUser.description == null" class=" ">The person has not introduced
              himself/herself...
            </div>
            <el-text v-else class=" text-lg">{{ formUser.description }}</el-text>
          </el-form-item>
        </el-form>
        <div class=" mx-auto">
          <div v-if="checkEdit == false" class=" h-full flex">
            <el-button class=" my-auto" type="primary" @click="checkEdit = true" icon="Edit">Edit</el-button>
          </div>
          <div v-else class=" h-full flex flex-col items-center ">
            <div class=" my-auto"><el-button type="primary" @click="submitEdit" icon="check">Confirm</el-button></div>
            <div class=" my-auto"><el-button type="danger" @click="cancelEdit" icon="close">Cancel</el-button></div>
          </div>
        </div>
      </div>
    </el-card>
    <el-row>
      <el-col :span="16">
        <my-profile-post-list-component />
      </el-col>
      <el-col :span="8">
        <div class=" ml-2">
          <FriendListComponent/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
    
<script setup>
import { ref } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import MyProfilePostListComponent from '../components/Profile/MyProfilePostListComponent.vue';
import FriendListComponent from '../components/FriendListComponent.vue'

const localUser = ref()
localUser.value = JSON.parse(localStorage.getItem('user'))

const formUser = ref()
formUser.value = JSON.parse(localStorage.getItem('user'))

const checkEdit = ref(false)
function submitEdit() {
  if (checkEdit.value) {
    request.post('/updateUser', formUser.value).then(res => {
      if (res.code === '200') {
        formUser.value = res.data
        localUser.value = res.data
        console.log(res.data)
        localStorage.setItem('user', JSON.stringify(localUser.value))
        ElMessage.success('Update successfully')
        window.location.reload()
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  checkEdit.value = !checkEdit.value
}

function cancelEdit() {
  formUser.value.name = localUser.value.name
  formUser.value.description = localUser.value.description
  checkEdit.value = false
}

// eslint-disable-next-line no-unused-vars
const handleAvatarUploadSuccess = (response, file, fileList) => {
  formUser.value.avatarUrl = response.data;
  localUser.value.avatarUrl = response.data;
  localStorage.setItem('user', JSON.stringify(localUser.value))
};
</script>
    
<style scoped>
:deep().el-form-item__label {
  font-weight: bold;
  color: black;
}
:deep().el-input {
  width: 200px;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
}
</style>