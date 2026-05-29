<template>
  <n-modal :show="visible" title="导出日报" style="width: 450px" @update:show="handleModalClose">
    <div class="export-modal-content">
      <div class="form-item">
        <label class="form-label">导出格式</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" v-model="localForm.format" value="markdown" />
            <span>Markdown</span>
          </label>
          <label class="radio-item">
            <input type="radio" v-model="localForm.format" value="csv" />
            <span>CSV</span>
          </label>
        </div>
      </div>
      <div class="form-item">
        <label class="form-label">导出范围</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" v-model="localForm.range" value="all" />
            <span>全部日报</span>
          </label>
          <label class="radio-item">
            <input type="radio" v-model="localForm.range" value="selected" />
            <span>按日期范围导出</span>
          </label>
        </div>
      </div>
      <div v-if="localForm.range === 'selected'" class="form-item">
        <label class="form-label">选择日期范围</label>
        <n-date-picker
          v-model:value="localForm.dateRange"
          type="daterange"
          style="width: 100%"
          placeholder="选择日期范围"
        />
      </div>
      <div class="form-actions">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleExport">导出</n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['cancel', 'export']);

const localForm = reactive({
  format: 'markdown',
  range: 'all',
  dateRange: null,
});

watch(
  () => props.visible,
  val => {
    if (val) {
      localForm.format = 'markdown';
      localForm.range = 'all';
      localForm.dateRange = null;
    }
  },
);

const handleModalClose = val => {
  if (!val) {
    emit('cancel');
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleExport = () => {
  emit('export', { ...localForm });
};
</script>

<style scoped>
.export-modal-content {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.radio-group {
  display: flex;
  gap: 24px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
