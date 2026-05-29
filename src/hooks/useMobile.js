import { ref, onMounted, onUnmounted } from 'vue';
import { isMobile as checkIsMobile } from '@/utils/index.js';

/**
 * 检查是否为移动端
 * @returns {boolean} 是否为移动端
 */
export default function useMobile() {
  const isMobile = ref(false);

  function handleResize() {
    isMobile.value = checkIsMobile();
  }

  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return isMobile;
}
