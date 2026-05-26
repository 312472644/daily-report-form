<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6" />
          <path d="M9 9l6 6" />
        </svg>
      </div>
      <h1 class="not-found-title">404</h1>
      <p class="not-found-text">页面未找到</p>
      <p class="not-found-desc">您访问的页面不存在，请检查地址是否正确</p>
      <n-button type="primary" @click="goHome">返回首页</n-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.not-found-icon {
  margin-bottom: 20px;
  color: #94a3b8;
}

.not-found-title {
  font-size: 72px;
  font-weight: 700;
  color: #1a2634;
  margin: 0 0 16px 0;
}

.not-found-text {
  font-size: 20px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 8px 0;
}

.not-found-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 32px 0;
}
</style>
