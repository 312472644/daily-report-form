<template>
  <div class="report-list">
    <div class="page-header">
      <h1 class="page-title">日报列表</h1>
      <p class="page-subtitle">查看并管理您的历史日报记录。</p>
    </div>

    <div class="stats-cards">
      <div class="stat-card light-blue">
        <div class="stat-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">本月出勤</span>
          <span class="stat-value">{{ currentMonthDays }}天</span>
        </div>
      </div>

      <div class="stat-card light-cyan">
        <div class="stat-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">当月已报</span>
          <span class="stat-value">{{ pendingDays }}篇</span>
        </div>
      </div>

      <div class="stat-card light-red">
        <div class="stat-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">累计报告</span>
          <span class="stat-value">{{ reports.length }}篇</span>
        </div>
      </div>
    </div>

    <div class="search-card">
      <n-form :model="searchForm" label-placement="top">
        <n-grid :cols="5" :x-gap="16" :y-gap="16">
          <n-gi>
            <n-form-item label="日期范围">
              <n-date-picker
                clearable
                v-model:value="searchForm.dateRange"
                type="daterange"
                style="width: 100%"
                placeholder="选择日期范围"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="项目名称">
              <n-select
                v-model:value="searchForm.project"
                :options="projectOptions"
                placeholder="请选择项目名称"
                clearable
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="工作类型">
              <n-select
                v-model:value="searchForm.workType"
                :options="workTypeOptions"
                placeholder="请选择工作类型"
                clearable
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="关键字搜索">
              <n-input v-model:value="searchForm.keyword" placeholder="请输入关键字" clearable />
            </n-form-item>
          </n-gi>
          <n-gi>
            <div class="search-actions">
              <n-button type="primary">
                <template #icon>
                  <n-icon><Search /></n-icon>
                </template>
                <span>查询</span>
              </n-button>
              <n-button @click="reset">
                <template #icon>
                  <n-icon><Reset /></n-icon>
                </template>
                <span>重置</span>
              </n-button>
            </div>
          </n-gi>
        </n-grid>
      </n-form>
    </div>

    <div class="list-container">
      <div class="list-header">
        <n-button type="primary" @click="showExportModal = true">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </template>
          导出日报
        </n-button>
        <span class="record-count">共 {{ filteredReports.length }} 条记录</span>
      </div>

      <div ref="tableContainerRef" class="table-container">
        <n-spin :show="showLoading">
          <n-data-table
            bottom-bordered
            :columns="columns"
            :max-height="tableMaxHeight + 'px'"
            :data="filteredReports"
            :row-key="row => row.date"
          >
            <template #empty>
              <div class="empty-content">
                <img :src="EmptySvg" alt="暂无数据" />
                <span>暂无数据</span>
              </div>
            </template>
          </n-data-table>
        </n-spin>
      </div>
    </div>

    <DetailModal :visible="showDetailModal" :report="selectedReport" @close="showDetailModal = false" />
    <ExportModal :visible="showExportModal" @cancel="showExportModal = false" @export="handleExport" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, h } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { useRouter } from 'vue-router';
import { getAllReports, deleteReport as deleteReportDB } from '../utils/db';
import { exportToMarkdown, exportToCSV } from '../utils/export';
import DetailModal from './DetailModal.vue';
import ExportModal from './ExportModal.vue';
import { projectOptions, workTypeOptions } from '../data/options';
import dayjs from 'dayjs';
import { NButton, NTag } from 'naive-ui';
import { Search, Reset } from '@vicons/carbon';
import { workTypeTagMap } from '../data/options';
import EmptySvg from '@/assets/images/empty.svg';

const message = useMessage();
const router = useRouter();
const dialog = useDialog();
const showLoading = ref(false);
const tableContainerRef = ref(null);
const tableMaxHeight = ref(0);

const reports = ref([]);
const showDetailModal = ref(false);
const showExportModal = ref(false);
const selectedReport = ref(null);

const searchForm = reactive({
  dateRange: null,
  project: null,
  workType: null,
  keyword: '',
});

const columns = [
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
    render: (_, index) => index + 1,
  },
  {
    title: '填报日期',
    key: 'date',
    width: 120,
    align: 'center',
    render: row => {
      const reportDate = dayjs(row.date);
      const today = dayjs().startOf('day');
      const isFuture = reportDate.isAfter(today) || reportDate.isSame(today);
      return h('div', { class: isFuture ? 'is-future' : '' }, [
        isFuture ? h(NTag, { type: 'success' }, () => row.date) : h('span', {}, row.date),
      ]);
    },
  },
  {
    title: '项目名称',
    key: 'projects',
    align: 'center',
    render: row => getProjectSummary(row),
  },
  {
    title: '工作类型',
    key: 'type',
    render: row => getType(row),
  },
  {
    title: '工作项数量',
    key: 'count',
    width: 150,
    align: 'center',
    render: row => row.items.length,
  },
  {
    title: '是否为工作日',
    key: 'isWorkDay',
    align: 'center',
    width: 140,
    render: row =>
      dayjs(row.date).day() !== 0 && dayjs(row.date).day() !== 6
        ? h(NTag, { type: 'success' }, () => '是')
        : h(NTag, { type: 'error' }, () => '否'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    align: 'center',
    render: row =>
      h('div', { class: 'actions' }, [
        h(
          NButton,
          {
            class: 'action-btn',
            text: true,
            onClick: () => viewDetail(row),
          },
          () => '查看',
        ),
        h(
          NButton,
          {
            class: 'action-btn',
            text: true,
            type: 'info',
            onClick: () => editReport(row),
          },
          () => '编辑',
        ),
        h(
          NButton,
          {
            class: 'action-btn',
            text: true,
            type: 'error',
            onClick: () => deleteReport(row),
          },
          () => '删除',
        ),
      ]),
  },
];

