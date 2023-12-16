<template>
  <div>
    <el-table
      :data="table"
      stripe
      :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
    >
      <el-table-column prop="reportId" label="Report ID" width="150" align="center"></el-table-column>
      <el-table-column prop="postId" label="Post ID" width="150" align="center"></el-table-column>
      <el-table-column prop="publisherId" label="Publisher ID" width="150" align="center"></el-table-column>
      <el-table-column prop="reason" label="Reason"></el-table-column>
      <el-table-column label="Operation" align="center" width="180" fixed="right">
        <template v-slot="scope">
          <el-button size="small" type="danger" plain @click="del(scope.row.reportId)"
            >Delete</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const table = ref([{}])

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(100)

onMounted(() => {
  fetchData()
})

function fetchData() {
  request
    .get('/post/getReportsByPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      }
    })
    .then((res) => {
      table.value = res.data.list
      total.value = res.data.total
    })
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  fetchData()
}

function del(id) {
  ElMessageBox.confirm('Are you sure to delete this report?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      request
        .post('/post/deleteReport', {
          reportId: id
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
