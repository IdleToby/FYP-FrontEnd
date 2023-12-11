<template>
    <div class="flex">
        <div class="flex">
            <el-avatar size="default" :src="publisher.avatarUrl"></el-avatar>
        </div>
        <div class="flex ml-2">
            <el-link size="large" :underline="false" @click="handleClickName(publisher.userId)">
                <el-text tag="b" size="default">{{ publisher.name }}</el-text>
            </el-link>
        </div>
        <div v-if="comment.replyToId != 0" class="flex">
            <div class="flex items-center ml-2">
                <el-icon>
                    <CaretRight />
                </el-icon>
            </div>
            <div class="flex ml-2">
                <el-avatar size="default" :src="replyTo.avatarUrl"></el-avatar>
            </div>
            <div class="flex ml-2">
                <el-link size="large" :underline="false" @click="handleClickName(replyTo.userId)">
                    <el-text tag="b" size="default">{{ replyTo.name }}</el-text>
                </el-link>
            </div>
        </div>
        <div class="flex-grow"></div>
        <div class="flex">
            <el-text>{{ commentCreateTime }}</el-text>
        </div>
    </div>
    <div class="flex mt-2">
        <div class="flex-1">
            <el-text>{{ comment.commentContent }}</el-text>
        </div>
    </div>
    <div class=" flex mt-2">
        <div class="flex-grow"></div>
        <div class="flex mr-4">
            <el-button v-btn type="primary" icon="Star" :plain="showLike" @click="handleClickLike" round>{{ likesNum
            }}</el-button>
        </div>
        <div class=" flex">
            <el-button v-btn type="primary" icon="ChatRound" circle @click="showReply = !showReply"
                :plain="showReply"></el-button>
        </div>
    </div>
    <div v-if="showReply" class=" flex mt-4">
        <el-input v-model="newReply" :placeholder="'replying ' + publisher.name "></el-input>
        <div class=" ml-4">
            <el-button type="primary" icon="Check" circle @click="handleClickReply"></el-button>
        </div>
    </div>
    <div class="flex-grow">
        <hr class=" mt-4">
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '../../utils/request';
import { ElMessage } from 'element-plus';
import { CaretRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

onMounted(() => {
    fetchPublisherInfo()
    fetchReplyToInfo()
    getLikes()
    handleInitialLike()
})

const props = defineProps({ comment: Object })
const publisher = ref({})
const replyTo = ref({})

function fetchPublisherInfo() {
    request.get('/comment/getCommentPublisher', { params: { publisherId: props.comment.publisherId } })
        .then((res) => {
            publisher.value = res.data
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        });
};

function fetchReplyToInfo() {
    request.get('/comment/getCommentPublisher', { params: { publisherId: props.comment.replyToId } })
        .then((res) => {
            replyTo.value = res.data
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        });
};

const commentCreateTime = computed(() => {
    return new Date(props.comment.createTime).toLocaleString()
})

const router = useRouter()
function handleClickName(userId) {
    router.push({ name: 'profile', params: { userId: userId } })
}

const likesNum = ref(0)
function getLikes() {
    request.get('/comment/getCommentLikes', { params: { commentId: props.comment.commentId } })
        .then((res) => {
            likesNum.value = res
            if (res > 0) {
                showLike.value = true
            }
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        });
}

const localUser = ref(JSON.parse(localStorage.getItem('user')))
const showLike = ref(false)
function handleInitialLike() {
    request.post('/comment/getCommentLikesNum', {
        commentId: props.comment.commentId,
        publisherId: localUser.value.userId
    })
        .then((res) => {
            if (res > 0) {
                showLike.value = true
            }
        })
        .catch((error) => {
            ElMessage.error('Error fetching data:', error);
        })
}

function handleClickLike() {
    if (!showLike.value) {
        request.post('/comment/addCommentLike', {
            commentId: props.comment.commentId,
            publisherId: localUser.value.userId
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                getLikes()
                ElMessage.success('like successfully')
            })
            .catch((error) => {
                ElMessage.error('Error fetching data:', error);
            })
    } else {
        request.post('/comment/removeCommentLike', {
            commentId: props.comment.commentId,
            publisherId: localUser.value.userId
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                getLikes()
                ElMessage.success('unlike successfully')
            })
            .catch((error) => {
                ElMessage.error('Error fetching data:', error);
            })
    }

    showLike.value = !showLike.value
}

const showReply = ref(false)
const newReply = ref('')
function handleClickReply() {
    request.post('/comment/replyComment', {
        postId: props.comment.postId,
        commentContent: newReply.value,
        publisherId: localUser.value.userId,
        replyToId: props.comment.publisherId
    })
        .then((res) => {
            if (res.code == 200) {
                ElMessage.success(res.data);
                newReply.value = '';
                showReply.value = false;
                window.location.reload()
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}
</script>
<style></style>