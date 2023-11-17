<template>
  <div>
    <el-table :data="testData">
      <el-table-column label="User ID" prop="userId"></el-table-column>
      <el-table-column label="Username" prop="username"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '../utils/request';

const testData = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(100);

const fetchData = () => {
  request.get('/testData', {
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    },
  })
    .then((res) => {
      testData.value = res.data.list;
      total.value = res.data.total;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};


const handleCurrentChange = (val) => {
  pageNum.value = val;
  fetchData();
};

fetchData();
</script>

<style></style>
