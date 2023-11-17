<template>
    <div class=" w-8/12 mx-auto flex" style="min-height: 1000px;">
        <el-row>
            <el-col :span="16">
              <post-list-component />
            </el-col>
            <el-col :span="8">
                <el-text>Write post here</el-text>
            </el-col>
          </el-row>
    </div>
</template>
<script setup>
import PostListComponent from '../components/Post/PostListComponent.vue';
</script>
<style>
</style>