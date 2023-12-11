import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => {
    return {
      tagList: [
        { label: 'Daily Life', value: 'Daily Life' },
        { label: 'Academic', value: 'Academic' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Resource Sharing', value: 'Resource Sharing' }
      ]
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {}
})
