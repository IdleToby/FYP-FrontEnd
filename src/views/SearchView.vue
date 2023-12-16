<template>
  <div class="w-1/2 mx-auto">
    <div class=" font-bold text-lg ml-2 mt-2">Search {{ type }}: {{ keyword }}</div>
    <search-post-component v-if="type == 'Post'" :keyword="keyword"></search-post-component>
    <search-user-component v-else-if="type == 'User'" :keyword="keyword"></search-user-component>
    <search-news-component v-else-if="type == 'News'" :keyword="keyword"></search-news-component>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import SearchPostComponent from '../components/Search/SearchPostComponent.vue'
import SearchUserComponent from '../components/Search/SearchUserComponent.vue'
import SearchNewsComponent from '../components/Search/SearchNewsComponent.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const type = ref('')
const keyword = ref('')

onMounted(() => {
  type.value = route.query.type
  keyword.value = route.query.keyword
})
</script>
<style></style>
