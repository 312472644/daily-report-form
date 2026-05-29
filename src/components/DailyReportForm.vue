<template>
  <div class="daily-report-form">
    <div class="form-header">
      <h2 class="form-title">日报填报</h2>
      <p class="form-subtitle">请准确记录您今日的工作进展与投入情况。</p>
    </div>

    <n-spin :show="showLoading" description="加载中...">
      <n-card :bordered="false" class="form-card">
        <div class="form-body">
          <div class="form-group">
            <label class="form-label">日期</label>
            <n-date-picker
              v-model:value="formData.date"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              @update:value="handleChangeDate"
            />
          </div>

          <div class="section-divider">
            <span class="divider-text">工作内容</span>
          </div>

          <div v-for="(item, index) in formData.items" :key="index" class="work-item-card">
            <n-grid cols="4 xs:1 m:3 l:3" :x-gap="16" responsive="screen">
              <n-gi>
                <div class="work-item-field">
                  <div class="field-header">
                    <label class="field-label required">项目名称</label>
                    <n-button
                      v-if="index === 0"
                      size="small"
                      text
                      @click="showProjectManager = true"
                      class="manage-btn"
                    >
                      管理项目
                    </n-button>
                  </div>
                  <n-select
                    v-model:value="item.project"
                    placeholder="请选择或输入项目名称"
                    :options="localProjectOptions"
                    style="width: 100%"
                    @update:value="val => handleUpdateValue(val, item)"
                  />
                </div>
              </n-gi>

              <n-gi>
                <div class="work-item-field">
                  <label class="field-label required">工作类型</label>
                  <n-select
                    v-model:value="item.type"
                    :options="workTypeOptions"
                    placeholder="请选择工作类型"
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

              <n-gi v-if="formData.items.length > 1" style="display: flex">
                <div class="work-item-field action-field">
                  <n-button type="error" @click="removeItem(index)" dashed>删除</n-button>
                </div>
              </n-gi>
            </n-grid>

            <div class="work-content-group">
              <label class="field-label">工作内容</label>
              <n-input
                v-model:value="item.content"
                type="textarea"
                :maxlength="500"
                show-count
                :autosize="{
                  minRows: 5,
                  maxRows: 10,
                }"
                placeholder="请输入工作内容"
                style="width: 100%"
              />
            </div>
          </div>

          <n-button dashed type="primary" size="large" block @click="addItem" style="margin-top: 16px">
            <template #icon>
              <n-icon><AddAlt /></n-icon>
            </template>
            <span>新增工作项</span>
          </n-button>
        </div>

        <div class="form-footer">
          <n-button @click="handleCancel" size="large">
            <template #icon>
              <n-icon><Reset /></n-icon>
            </template>
            <span>重置</span>
          </n-button>
          <n-button type="primary" @click="saveReport" :loading="loading" size="large" :icon="Save">
            <template #icon>
              <n-icon><Save /></n-icon>
            </template>
            <span>保存日报</span>
          </n-button>
        </div>
      </n-card>
    </n-spin>

    <ProjectManager
      :visible="showProjectManager"
      :projects="customProjects"
      @close="showProjectManager = false"
      @add="handleAddProject"
      @remove="handleRemoveProject"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { saveReport as saveReportDB, getReport as getReportDB } from '../utils/db';
import { projectOptions as defaultProjectOptions, workTypeOptions } from '../data/options';
import dayjs from 'dayjs';
import ProjectManager from './ProjectManager.vue';
import { useRoute } from 'vue-router';
import { Save, Reset, AddAlt } from '@vicons/carbon';

const emit = defineEmits(['saved']);
const message = useMessage();
const dialog = useDialog();
const route = useRoute();
const showProjectManager = ref(false);
const loading = ref(false);
const showLoading = ref(false);
const customProjects = ref([]);

const localProjectOptions = computed(() => {
  return [
    ...defaultProjectOptions,
    ...customProjects.value.map(project => ({
      value: project,
      label: project,
    })),
  ];
});

