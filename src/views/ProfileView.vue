<template>
    <br />
    <div class=" w-8/12 mx-auto">
        <el-card class=" mx-auto">
            <div class=" mx-auto flex justify-center">
                <div class=" mx-auto">
                    <el-avatar :size="150" :src="formUser.avatarUrl"></el-avatar>
                </div>
                <el-form :model="formUser" label-position="top" class=" w-8/12">
                    <el-form-item label="Name:" size="large" prop="name">
                        <div>{{ formUser.name }}</div>
                    </el-form-item>
                    <el-form-item label="Self introduction:" prop="description">
                        <div v-if="formUser.description == null" class=" ">The person has not introduced
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
                        <div class=" my-auto"><el-button type="primary" @click="submitEdit" icon="check">Confirm</el-button>
                        </div>
                        <div class=" my-auto"><el-button type="danger" @click="cancelEdit" icon="close">Cancel</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-row>
            <el-col :span="16">
                <post-list-component />
            </el-col>
            <el-col :span="8">
                <friendlist-component />
            </el-col>
        </el-row>
    </div>
</template>
      
<script setup>
import { ref } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import PostListComponent from '../components/Post/PostListComponent.vue'
import FriendlistComponent from '../components/Profile/FriendListComponent.vue'

</script>
      
<style scoped>
:deep().el-form-item__label {
    font-weight: bold;
    color: black;
}

:deep().el-input {
    width: 200px;
}</style>