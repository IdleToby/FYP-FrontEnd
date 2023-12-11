<template>
    <div class=" flex p-4">
        <div class=" flex-grow">
            <el-input v-model="newComment" placeholder="Send a new comment..." size="large" autosize></el-input>
        </div>
        <div class=" flex ml-6 my-auto">
            <el-button type="primary" @click="submitComment">Submit</el-button>
        </div>
    </div>
    <div v-for="comment in commentList" :key="comment.commentId" class="commentBottomBorder">
        <comment-component :comment="comment"></comment-component>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../../utils/request';
import CommentComponent from './CommentComponent.vue';
import { ElMessage } from 'element-plus';

onMounted(() => {
    fetchData();
    emits('comment-num', commentNum.value)
})

const props = defineProps({ postId: Number })
const emits = defineEmits(['comment-num'])
const commentNum = computed(() => commentList.value.length)

const commentList = ref([])
function fetchData() {
    request.get('/comment/getCommentList', {
        params: {
            postId: props.postId,
        },
    })
        .then((res) => {
            commentList.value = res.data;
            emits('comment-num', commentNum.value)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};

const localUser = ref(JSON.parse(localStorage.getItem('user')))
const newComment = ref('')
function submitComment() {
    request.post('/comment/addComment', {
        postId: props.postId,
        commentContent: newComment.value,
        publisherId: localUser.value.userId,
    })
        .then((res) => {
            if (res.code == 200) {
                ElMessage.success(res.data);
                fetchData();
                newComment.value = '';
            } else {
                ElMessage.error('Comment failed!');
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}
</script>
<style scoped>
.commentBottomBorder {
    padding: 1rem;
}
</style>