const formData = reactive({
  date: route.query.date ? dayjs(route.query.date).valueOf() : dayjs().valueOf(),
  items: [{ project: null, module: '', type: null, content: '' }],
});

const loadCustomProjects = () => {
  try {
    const saved = localStorage.getItem('customProjects');
    if (saved) {
      customProjects.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('加载自定义项目失败:', e);
  }
};

// 新增工作项
const addItem = () => {
  formData.items.push({ project: null, module: '', type: null, content: '' });
};

const handleAddProject = projectName => {
  customProjects.value.push(projectName);
  localStorage.setItem('customProjects', JSON.stringify(customProjects.value));
};

const handleRemoveProject = projectName => {
  const index = customProjects.value.indexOf(projectName);
  if (index > -1) {
    customProjects.value.splice(index, 1);
    localStorage.setItem('customProjects', JSON.stringify(customProjects.value));
    message.success(`已删除项目: ${projectName}`);
  }
};

const removeItem = index => {
  formData.items.splice(index, 1);
};

const handleCancel = () => {
  formData.items = [{ project: null, module: '', type: null, content: '' }];
};

const handleChangeDate = val => {
  loadReport();
};

const handleUpdateValue = (val, item) => {
  item.project = null;
  // 校验当前日期是否有相同项目名称
  const existingProject = formData.items.find(t => t.project === val);
  if (existingProject) {
    message.error(`项目名称 ${val} 已存在`);
    item.project = null;
  } else {
    item.project = val;
  }
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

const isValidSubmit = async () => {
  if (!validateForm()) return false;

  const date = dayjs(formData.date);
  const dayOfWeek = date.day();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const isConfirmed = await new Promise(resolve => {
      dialog.info({
        title: '确认保存',
        content: `您选择的日期 【${date.format('YYYY年MM月DD日')}】 是${dayOfWeek === 0 ? '周日' : '周六'}，确定要保存吗？`,
        negativeButtonProps: {
          type: 'info',
        },
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => resolve(true),
        onNegativeClick: () => resolve(false),
      });
    });

    if (!isConfirmed) {
      return false;
    }
  }

  return true;
};

const saveReport = async () => {
  if (!(await isValidSubmit())) return;
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
    console.error('保存日报失败:', error);
    message.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

const loadReport = async () => {
  showLoading.value = true;
  try {
    const currentDate = dayjs(formData.date).format('YYYY-MM-DD');
    // 从数据库加载日报
    const report = await getReportDB(currentDate);
    if (report) {
      formData.date = dayjs(report.date).valueOf();
      formData.items = report.items;
    } else {
      formData.items = [{ project: null, module: '', type: null, content: '' }];
    }
  } finally {
    setTimeout(() => (showLoading.value = false), 1 * 1000);
  }
};

onMounted(() => {
  loadCustomProjects();
  loadReport();
});
</script>

<style lang="scss">
.daily-report-form {
  width: 100%;
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
    padding-bottom: 24px;
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
    margin: -24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    z-index: 100;
  }

  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .manage-btn {
    color: #10b981;
  }
  .required {
    position: relative;
    padding-left: 10px;
    &::after {
      content: '*';
      position: absolute;
      top: 0;
      left: 0;
      font-size: 12px;
      font-weight: 500;
      color: #d03050;
    }
  }

  @media screen and (max-width: 768px) {
    .form-header {
      margin-bottom: 16px;
    }

    .form-title {
      font-size: 18px;
    }

    .form-subtitle {
      font-size: 12px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      font-size: 13px;
    }

    .work-item-card {
      padding: 12px;
      margin-bottom: 12px;
    }

    .work-item-field {
      margin-bottom: 12px;
    }

    .field-header {
      gap: 8px;
    }

    .field-label {
      font-size: 12px;
    }

    .manage-btn {
      font-size: 11px;
      padding: 4px 8px;
    }

    .actions {
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
