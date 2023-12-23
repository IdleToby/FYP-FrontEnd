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
        <el-button type="warning" icon="EditPen" circle size="small" @click="handleEdit(props.post)"></el-button>
        <el-button type="danger" icon="Delete" circle size="small" @click="del(props.post.postId)"></el-button>
      </div>
    </div>
    <div v-if="showComment" class="commentListBorder mt-4">
      <comment-list-component :postId="post.postId" @comment-num="handleCommentNum" />
    </div>
  </el-card>

  <el-dialog v-model="dialogVisible" title="Edit Post" @close="closeDialog" class="w-3/4">
    <el-form :model="newPost" label-width="100px" :rules="rules" ref="myForm">
      <el-form-item label="Post ID:" prop="postId">
        <el-input v-model="newPost.postId" disabled></el-input>
      </el-form-item>
      <el-form-item label="Publisher ID:" prop="publisherId">
        <el-input v-model="newPost.publisherId"></el-input>
      </el-form-item>
      <el-form-item label="Content:" prop="postContent">
        <div style="border: 1px solid #ccc; width: 100%">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 300px; overflow-y: hidden"
            v-model="newPost.postContent"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>
      <el-form-item label="Tag:" prop="postTag">
        <el-select v-model="newPost.postTag" placeholder="">
          <el-option
            v-for="tag in tagList"
            :key="tag.label"
            :label="tag.label"
            :value="tag.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPost">Submit</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, shallowRef, onBeforeUnmount, watch } from 'vue'
import request from '../../utils/request'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import CommentListComponent from '../comment/CommentListComponent.vue'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

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


function handleEdit(row) {
  newPost.value = JSON.parse(JSON.stringify(row)) // 给form对象赋值  深拷贝数据
  dialogVisible.value = true
}


const options = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
}

const dialogVisible = ref(false)

const rules = ref({
  postContent: [{ required: true, message: 'Content cannot be empty', trigger: 'blur' }],
  postTag: [{ required: true, message: 'Please select a tag', trigger: 'change' }],
})

function del(id) {
  ElMessageBox.confirm('Are you sure to delete this post?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      request
        .post('/post/deletePost', {
          postId: id
        })
        .then((res) => {
          if (res.code === '200') {
            ElMessage.success('Delete successfully!')
          } else {
            ElMessage.error('Delete failed!')
          }
        })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
    .catch(() => {
      ElMessage.info('Delete canceled!')
    })
}

const newPost = ref({
  publisherId: '',
  postContent: '',
  hasFile: false,
  postTag: ''
})

import { useTagsStore } from '@/stores/tags'
const tags = useTagsStore()
const tagList = tags.tagList

const myForm = ref(null)
function submitPost() {
  myForm.value.validate((valid) => {
    if (valid) {
      request.post('/post/editPost', newPost.value).then((res) => {
        if (res.code === '200') {
          ElMessage.success('Edit successfully!')
        } else {
          ElMessage.error('Edit failed!')
        }
      })
      dialogVisible.value = false

      //等待一秒
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  })
}

//处理编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

const toolbarConfig = {}
toolbarConfig.excludeKeys = ['headerSelect', 'quote', 'fullScreen']

const baseURL = 'http://localhost:8080'
const localUser = ref(JSON.parse(localStorage.getItem('user')))
const editorConfig = {
  placeholder: 'Please type content...',
  MENU_CONF: {
    uploadImage: {
      server: baseURL + '/file/editor/upload',
      fieldName: 'file',
      maxFileSize: 50 * 1024 * 1024,
      headers: {
        token: localUser.value.token
      },
      meta: {
        type: 'img'
      }
    },
    uploadVideo: {
      server: baseURL + '/file/editor/upload',
      fieldName: 'file',
      maxFileSize: 50 * 1024 * 1024,
      headers: {
        token: localUser.value.token
      },
      meta: {
        type: 'video'
      }
    }
  }
}

const mode = 'default'

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

function closeDialog() {
  const editor = editorRef.value
  if (editor == null) return
  editor.setHtml('')

  dialogVisible.value = false
  myForm.value.resetFields()
}

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

watch(valueHtml, (val) => {
  newPost.value.postContent = val
})
</script>
<style scoped>
.commentListBorder {
  border: 1px solid #d6dbdf;
}

.content-wrapper {
  transition: max-height 0.3s ease-in-out;
}
</style>
