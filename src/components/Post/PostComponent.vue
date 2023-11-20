<template>
    <el-card class="my-3">
        <div class="flex">
            <div class="flex">
                <el-avatar :src="publisher.avatarUrl" size="large"></el-avatar>
            </div>
            <div class="flex ml-2">
                <el-link size="large" :underline="false"><el-text tag="b" size="large">{{ publisher.name }}</el-text></el-link>
            </div>
        </div>
        <div class="flex mt-4">
            <div class="flex-grow">
                <el-text>{{ showContent ? post.postContent : truncatedContent }}</el-text>
                <el-link type="primary" @click="toggleContent">{{ showButtonText }}<el-icon>
                        <ArrowDown v-if="showContent == false" />
                        <ArrowUp v-else />
                    </el-icon></el-link>
            </div>
        </div>
        <div class="flex mt-4">
            <div class="flex-grow">
                <el-button type="primary" icon="star" link>post.like</el-button>
                <el-button type="info" icon="chatDotRound" link @click="toggleComment">{{ commentButtonText }}
                    <el-icon>
                        <ArrowDown v-if="showContent == false" />
                        <ArrowUp v-else />
                    </el-icon>
                </el-button>
            </div>
        </div>
        <div v-if="showComment" class="commentListBorder mt-4">
            <comment-list-component :postId="post.postId" @comment-num="handleCommentNum" />
        </div>
    </el-card>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import request from '../../utils/request'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommentListComponent from '../comment/CommentListComponent.vue';
import { ElMessage } from 'element-plus';

onMounted(() => {
    fetchPublisherInfo()
    fetchInitialCommentNum()
})

const props = defineProps({ post: Object })
const publisher = ref({})
const showContent = ref(false)
const showButtonText = ref('show more')
const truncatedContentLength = 180 // 设定部分显示的字符长度

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
    showButtonText.value = showContent.value ? 'show less' : 'show more'
}

function toggleComment() {
    showComment.value = !showComment.value
    commentButtonText.value = showComment.value ? 'hide comment' : commentNum.value + ' comments'
}

function handleCommentNum(num) {
    commentNum.value = num
}

const commentNum = ref(0)
const showComment = ref(false)
const commentButtonText = ref('0 comments')
// watch(() => commentNum.value, (val) => {
//     commentButtonText.value = val + ' comments'
// })
function fetchInitialCommentNum() {
    request.get('/comment/getCommentNum', { params: { postId: props.post.postId } })
        .then((res) => {
            commentNum.value = res
            commentButtonText.value = res + ' comments'
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        })
}
</script>
<style scoped>
.commentListBorder {
    border: 1px solid #D6DBDF;
}</style>
  