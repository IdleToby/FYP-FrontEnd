<template>
    <div v-for="comment in commentList" :key="comment.commentId" class="commentBottomBorder">
        <comment-component :comment="comment"></comment-component>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../../utils/request';
import CommentComponent from './CommentComponent.vue';

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
</script>
<style scoped>
.commentBottomBorder {
    padding: 1rem;
}
</style>