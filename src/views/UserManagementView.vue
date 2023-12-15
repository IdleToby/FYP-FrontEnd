<template>
  <div>
    <div class="mb-4">
      <el-input style="width: 200px" placeholder="Search Name" v-model="name"></el-input>
      <el-input
        style="width: 200px; margin: 0 5px"
        placeholder="Search Email"
        v-model="email"
      ></el-input>
      <el-button type="primary" @click="load(1)">Search</el-button>
      <el-button type="info" @click="reset">Reset</el-button>
    </div>
    <el-table
      :data="tableUser"
      stripe
      :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
    >
      <el-table-column prop="userId" label="User ID" width="80" align="center"></el-table-column>
      <el-table-column prop="username" label="Username" width="150"></el-table-column>
      <el-table-column prop="name" label="Name" width="150"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column label="Avatar" width="90">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            <el-image
              style="width: 50px; height: 50px; border-radius: 50%"
              v-if="scope.row.avatarUrl"
              :src="scope.row.avatarUrl"
              :preview-src-list="[scope.row.avatarUrl]"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="80"></el-table-column>
      <el-table-column prop="role" label="Role" width="100"></el-table-column>
      <el-table-column
        prop="description"
        label="Description"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="Operation" align="center" width="180">
        <template v-slot="scope">
          <el-button size="small" type="primary" plain @click="handleEdit(scope.row)"
            >Edit</el-button
          >
          <el-button size="small" type="danger" plain @click="del(scope.row.userId)"
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

    <el-dialog v-model="dialogVisible" title="Edit User" width="30%">
      <el-form
        :model="form"
        label-width="80px"
        style="padding-right: 20px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="ID">
          <el-input v-model="form.userId" placeholder="ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="UserName"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status">
            <el-option label="normal" value="normal"></el-option>
            <el-option label="banned" value="banned"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio label="admin"></el-radio>
            <el-radio label="user"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/file/upload"
            :headers="{ token: localUser.token }"
            :file-list="form.avatarUrl ? [{ name: avatarName, url: form.avatarUrl }] : []"
            list-type="picture"
            :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">Upload Avatar</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="save">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const localUser = ref(JSON.parse(localStorage.getItem('user')))

const name = ref('')
const email = ref('')

function load(num) {
  if (num) pageNum.value = num
  request
    .get('/user/searchUser', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        name: name.value,
        email: email.value
      }
    })
    .then((res) => {
      tableUser.value = res.data.list
      total.value = res.data.total
    })
}

function reset() {
  name.value = ''
  email.value = ''
  window.location.reload()
}

const tableUser = ref([{}])

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(100)

onMounted(() => {
  fetchData()
})

function fetchData() {
  request
    .get('/user/getAllUsersByPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    })
    .then((res) => {
      tableUser.value = res.data.list
      total.value = res.data.total
    })
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  load(val)
}

const form = ref({})
const dialogVisible = ref(false)
const rules = ref({
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  email: [{ required: true, message: 'Please input email', trigger: 'blur' }],
  status: [{ required: true, message: 'Please select status', trigger: 'blur' }],
  role: [{ required: true, message: 'Please select role', trigger: 'blur' }]
})

function handleEdit(row) {
  form.value = JSON.parse(JSON.stringify(row)) // 给form对象赋值  深拷贝数据
  dialogVisible.value = true
}

const avatarName = computed(() => {
  return form.value.avatarUrl.split('/').pop()
})
function handleAvatarSuccess(response, file, fileList) {
  // 把user的头像属性换成上传的图片的链接
  form.value.avatarUrl = response.data
}

const formRef = ref(null)
function save() {
  formRef.value.validate((valid) => {
    if (valid) {
      request.post('/updateUser', form.value).then((res) => {
        if (res.code === '200') {
          ElMessage.success('Update Success')
          dialogVisible.value = false
          window.location.reload()
        } else {
          ElMessage.error('Update Failed')
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

function del(id) {
  ElMessageBox.confirm('Are you sure to delete this user?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      request
        .post('/user/deleteUser', {
          userId: id
        })
        .then((res) => {
          if (res.code === '200') {
            ElMessage.success('Delete Success')
            window.location.reload()
          } else {
            ElMessage.error('Delete Failed')
          }
        })
    })
    .catch(() => {
      ElMessage.info('Delete Cancelled')
    })
}
</script>
<style scoped></style>
