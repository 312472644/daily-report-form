import { createApp } from 'vue'
import NaiveUI from 'naive-ui'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(NaiveUI)
app.mount('#app')
