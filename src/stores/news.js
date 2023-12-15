import { defineStore } from 'pinia'

export const useNewsStore = defineStore('newsType', {
  state: () => {
    return {
      typeList: [
        { label: 'Campus Life', value: 'Campus Life' },
        { label: 'Academic', value: 'Academic' },
        { label: 'Student Affairs', value: 'Student Affairs' },
        { label: 'Announcement', value: 'Announcement' }
      ]
    }
  },
  actions: {}
})
