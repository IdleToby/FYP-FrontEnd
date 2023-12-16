import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      types: [
        { label: 'Post', value: 'Post' },
        { label: 'User', value: 'User' },
        { label: 'News', value: 'News' }
      ]
    }
  },
  actions: {}
})
