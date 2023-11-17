<template>
    <el-card class="my-3">
        <div class="flex">
            <div class="flex">
                <el-avatar :src="publisher.avatarUrl" size="large"></el-avatar>
            </div>
            <div class="flex ml-2">
                <el-link size="large" :underline="false">{{ publisher.name }}</el-link>
            </div>
        </div>
        <div class="flex">
            <div class="flex-grow">
                <el-text>{{ showContent ? post.postContent : truncatedContent }}</el-text>
                <el-link type="primary" @click="toggleContent">{{ buttonText }}<el-icon>
                        <ArrowDown v-if="showContent == false" />
                        <ArrowUp v-else />
                    </el-icon></el-link>
            </div>
        </div>
        <div class="flex">
            <div class="flex-grow">
                <el-text>{{ post.description }}</el-text>
            </div>
        </div>
        <div class="flex">
            <div class="flex-grow">
                <el-button type="primary" icon="star" link>post.like</el-button>
                <el-button type="primary" icon="chatDotRound" link>post.comment</el-button>
            </div>
        </div>
    </el-card>
</template>
  
<script setup>
import { ref } from 'vue'
import request from '../../utils/request'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({ post: Object })
const publisher = ref({})
const showContent = ref(false)
const buttonText = ref('show more')
const truncatedContentLength = 180 // 设定部分显示的字符长度



fetchPublisherInfo()

function fetchPublisherInfo() {
    request.get('/post/getPostPublisher', { params: { publisherId: props.post.publisherId } })
        .then((res) => {
            publisher.value = res.data
            computeTruncatedContent()
        })
        .catch((error) => {
            console.log(error)
        })
}

// 根据部分显示状态计算截取的部分内容
const truncatedContent = ref('') // 初始化截取内容

// 计算部分显示内容
function computeTruncatedContent() {
    truncatedContent.value = props.post.postContent.slice(0, truncatedContentLength) + '...'
}

function toggleContent() {
    showContent.value = !showContent.value
    buttonText.value = showContent.value ? 'show less' : 'show more'
}

</script>
<style></style>
  