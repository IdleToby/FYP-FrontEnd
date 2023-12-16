<template>
  <div>
    <!-- filter -->
    <el-select v-model="filter" placeholder="Filter by tags" clearable>
      <el-option v-for="tag in tagList" :label="tag.value" :value="tag.value" :key="tag.value"></el-option>
    </el-select>
  </div>
  <div v-for="post in filterList" :key="post.postId">
    <post-component :post="post" />
  </div>
  <div class="flex">
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      class="mx-auto"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import PostComponent from '../Post/Postcomponent.vue'
import request from '../../utils/request'

const props = defineProps({
  keyword: {
    type: String,
    required: true
  }
})

const filter = ref('')

onMounted(() => {
  nextTick(() => {
    fetchData()
  })
})

const postList = ref([])

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(100)
const totalPages = ref(10)

const fetchData = () => {
  request
    .get('/search/post', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyword: props.keyword
      }
    })
    .then((res) => {
      postList.value = res.data.list
      total.value = res.data.total
      totalPages.value = res.data.pages
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  fetchData()
}

import { useTagsStore} from '../../stores/tags'
const tagsStore = useTagsStore()
const tagList = tagsStore.tagList

const filterList = computed(() => {
  if (filter.value === '') {
    return postList.value
  } else {
    return postList.value.filter((post) => post.postTag === filter.value)
  }
})
</script>
<style></style>
