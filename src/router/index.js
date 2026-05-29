import { createRouter, createWebHashHistory } from 'vue-router';
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
    component: () => import('@/views/daily-report-form/index.vue'),
  },
  {
    path: '/list',
    name: 'ReportList',
    meta: { title: '日报记录' },
    component: () => import('@/views/report-list/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { hidden: true },
    component: () => import('@/components/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
