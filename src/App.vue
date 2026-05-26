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
              <router-link class="nav-item" active-class="active" to="/form"> 新增日报 </router-link>
              <router-link class="nav-item" active-class="active" to="/list"> 报告列表 </router-link>
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
        <router-view />
      </main>
    </div>
  </n-message-provider>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();

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
  text-decoration: none;
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
