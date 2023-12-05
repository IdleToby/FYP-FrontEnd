import './assets/style.css'
import '@wangeditor/editor/dist/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import btn from './directive/btn'

import App from './App.vue'
import router from './router'

import { i18nChangeLanguage } from '@wangeditor/editor'

i18nChangeLanguage('en')


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(btn)

app.mount('#app')
