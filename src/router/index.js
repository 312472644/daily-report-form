import { createRouter, createWebHashHistory } from 'vue-router';
import DailyReportForm from '../components/DailyReportForm.vue';
import ReportList from '../components/ReportList.vue';
import NotFound from '../components/NotFound.vue';

export const routes = [
  {
    path: '/',
    redirect: '/form',
    meta: { hidden: true },
  },
  {
    path: '/form',
    name: 'DailyReportForm',
    meta: { title: '日报填写' },
    component: DailyReportForm,
  },
  {
    path: '/list',
    name: 'ReportList',
    meta: { title: '日报记录' },
    component: ReportList,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { hidden: true },
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
