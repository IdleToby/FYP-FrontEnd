<template>
  <div class=" w-8/12 mx-auto flex" style="min-height: 1000px;">
    <el-row>
      <el-col :span="16">
        <post-list-component />
      </el-col>
      <el-col :span="8">
        <el-affix :offset="60">
          <div class=" ml-2 mt-3">
            <el-card>
              <el-button type="primary" @click="addNewPost" size="large" class=" w-full">Write a
                post</el-button>
            </el-card>
            <friend-list-component />
          </div>
        </el-affix>
      </el-col>
    </el-row>
  </div>

  <el-dialog v-model="dialogVisible" title="Write a new post" @close="closeDialog" class=" w-3/4">
    <el-form :model="newPost" label-width="70px" :rules="rules" ref="myForm">
      <el-form-item label="Content:" prop="postContent">
        <!-- <el-input type="textarea" v-model="newPost.postContent" placeholder="Write the concent of your post"
          :rows="5"></el-input> -->
          <div style="border: 1px solid #ccc; width: 100%;">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden;"
              v-model="newPost.postContent"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
      </el-form-item>
      <el-form-item label="Tag:" prop="postTag">
        <el-select v-model="newPost.postTag" placeholder="">
          <el-option v-for="tag in tagList" :key="tag.label" :label="tag.label" :value="tag.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="File:" prop="hasFile">
        <el-switch v-model="newPost.hasFile"></el-switch>
      </el-form-item>
      <el-form-item v-if="newPost.hasFile">
        <el-upload class="upload-demo w-full" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              a signle file within 20MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPost">Submit</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import PostListComponent from '../components/Post/PostListComponent.vue';
import FriendListComponent from '../components/FriendListComponent.vue';

import { ref, onMounted, shallowRef, onBeforeUnmount, watch } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import request from '../utils/request';
import { ElMessage } from 'element-plus';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

onMounted(() => {
  const localUser = JSON.parse(localStorage.getItem('user'))
  newPost.value.publisherId = localUser.userId
})

function addNewPost() {
  dialogVisible.value = true
}


const dialogVisible = ref(false)

const rules = ref({
  postContent: [
    { required: true, message: 'Content cannot be empty', trigger: 'blur' },
  ],
  postTag: [
    { required: true, message: 'Please select a tag', trigger: 'change' }
  ]
})

const newPost = ref({
  publisherId: '',
  postContent: '',
  hasFile: false,
  postTag: '',
})

const tagList = ref([
  { label: 'Daily Life', value: 'Daily Life' },
  { label: 'Academic', value: 'Academic' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Resource Sharing', value: 'Resource Sharing' }
])

const myForm = ref(null)
function submitPost() {
  myForm.value.validate((valid) => {
    if (valid) {
      request.post('/post/addPost', newPost.value).then(res => {
        if (res.code === '200') {
          ElMessage.success('Post successfully!')
        } else {
          ElMessage.error('Post failed!')
        }
      })
      dialogVisible.value = false
      window.location.reload()
    }
  })
}

//处理编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

const toolbarConfig = {}
toolbarConfig.excludeKeys = [
    'headerSelect',
    'quote',
    'fullScreen'
]

const editorConfig = { placeholder: 'Please type content...' }
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
<style></style>