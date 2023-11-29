<template>
    <div v-for="post in postList" :key="post.postId">
        <post-component :post="post" />
    </div>
    <div class=" flex mt-2" v-if="postList.length !== 0">
        <el-pagination background layout="prev, pager, next, jumper" :total="total" :page-size="pageSize"
            @current-change="handleCurrentChange" class=" mx-auto" />
    </div>
    <div class=" mt-2" v-else>
        <el-card>
            <el-empty description="This person has no post yet..."></el-empty>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import PostComponent from '../Post/PostComponent.vue';
import request from '../../utils/request';
import {useRoute} from 'vue-router'

onMounted(() => {
    fetchData()
})

const postList = ref([])

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(100);
const totalPages = ref(10);
const route = useRoute()
const userId = route.params.userId

const fetchData = () => {
    request.get('/post/getPostListByUserId', {
        params: {
            userId: userId,
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        },
    })
        .then((res) => {
            postList.value = res.data.list;
            total.value = res.data.total;
            totalPages.value = res.data.pages;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};


const handleCurrentChange = (val) => {
    pageNum.value = val;
    fetchData();
};
</script>
<style></style>