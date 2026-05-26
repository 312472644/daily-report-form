<template>
  <div class="daily-report-form">
    <div class="form-header">
      <h2 class="form-title">日报填报</h2>
      <p class="form-subtitle">请准确记录您今日的工作进展与投入情况。</p>
    </div>

    <n-card :bordered="false" class="form-card">
      <div class="form-body">
        <div class="form-group">
          <label class="form-label">日期</label>
          <n-date-picker v-model:value="formData.date" type="date" style="width: 100%" placeholder="选择日期" />
        </div>

        <div class="section-divider">
          <span class="divider-text">工作内容</span>
        </div>

        <div v-for="(item, index) in formData.items" :key="index" class="work-item-card">
          <n-grid :cols="4" :x-gap="16">
            <n-gi>
              <div class="work-item-field">
                <label class="field-label">项目名称</label>
                <n-select
                  v-model:value="item.project"
                  :options="projectOptions"
                  placeholder="请选择项目名称"
                  style="width: 100%"
                />
              </div>
            </n-gi>

            <n-gi>
              <div class="work-item-field">
                <label class="field-label">模块名称</label>
                <n-input v-model:value="item.module" placeholder="请输入模块名称" style="width: 100%" />
              </div>
            </n-gi>

            <n-gi>
              <div class="work-item-field">
                <label class="field-label">工作类型</label>
                <n-select
                  v-model:value="item.type"
                  :options="workTypeOptions"
                  placeholder="请选择工作类型"
                  style="width: 100%"
                />
              </div>
            </n-gi>

            <n-gi v-if="formData.items.length > 1">
              <div class="work-item-field action-field">
                <n-button type="error" @click="removeItem(index)">删除</n-button>
              </div>
            </n-gi>
          </n-grid>

          <div class="work-content-group">
            <label class="field-label">工作内容</label>
            <n-input
              v-model:value="item.content"
              type="textarea"
              :rows="3"
              placeholder="请输入工作内容"
              style="width: 100%"
            />
          </div>
        </div>

        <n-button type="dashed" block @click="addItem" style="margin-top: 16px"> + 新增工作项 </n-button>
      </div>

      <div class="form-footer">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="saveReport" :loading="loading"> 保存日报 </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { saveReport as saveReportDB, getReport as getReportDB } from '../utils/db';
import { projectOptions, workTypeOptions } from '../data/options';
import dayjs from 'dayjs';

const message = useMessage();

const props = defineProps({
  date: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['saved']);

const loading = ref(false);
const formData = reactive({
  date: props.date ? dayjs(props.date).valueOf() : dayjs().valueOf(),
  items: [{ project: '', module: '', type: '', content: '' }],
});

const formattedDate = computed(() => {
  return dayjs(formData.date).format('YYYY-MM-DD');
});

watch(
  () => props.date,
  newDate => {
    if (newDate) {
      formData.date = dayjs(newDate).valueOf();
      loadReport();
    }
  },
);

const addItem = () => {
  formData.items.push({ project: '', module: '', type: '', content: '' });
};

const removeItem = index => {
  formData.items.splice(index, 1);
};

const handleCancel = () => {
  formData.items = [{ project: '', module: '', type: '', content: '' }];
};

const validateForm = () => {
  if (!formData.date) {
    message.error('请选择日期');
    return false;
  }

  for (let i = 0; i < formData.items.length; i++) {
    const item = formData.items[i];
    if (!item.project) {
      message.error(`第${i + 1}项工作内容：请选择项目名称`);
      return false;
    }
    if (!item.type) {
      message.error(`第${i + 1}项工作内容：请选择工作类型`);
      return false;
    }
    if (!item.content.trim()) {
      message.error(`第${i + 1}项工作内容：请输入工作内容`);
      return false;
    }
  }
  return true;
};

const saveReport = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const report = {
      date: dayjs(formData.date).format('YYYY-MM-DD'),
      items: formData.items.map(item => ({
        project: item.project,
        module: item.module,
        type: item.type,
        content: item.content,
      })),
    };

    await saveReportDB(report);
    message.success('日报保存成功');
    emit('saved');
  } catch (error) {
    message.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

const loadReport = async () => {
  const dateStr = dayjs(formData.date).format('YYYY-MM-DD');
  const report = await getReportDB(dateStr);
  if (report) {
    formData.items = report.items.map(item => ({ ...item }));
  } else {
    formData.items = [{ project: '', module: '', type: '', content: '' }];
  }
};

onMounted(() => {
  loadReport();
});
</script>

<style scoped>
.daily-report-form {
  width: 100%;
}

.form-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-header {
  margin-bottom: 24px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a2634;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.form-body {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.section-divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.divider-text {
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.work-item-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.work-item-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 6px;
}

.action-field {
  justify-content: flex-end;
}

.work-content-group {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
</style>
