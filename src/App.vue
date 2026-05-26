<template>
  <n-message-provider>
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="header-left-container">
            <div class="header-left">
              <span class="logo-text">日报填报系统</span>
            </div>
            <nav class="header-nav">
              <button class="nav-item" :class="{ active: currentPage === 'form' }" @click="currentPage = 'form'">
                新增日报
              </button>
              <button class="nav-item" :class="{ active: currentPage === 'list' }" @click="currentPage = 'list'">
                报告列表
              </button>
            </nav>
          </div>
          <div class="header-right">
            <button class="icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button class="icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main class="app-content">
        <DailyReportForm v-if="currentPage === 'form'" :key="formKey" :date="editDate" @saved="handleSaved" />
        <ReportList v-if="currentPage === 'list'" ref="reportListRef" @edit="handleEdit" />
      </main>
    </div>
  </n-message-provider>
</template>

<script setup>
import { ref } from 'vue';
import DailyReportForm from './components/DailyReportForm.vue';
import ReportList from './components/ReportList.vue';

const currentPage = ref('form');
const editDate = ref('');
const formKey = ref(0);
const reportListRef = ref(null);

const handleSaved = () => {
  if (reportListRef.value) {
    reportListRef.value.refresh();
  }
};

const handleEdit = date => {
  editDate.value = date;
  formKey.value++;
  currentPage.value = 'form';
};
</script>

<style scoped>
.app-container {
  height: 100%;
  background-color: #f5f7fa;
}

.app-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 60px;
  background-color: #1a2634;
  color: #fff;
}

.header-content {
  max-width: 1400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left-container {
  display: flex;
  align-items: center;
}

.header-left .logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.header-nav {
  display: flex;
  gap: 20px;
  margin-left: 20px;
}

.nav-item {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #fff;
}

.nav-item.active {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.header-right {
  display: flex;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.app-content {
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
