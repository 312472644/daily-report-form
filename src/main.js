import { createApp } from 'vue';
import NaiveUI from 'naive-ui';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
app.use(NaiveUI);
app.use(router);
app.mount('#app');
