import { createRouter, createWebHashHistory } from 'vue-router';
import DailyReportForm from '../components/DailyReportForm.vue';
import ReportList from '../components/ReportList.vue';
import NotFound from '../components/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect: '/form',
  },
  {
    path: '/form',
    name: 'DailyReportForm',
    meta: { title: '新增日报' },
    component: DailyReportForm,
  },
  {
    path: '/list',
    name: 'ReportList',
    meta: { title: '报告列表' },
    component: ReportList,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

console.log(import.meta.env.PROD);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.PROD ? '/Daily-Report-Form/' : '/'),
  routes,
});

export default router;