const currentMonthDays = computed(() => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}`, 'YYYY-M').daysInMonth();
  let workDays = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = dayjs(`${currentYear}-${currentMonth + 1}-${i}`, 'YYYY-M-D').day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workDays++;
    }
  }
  return workDays;
});

const pendingDays = computed(() => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  return reports.value.filter(r => {
    const date = dayjs(r.date);
    return date.month() === currentMonth && date.year() === currentYear;
  }).length;
});

const filteredReports = computed(() => {
  showLoading.value = true;
  let result = [...reports.value].filter(r => r && r.items && Array.isArray(r.items));

  if (searchForm.dateRange && Array.isArray(searchForm.dateRange) && searchForm.dateRange.length === 2) {
    const startDate = dayjs(searchForm.dateRange[0]).format('YYYY-MM-DD');
    const endDate = dayjs(searchForm.dateRange[1]).format('YYYY-MM-DD');
    result = result.filter(r => r.date >= startDate && r.date <= endDate);
  }

  if (searchForm.project) {
    result = result.filter(r => r.items.some(item => item.project === searchForm.project));
  }

  if (searchForm.workType) {
    result = result.filter(r => r.items.some(item => item.type === searchForm.workType));
  }

  if (searchForm.keyword) {
    const keyword = searchForm.keyword.toLowerCase();
    result = result.filter(r =>
      r.items.some(
        item =>
          item.content.toLowerCase().includes(keyword) ||
          item.project.toLowerCase().includes(keyword) ||
          (item.module && item.module.toLowerCase().includes(keyword)),
      ),
    );
  }

  setTimeout(() => {
    showLoading.value = false;
  }, 500);
  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const getType = record => {
  return h(
    'div',
    { class: 'type' },
    Array.from(new Set(record.items.map(item => item.type))).map(type =>
      h(NTag, { class: 'type-tag-item', type: workTypeTagMap[type].tagType }, () => type),
    ),
  );
};

const getProjectSummary = record => {
  const projects = [...new Set(record.items.map(item => item.project))];
  return projects.join('，');
};

const reset = () => {
  searchForm.dateRange = null;
  searchForm.project = null;
  searchForm.workType = null;
  searchForm.keyword = null;
};

const viewDetail = record => {
  selectedReport.value = record;
  showDetailModal.value = true;
};

const editReport = record => {
  router.push({ path: '/form', query: { date: record.date } });
};

const deleteReport = async record => {
  dialog.info({
    title: '确认',
    content: `你确定删除 ${record.date} 的日报吗？`,
    positiveText: '确定',
    negativeButtonProps: {
      type: 'info',
    },
    negativeText: '取消',
    draggable: false,
    onPositiveClick: async () => {
      try {
        await deleteReportDB(record.date);
        await loadReports();
        message.success('删除成功');
      } catch (error) {
        message.error('删除失败');
      }
    },
  });
};

const handleExport = formData => {
  let exportReports = [...filteredReports.value];

  if (formData.range === 'selected' && Array.isArray(formData.dateRange)) {
    const startDate = dayjs(formData.dateRange[0]).format('YYYY-MM-DD');
    const endDate = dayjs(formData.dateRange[1]).format('YYYY-MM-DD');
    exportReports = exportReports.filter(r => r.date >= startDate && r.date <= endDate);
  }

  if (exportReports.length === 0) {
    message.warning('没有符合条件的日报数据');
    return;
  }

  if (formData.format === 'markdown') {
    exportToMarkdown(exportReports);
  } else {
    exportToCSV(exportReports);
  }

  showExportModal.value = false;
  message.success('导出成功');
};

const loadReports = async () => {
  reports.value = await getAllReports();
};

const calculateTableHeight = () => {
  if (!tableContainerRef.value) {
    return;
  }
  const container = tableContainerRef.value;
  const rect = container.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const containerTop = rect.top;
  const containerBottomMargin = 120;
  const calculatedHeight = viewportHeight - containerTop - containerBottomMargin;
  tableMaxHeight.value = calculatedHeight;
};

onMounted(async () => {
  await loadReports();
  calculateTableHeight();
  window.addEventListener('resize', calculateTableHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateTableHeight);
});

defineExpose({
  refresh: loadReports,
});
</script>

<style lang="scss">
.report-list {
  width: 100%;
  .page-header {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a2634;
    margin: 0 0 8px 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-radius: 12px;
  }

  .stat-card.light-blue {
    background: linear-gradient(135deg, #667eea 0%, #8b5cf6 100%);
    color: #fff;
  }

  .stat-card.light-cyan {
    background: linear-gradient(135deg, #06b6d4 0%, #22c55e 100%);
    color: #fff;
  }

  .stat-card.light-red {
    background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
    color: #fff;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.2);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }

  .search-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .type-tag-item {
    & + .type-tag-item {
      margin-left: 8px;
    }
  }

  .search-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .list-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .record-count {
    font-size: 14px;
    color: #64748b;
  }

  .table-container {
    padding: 20px;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    font-size: 14px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px 0;
    transition: color 0.3s ease;
    & + .action-btn {
      margin-left: 4px;
    }
  }

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #999;
  }
}
</style>
