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
                <el-icon><CaretRight /></el-icon>
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
        <div class="flex">
            <el-text>{{ comment.commentContent }}</el-text>
        </div>
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
</script>
<style></style>