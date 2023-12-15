<template>
  <div>
    <div class="mb-4">
      <el-input style="width: 200px" placeholder="Search ID" v-model="publisherId"></el-input>
      <el-input
        style="width: 200px; margin: 0 5px"
        placeholder="Search Content"
        v-model="postContent"
      ></el-input>
      <el-button type="primary" @click="load(1)">Search</el-button>
      <el-button type="info" @click="reset">Reset</el-button>
    </div>
    <el-table
      :data="tablePost"
      stripe
      :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
    >
      <el-table-column prop="post.postId" label="Post ID" align="center"></el-table-column>
      <el-table-column
        prop="post.publisherId"
        label="Publisher ID"
        align="center"
      ></el-table-column>
      <el-table-column prop="publisherName" label="Publisher Name"> </el-table-column>
      <el-table-column label="Post Content">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            <el-button type="primary" @click="showContent(scope.row)">Show Content</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="post.postTag" label="Post Tag"></el-table-column>
      <el-table-column label="Create Time">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            {{ new Date(scope.row.post.createTime).toLocaleDateString('en-MY', options) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Update Time">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            {{ new Date(scope.row.post.updateTime).toLocaleDateString('en-MY', options) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180">
        <template v-slot="scope">
          <el-button size="small" type="primary" plain @click="handleEdit(scope.row)"
            >Edit</el-button
          >
          <el-button size="small" type="danger" plain @click="del(scope.row.post.postId)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

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
        <el-form-item label="File:" prop="hasFile">
          <el-switch v-model="newPost.hasFile"></el-switch>
        </el-form-item>
        <el-form-item v-if="newPost.hasFile">
          <el-upload
            class="upload-demo w-full"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip">a signle file within 20MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPost">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const publisherId = ref('')
const postContent = ref('')

function load(num) {
  if (num) pageNum.value = num
  request
    .get('/post/searchPost', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        publisherId: publisherId.value,
        postContent: postContent.value
      }
    })
    .then((res) => {
      tablePost.value = res.data.list
      total.value = res.data.total
    })
}

function reset() {
  postContent.value = ''
  publisherId.value = ''
  window.location.reload()
}

const tablePost = ref([{}])

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(100)

function fetchData() {
  request
    .get('/post/getPostWithPublisher', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    })
    .then((res) => {
      tablePost.value = res.data.list
      total.value = res.data.total
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}

onMounted(() => {
  fetchData()
})

const handleCurrentChange = (val) => {
  pageNum.value = val
  fetchData()
}

function handleEdit(row) {
  newPost.value = JSON.parse(JSON.stringify(row.post)) // 给form对象赋值  深拷贝数据
  dialogVisible.value = true
}

function showContent(row) {
  ElMessageBox.alert(row.post.postContent, 'Post Content', {
    confirmButtonText: 'OK',
    dangerouslyUseHTMLString: true
  })
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
      maxFileSize: 20 * 1024 * 1024,
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
      maxFileSize: 20 * 1024 * 1024,
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
<style scoped></style>
