<template>
    <div class=" w-8/12 mx-auto mt-4">
        <el-card class=" w-full" style="min-height: 800px;">
            <div class=" w-10/12 mx-auto">
                <el-link type="primary" icon="ArrowLeft" @click="goBack">Go Back</el-link>
                <div class="text-2xl font-extrabold mb-4 mt-4">{{ news.title }}</div>
                <el-divider></el-divider>
                <div class="text-gray-500">Written: {{ getTime(news.createTime) }}</div>
                <div class=" mb-8 text-gray-500">Last modified: {{ getTime(news.updateTime) }}</div>
            </div>
            <div class=" w-10/12 mx-auto">
                <el-divider></el-divider>
                <div v-html="news.content"></div>
            </div>
        </el-card>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()

const news = ref({})

onMounted(() => {
    const newsId = route.params.newsId
    getNewsById(newsId)
})

function getNewsById(newsId) {
    request.get('/news/getNewsById', {
        params: {
            newsId: newsId
        }
    }).then(res => {
        news.value = res.data
    })
}

function getTime(time) {
    const date = computed(() => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(time).toLocaleDateString('en-MY', options)
    })
    return date.value
}

function goBack() {
    router.back()
}

</script>
  
<style></style>
