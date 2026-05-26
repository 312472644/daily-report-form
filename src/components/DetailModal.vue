<template>
  <n-modal :show="visible" title="日报详情" style="width: 600px" @update:show="handleModalClose">
    <div v-if="report" class="detail-modal-content">
      <div class="detail-date">{{ report.date }} 工作日报</div>
      <div class="detail-items">
        <div v-for="(item, index) in report.items" :key="index" class="detail-item">
          <div class="item-header">
            <span class="item-tag">{{ item.project }}</span>
            <span class="item-tag">{{ item.type }}</span>
            <span v-if="item.module" class="item-tag">{{ item.module }}</span>
          </div>
          <div class="item-content">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
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

const handleModalClose = val => {
  if (!val) {
    emit('close');
  }
};
</script>

<style scoped>
.detail-modal-content {
  padding: 16px;
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

.item-tag {
  padding: 4px 10px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 4px;
  font-size: 12px;
}

.item-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}
</style>
