<template>
<div class=" w-10/12 mx-auto mt-4">
  <!-- announcement -->
<div class=" flex">
  <el-card class=" w-full">
    sdfasdf
  </el-card>
</div>
<div class="flex mt-4">
  <div class="flex-1">
    <el-card>
      <div class="flex">
        <div class="flex-1">
          <el-input placeholder="Search" v-model="searchText" clearable></el-input>
        </div>
        <div class="flex">
          <el-button type="primary" icon="Search" @click="handleSearch"></el-button>
        </div>
      </div>
    </el-card>
  </div>
  <div class="flex-1">1</div>
  <div class="flex-1">1</div>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';

const testData = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(100);

</script>

<style></style>
