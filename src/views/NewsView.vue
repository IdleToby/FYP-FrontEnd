<template>
  <div class="w-10/12 mx-auto mt-4">
    <el-card class="w-full" style="">
      <el-row>
        <el-col :span="8">
          <div>
            <div class="text-2xl font-bold text-center mb-4">News Categories</div>
            <el-menu :default-active="activeIndex" mode="vertical" @select="handleSelect">
              <el-menu-item :index="type.label" v-for="type in typeList" :key="type.label">{{
                type.label
              }}</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="16">
          <news-titles :newsType="activeIndex"></news-titles>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NewsTitles from '../components/News/NewsTitles.vue'

import { useNewsStore } from '../stores/news'
const newsTypeStore = useNewsStore()
const typeList = newsTypeStore.typeList

onMounted(() => {})

const activeIndex = ref(typeList[0].label)
const handleSelect = (key) => {
  activeIndex.value = key
}
</script>

<style></style>
