<template>
  <n-modal
    :class="{ 'mobile-modal': isMobile }"
    :show="visible"
    :title="`工作${report?.date}日报`"
    preset="card"
    content-scrollable
    :style="{ width: isMobile ? '95%' : '60%', maxHeight: '80vh' }"
    :segmented="{ content: true }"
    @update:show="handleModalClose"
  >
    <div class="detail-modal-content">
      <div class="detail-items">
        <div v-for="(item, index) in report.items" :key="index" class="detail-item">
          <div class="item-header">
            <n-tag type="info"><span class="tag-label">项目名称：</span>{{ item.project }}</n-tag>
            <n-tag type="success"><span class="tag-label">工作类型：</span>{{ item.type }}</n-tag>
            <n-tag v-if="item.module"><span class="tag-label">所属模块：</span>{{ item.module }} </n-tag>
          </div>
          <div class="item-content-wrapper">
            <div class="item-content-label">工作内容：</div>
            <div class="item-content">
              <div v-html="getItemContent(item)"></div>
            </div>
            <n-button text size="small" @click="handleCopy(item.content)" class="copy-btn">
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </template>
              复制
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { useMessage, NTag } from 'naive-ui';
import useMobile from '@/hooks/useMobile.js';

const isMobile = useMobile();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  report: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);
const message = useMessage();

const handleModalClose = val => {
  if (!val) {
    emit('close');
  }
};

const handleCopy = content => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      message.success('复制成功');
    })
    .catch(() => {
      message.error('复制失败');
    });
};

const getItemContent = item => {
  return item.content?.replace(/\n/g, '<br>') || '';
};
</script>

<style lang="scss">
.detail-modal-content {
  background: #fff;
  border-radius: 12px;
}

.detail-date {
  font-size: 18px;
  font-weight: 600;
  color: #1a2634;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tag-label {
  font-weight: 600;
  margin-right: 4px;
}

.item-content-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 12px;
}

.item-content-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  flex-shrink: 0;
  padding-top: 2px;
}

.item-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  flex: 1;
}

.copy-btn {
  flex-shrink: 0;
  color: #64748b;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #3b82f6;
}

.mobile-modal {
  .n-card-header {
    padding: 12px;
  }
  .n-card-content {
    padding: 12px !important;
  }
}
</style>
