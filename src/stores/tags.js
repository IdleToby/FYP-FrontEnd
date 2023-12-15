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
  actions: {}
})
