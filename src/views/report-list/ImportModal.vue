<template>
  <n-modal :show="visible" title="导入日报" style="width: 500px" @update:show="handleModalClose">
    <div class="import-modal-content">
      <div class="form-item">
        <label class="form-label">导入格式</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" v-model="localForm.format" value="markdown" />
            <span>Markdown</span>
          </label>
          <label class="radio-item">
            <input type="radio" v-model="localForm.format" value="csv" />
            <span>CSV</span>
          </label>
          <label class="radio-item">
            <input type="radio" v-model="localForm.format" value="auto" />
            <span>自动检测</span>
          </label>
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">选择文件</label>
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInput"
            type="file"
            :accept="localForm.format === 'markdown' ? '.md' : localForm.format === 'csv' ? '.csv' : '.md,.csv'"
            class="file-input"
            @change="handleFileSelect"
          />
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 10v6M12 10l-3-3M12 10l3-3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            </svg>
          </div>
          <p class="upload-text">{{ fileName || '点击或拖拽文件到此处' }}</p>
          <p class="upload-hint">支持 .md 和 .csv 格式文件</p>
        </div>
      </div>

      <div v-if="parseResult" class="parse-result">
        <div :class="['result-icon', parseResult.success ? 'success' : 'error']">
          <svg
            v-if="parseResult.success"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p class="result-message">{{ parseResult.message }}</p>
      </div>

      <div v-if="parseResult && parseResult.success && parseResult.data" class="preview-section">
        <div class="preview-header">
          <span class="preview-title">导入预览</span>
          <span class="preview-count">共 {{ parseResult.data.length }} 条日报</span>
        </div>
        <div class="preview-content">
          <div v-for="(report, index) in parseResult.data.slice(0, 5)" :key="index" class="preview-item">
            <span class="preview-date">{{ report.date }}</span>
            <span class="preview-items">{{ report.items.length }} 条记录</span>
          </div>
          <div v-if="parseResult.data.length > 5" class="preview-more">
            ... 还有 {{ parseResult.data.length - 5 }} 条
          </div>
        </div>
      </div>

      <div class="form-actions">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :disabled="!canImport" @click="handleImport">导入</n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { importReports, detectFormat } from '@/utils/import';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['cancel', 'import']);

const fileInput = ref(null);
const localForm = reactive({
  format: 'auto',
});
const fileName = ref('');
const fileContent = ref('');
const parseResult = ref(null);

const canImport = computed(() => {
  return parseResult.value?.success && parseResult.value.data?.length > 0;
});

watch(
  () => props.visible,
  val => {
    if (val) {
      localForm.format = 'auto';
      fileName.value = '';
      fileContent.value = '';
      parseResult.value = null;
    }
  },
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDrop = event => {
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = event => {
  const files = event.target?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = async file => {
  fileName.value = file.name;

  try {
    const text = await file.text();
    console.log('🚀 ~ processFile ~ text:', text);
    fileContent.value = text;

    let format = localForm.format;
    if (format === 'auto') {
      format = detectFormat(text);
      if (!format) {
        parseResult.value = {
          success: false,
          message: '无法自动检测文件格式，请手动选择',
        };
        return;
      }
    }

    parseResult.value = importReports(text, format);
  } catch (error) {
    parseResult.value = {
      success: false,
      message: `读取文件失败：${error.message}`,
    };
  }
};

const handleModalClose = val => {
  if (!val) {
    emit('cancel');
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleImport = () => {
  if (parseResult.value?.success && parseResult.value.data) {
    emit('import', parseResult.value.data);
  }
};
</script>

<style scoped>
.import-modal-content {
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

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.file-input {
  display: none;
}

.upload-icon {
  color: #94a3b8;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 14px;
  color: #475569;
  margin: 0 0 4px 0;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.parse-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #f8fafc;
}

.result-icon {
  flex-shrink: 0;
}

.result-icon.success {
  color: #22c55e;
}

.result-icon.error {
  color: #ef4444;
}

.result-message {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.preview-section {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.preview-count {
  font-size: 12px;
  color: #94a3b8;
}

.preview-content {
  max-height: 150px;
  overflow-y: auto;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-date {
  font-size: 13px;
  color: #334155;
}

.preview-items {
  font-size: 13px;
  color: #64748b;
}

.preview-more {
  text-align: center;
  padding: 8px 0;
  font-size: 12px;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
