<template>
    <el-card class="my-3">
        <div class="flex">
            <div class="flex">
                <el-avatar :src="publisher.avatarUrl" size="large"></el-avatar>
            </div>
            <div class="flex ml-2">
                <el-button size="large" link @click="handleClickName"><el-text tag="b" size="large">{{ publisher.name
                }}</el-text></el-button>
            </div>
            <div class=" flex-grow"></div>
            <div class=" flex">
                <el-text>{{ postUpdateTime }}</el-text>
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
                <el-button v-btn type="primary" icon="star" :plain="showLike" @click="handleClickLike">{{ likeNum
                }} Likes</el-button>
                <el-button type="info" icon="chatDotRound" link @click="toggleComment">{{ commentButtonText }}
                    <el-icon>
                        <ArrowDown v-if="showComment == false" />
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
import { ref, onMounted, computed } from 'vue'
import request from '../../utils/request'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommentListComponent from '../comment/CommentListComponent.vue';
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router'

onMounted(() => {
    fetchPublisherInfo()
    fetchInitialCommentNum()
    getLikes()
    handleInitialLike()
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

const postUpdateTime = computed(() => {
    return new Date(props.post.updateTime).toLocaleString()
})

const showLike = ref(false)
function handleClickLike() {
    if (!showLike.value) {
        request.post('/post/addLike', {
            postId: props.post.postId,
            userId: JSON.parse(localStorage.getItem('user')).userId
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                getLikes()
                ElMessage.success('like success')
            })
            .catch((error) => {
                ElMessage.error('Error fetching data:', error);
            })
    } else {
        request.post('/post/removeLike', {
            postId: props.post.postId,
            userId: JSON.parse(localStorage.getItem('user')).userId
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                getLikes()
                ElMessage.success('unlike success')
            })
            .catch((error) => {
                ElMessage.error('Error fetching data:', error);
            })
    }

    showLike.value = !showLike.value
}

const likeNum = ref(0)
function getLikes() {
    request.get('/post/getLikes', { params: { postId: props.post.postId } })
        .then((res) => {
            likeNum.value = res
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        })
}

function handleInitialLike() {
    request.post('/post/getLikesNum', {
        postId: props.post.postId,
        userId: JSON.parse(localStorage.getItem('user')).userId
    })
        .then((res) => {
            if (res.data.likesNum > 0 && props.post.postId == res.data.postId) {
                showLike.value = true
            }
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        })
}

const router = useRouter()
function handleClickName() {
    router.push({ path: '/profile/' + publisher.value.userId })
}
</script>
<style scoped>
.commentListBorder {
    border: 1px solid #D6DBDF;
}
</style>
  