<template>
    <div class=" flex w-full flex-wrap">
        <div class=" flex w-full text-2xl font-bold text-center mb-4 ml-4">Total: {{ total }}</div>
        <div class=" flex w-full titleClass ml-4" v-for="title in titleList" :key="title.newsId"
            @click="handleClick(title.newsId)">
            <div class=" flex">{{ getUpdateTime(title.updateTime) }}</div>
            <el-divider direction="vertical" border-style="hidden" />
            <div class=" flex">{{ title.title }}</div>
        </div>
        <div class=" flex mx-auto">
            <el-pagination background layout="prev, pager, next, jumper" :total="total" :page-size="pageSize"
                @current-change="handleCurrentChange" class=" mx-auto" />
        </div>
    </div>
</template>
<script setup>
import request from '../../utils/request'
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    keyword: {
        type: String,
        required: true
    }
})

onMounted(() => {
    nextTick(() => {
        getTitleList()
    })
})

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(100);

const titleList = ref([{}])
function getTitleList() {
    request.get('/search/news', {
        params: {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            keyword: props.keyword
        }
    }).then(res => {
        titleList.value = res.data.list
        total.value = res.data.total
    })
}

function getUpdateTime(time) {
    const date = computed(() => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return new Date(time).toLocaleDateString('en-MY', options)
    })
    return date.value
}

const handleCurrentChange = (val) => {
    pageNum.value = val;
    getTitleList();
}

function handleClick(newsId) {
    request.get('/news/getNewsById', {
        params: {
            newsId: newsId
        }
    }).then(res => {
        router.push({
            name: 'newsDetails',
            params: {
                newsId: newsId
            }
        })
    })
}
</script>
<style scoped>
.titleClass {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    background-color: #FFFFFF;
    transition: all 0.3s ease;
}

.titleClass:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}
</style>
