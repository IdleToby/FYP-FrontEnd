<template>
  <div class=" w-8/12 mx-auto flex" style="min-height: 1000px;">
    <el-row>
      <el-col :span="16">
        <post-list-component />
      </el-col>
      <el-col :span="8">
        <el-affix :offset="60">
          <div class=" ml-2 mt-3">
            <el-card>
              <el-button type="primary" @click="" size="large" class=" w-full">Write a post</el-button>
            </el-card>
            <friend-list-component />
          </div>
        </el-affix>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import PostListComponent from '../components/Post/PostListComponent.vue';
import FriendListComponent from '../components/FriendListComponent.vue';
</script>
<style></style>