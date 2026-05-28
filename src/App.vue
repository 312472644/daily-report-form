<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <div class="app-container">
        <header class="app-header" :class="{ 'is-over-header': isOverHeader }">
          <div class="header-content">
            <div class="header-left-container">
              <div class="header-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#333"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="logo-icon"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span class="logo-text">日报填报系统</span>
              </div>
              <nav class="header-nav">
                <router-link class="nav-item" active-class="active" to="/form"> 新增日报 </router-link>
                <router-link class="nav-item" active-class="active" to="/list"> 报告列表 </router-link>
              </nav>
            </div>
            <!-- <div class="header-right">
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
            </div> -->
          </div>
        </header>

        <main class="app-content">
          <router-view />
        </main>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui';
import { useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, watch, ref } from 'vue';

const router = useRouter();
const isOverHeader = ref(false);

function handleScroll() {
  isOverHeader.value = document.documentElement.scrollTop > 70;
}

function init() {
  document.addEventListener('scroll', handleScroll);
}

onMounted(() => init());
onBeforeUnmount(() => document.removeEventListener('scroll', handleScroll));

watch(
  () => router.currentRoute.value.meta.title,
  newTitle => {
    document.title = `日报填报系统 - ${newTitle}`;
  },
  { immediate: true },
);
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
  background-color: #fff;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 0 4px 1px #dadde1;
  &.is-over-header {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.1);
  }
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

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  flex-shrink: 0;
}

.header-left .logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.header-nav {
  display: flex;
  gap: 20px;
  margin-left: 20px;
}

.nav-item {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-item:hover {
  /* color: #fff; */
}

.nav-item.active {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.header-right {
  display: flex;
  gap: 16px;
}

.app-content {
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
