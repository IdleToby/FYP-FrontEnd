<template>
  <div>
    <div class="mb-4">
      <el-input style="width: 200px" placeholder="Search Title" v-model="newsTitle"></el-input>
      <el-input
        style="width: 200px; margin: 0 5px"
        placeholder="Search Content"
        v-model="newsContent"
      ></el-input>
      <el-button type="primary" @click="load(1)">Search</el-button>
      <el-button type="info" @click="reset">Reset</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="handleAdd">Add</el-button>
    </div>
    <el-table
      :data="tableNews"
      stripe
      :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
    >
      <el-table-column prop="news.newsId" label="News ID" align="center" width="100"></el-table-column>
      <el-table-column
        prop="news.publisherId"
        label="Publisher ID"
        align="center"
        width="110"
      ></el-table-column>
      <el-table-column prop="publisherName" label="Publisher Name"></el-table-column>
      <el-table-column prop="news.title" label="News Title"></el-table-column>
      <el-table-column label="News Content">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            <el-button type="primary" @click="showContent(scope.row)">Show Content</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="news.type" label="News Type"></el-table-column>
      <el-table-column label="Create Time">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            {{ new Date(scope.row.news.createTime).toLocaleDateString('en-MY', options) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Update Time">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            {{ new Date(scope.row.news.updateTime).toLocaleDateString('en-MY', options) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180">
        <template v-slot="scope">
          <el-button size="small" type="primary" plain @click="handleEdit(scope.row)"
            >Edit</el-button
          >
          <el-button size="small" type="danger" plain @click="del(scope.row.news.newsId)"
            >Delete</el-button
          >
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

    <el-dialog v-model="dialogVisible" title="News" @close="closeDialog" class="w-3/4">
      <el-form :model="newPost" label-width="100px" :rules="rules" ref="myForm">
        <el-form-item label="News ID:" prop="newsId">
          <el-input v-model="newPost.newsId" disabled></el-input>
        </el-form-item>
        <el-form-item label="Publisher ID:" prop="publisherId">
          <el-input v-model="newPost.publisherId"></el-input>
        </el-form-item>
        <el-form-item label="Title:" prop="title">
          <el-input v-model="newPost.title"></el-input>
        </el-form-item>
        <el-form-item label="Content:" prop="content">
          <div style="border: 1px solid #ccc; width: 100%">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="newPost.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="Type:" prop="type">
          <el-select v-model="newPost.type" placeholder="">
            <el-option
              v-for="type in typeList"
              :key="type.label"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
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

const newsTitle = ref('')
const newsContent = ref('')

function load(num) {
  if (num) pageNum.value = num
  request
    .get('/news/searchNews', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        newsTitle: newsTitle.value,
        newsContent: newsContent.value
      }
    })
    .then((res) => {
      tableNews.value = res.data.list
      total.value = res.data.total
    })
}

function reset() {
  newsTitle.value = ''
  newsContent.value = ''
  window.location.reload()
}

const tableNews = ref([{}])

const pageNum = ref(1)
const pageSize = ref(8)
const total = ref(100)

function fetchData() {
  request
    .get('/news/getNewsWithPublisher', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    })
    .then((res) => {
      tableNews.value = res.data.list
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
  newPost.value = JSON.parse(JSON.stringify(row.news)) // 给form对象赋值  深拷贝数据
  dialogVisible.value = true
}

function showContent(row) {
  ElMessageBox.alert(row.news.content, 'Post Content', {
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
  content: [{ required: true, message: 'Content cannot be empty', trigger: 'blur' }],
  title: [{ required: true, message: 'Title cannot be empty', trigger: 'blur' }],
  type: [{ required: true, message: 'Please select a type', trigger: 'blur' }]
})

function del(id) {
  ElMessageBox.confirm('Are you sure to delete this news?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      request
        .post('/news/deleteNews', {
          newsId: id
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

const newPost = ref({})

import { useNewsStore } from '../stores/news'
const newsTypeStore = useNewsStore()
const typeList = newsTypeStore.typeList

const myForm = ref(null)
function submitPost() {
  myForm.value.validate((valid) => {
    if (valid) {
      if (newPost.value.newsId == null) {
        request.post('/news/addNews', newPost.value).then((res) => {
          if (res.code === '200') {
            ElMessage.success('Add successfully!')
          } else {
            ElMessage.error('Add failed!')
          }
        })
        dialogVisible.value = false

        //等待一秒
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        //如果是编辑
        request.post('/news/editNews', newPost.value).then((res) => {
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
  newPost.value.content = val
})

function handleAdd() {
  dialogVisible.value = true
}
</script>
<style>
</style>
