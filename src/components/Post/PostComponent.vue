<template>
  <el-card class="my-3">
    <div class="flex">
      <div class="flex">
        <el-avatar :src="publisher.avatarUrl" size="large"></el-avatar>
      </div>
      <div class="flex ml-2">
        <el-button size="large" link @click="handleClickName"
          ><el-text tag="b" size="large">{{ publisher.name }}</el-text></el-button
        >
      </div>
      <div class="flex-grow"></div>
      <div class="flex">
        <el-text>{{ postUpdateTime }}</el-text>
      </div>
    </div>
    <div class="flex mt-4">
      <div class="flex-grow"></div>
      <el-link v-if="showMoreButton" type="primary" @click="toggleContent"
        >{{ showButtonText }}
        <el-icon>
          <ArrowDown v-if="showContent == false" />
          <ArrowUp v-else />
        </el-icon>
      </el-link>
    </div>
    <div class="flex mt-4">
      <div class="flex-grow">
        <div
          class="content-wrapper"
          :style="{
            maxHeight: showContent ? 'none' : '100px',
            overflow: showContent ? 'none' : 'hidden'
          }"
          ref="contentRef"
        >
          <div v-html="props.post.postContent"></div>
        </div>
      </div>
    </div>
    <div class="flex mt-4">
      <div class="flex-grow">
        <el-button v-btn type="primary" icon="star" :plain="showLike" @click="handleClickLike"
          >{{ likeNum }} Likes</el-button
        >
        <el-button type="info" icon="chatDotRound" link @click="toggleComment"
          >{{ commentButtonText }}
          <el-icon>
            <ArrowDown v-if="showComment == false" />
            <ArrowUp v-else />
          </el-icon>
        </el-button>
      </div>
      <div class="flex my-auto">
        <el-tag class="ml-2" effect="light" round>{{ props.post.postTag }}</el-tag>
      </div>
      <div class="flex my-auto ml-2">
        <el-button
          type="danger"
          icon="Warning"
          circle
          size="small"
          @click="clickReport"
        ></el-button>
      </div>
    </div>
    <div v-if="showComment" class="commentListBorder mt-4">
      <comment-list-component :postId="post.postId" @comment-num="handleCommentNum" />
    </div>
  </el-card>

  <el-dialog title="Report Post" v-model="dialogVisible">
    <el-form v-model="reportForm" label-width="100px">
      <el-form-item label="Post ID" props="postId">
        <el-input v-model="reportForm.postId" disabled></el-input>
      </el-form-item>
      <el-form-item label="Publisher ID" props="publisherId">
        <el-input v-model="reportForm.publisherId" disabled></el-input>
      </el-form-item>
      <el-form-item label="Reason" label-position="left" props="reason">
        <el-input
          v-model="reportForm.reason"
          type="textarea"
          :rows="5"
          placeholder="Please enter the reason for reporting"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex-grow"></div>
        <el-button type="primary" @click="handleReport">Submit</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '../../utils/request'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommentListComponent from '../comment/CommentListComponent.vue'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

onMounted(() => {
  fetchPublisherInfo()
  computeTruncatedContent()
  fetchInitialCommentNum()
  getLikes()
  handleInitialLike()
  postId.value = props.post.postId
})

const postId = ref(0)

const props = defineProps({ post: Object })
const publisher = ref({})
const showContent = ref(false)
const showButtonText = ref('show all')

function fetchPublisherInfo() {
  request
    .get('/post/getPostPublisher', { params: { publisherId: props.post.publisherId } })
    .then((res) => {
      publisher.value = res.data
    })
    .catch((error) => {
      console.log(error)
    })
}

const contentRef = ref(null)
const showMoreButton = ref(false)

function computeTruncatedContent() {
  if (contentRef.value) {
    const contentHeight = contentRef.value.offsetHeight
    showMoreButton.value = contentHeight >= 100
  }
}

function toggleContent() {
  showContent.value = !showContent.value
  showButtonText.value = showContent.value ? 'show less' : 'show all'
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
  request
    .get('/comment/getCommentNum', { params: { postId: props.post.postId } })
    .then((res) => {
      commentNum.value = res
      commentButtonText.value = res + ' comments'
    })
    .catch((error) => {
      ElMessage.error('Error fetching data:', error)
    })
}

const postUpdateTime = computed(() => {
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
  return new Date(props.post.updateTime).toLocaleString('en-MY', options)
})

const showLike = ref(false)
function handleClickLike() {
  if (!showLike.value) {
    request
      .post('/post/addLike', {
        postId: props.post.postId,
        userId: JSON.parse(localStorage.getItem('user')).userId
      })
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        getLikes()
        ElMessage.success('like success')
      })
      .catch((error) => {
        ElMessage.error('Error fetching data:', error)
      })
  } else {
    request
      .post('/post/removeLike', {
        postId: props.post.postId,
        userId: JSON.parse(localStorage.getItem('user')).userId
      })
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        getLikes()
        ElMessage.success('unlike success')
      })
      .catch((error) => {
        ElMessage.error('Error fetching data:', error)
      })
  }

  showLike.value = !showLike.value
}

const likeNum = ref(0)
function getLikes() {
  request
    .get('/post/getLikes', { params: { postId: props.post.postId } })
    .then((res) => {
      likeNum.value = res
    })
    .catch((error) => {
      ElMessage.error('Error fetching data:', error)
    })
}

function handleInitialLike() {
  request
    .post('/post/getLikesNum', {
      postId: props.post.postId,
      userId: JSON.parse(localStorage.getItem('user')).userId
    })
    .then((res) => {
      if (res.data.likesNum > 0 && props.post.postId == res.data.postId) {
        showLike.value = true
      }
    })
    .catch((error) => {
      ElMessage.error('Error fetching data:', error)
    })
}

const router = useRouter()
function handleClickName() {
  router.push({ path: '/profile/' + publisher.value.userId })
}

const dialogVisible = ref(false)

const reportForm = ref({
  postId: 0,
  publisherId: 0,
  reason: ''
})

function handleReport() {
  request
    .post('/post/reportPost', reportForm.value)
    .then((res) => {
      ElMessage.success('Report success')
      window.location.reload()
    })
    .catch((error) => {
      ElMessage.error('Error fetching data:', error)
    })
}

function clickReport() {
  dialogVisible.value = true
  reportForm.value.postId = props.post.postId
  reportForm.value.publisherId = publisher.value.userId
}
</script>
<style scoped>
.commentListBorder {
  border: 1px solid #d6dbdf;
}

.content-wrapper {
  transition: max-height 0.3s ease-in-out;
}
</style>
