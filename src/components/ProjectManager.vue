<template>
  <n-modal :show="visible" title="管理自定义项目" style="width: 450px" @update:show="handleClose">
    <div class="project-manager-content">
      <div class="form-item">
        <label class="form-label">新增项目</label>
        <div class="add-project-row">
          <n-input
            v-model:value="newProjectName"
            placeholder="输入新项目名称"
            style="flex: 1"
            @keyup.enter="addProject"
          />
          <n-button type="primary" @click="addProject" style="margin-left: 8px"> 添加 </n-button>
        </div>
      </div>

      <div class="divider"></div>

      <div v-if="projects.length === 0" class="empty-state">
        <p>暂无自定义项目</p>
        <p class="empty-desc">您可以在上方输入新项目名称进行添加</p>
      </div>
      <div v-else class="project-list">
        <div v-for="project in projects" :key="project" class="project-item">
          <span class="project-name">{{ project }}</span>
          <n-button size="small" type="error" text @click="removeProject(project)"> 删除 </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  projects: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'add', 'remove']);

const message = useMessage();
const newProjectName = ref('');

const handleClose = val => {
  if (!val) {
    newProjectName.value = '';
    emit('close');
  }
};

const addProject = () => {
  const name = newProjectName.value.trim();
  if (!name) {
    message.warning('请输入项目名称');
    return;
  }
  if (props.projects.includes(name)) {
    message.warning('项目已存在');
    return;
  }
  emit('add', name);
  newProjectName.value = '';
  message.success(`已添加项目: ${name}`);
};

const removeProject = projectName => {
  emit('remove', projectName);
};
</script>

<style scoped>
.project-manager-content {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.add-project-row {
  display: flex;
  gap: 8px;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-desc {
  font-size: 14px;
  color: #94a3b8;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.project-name {
  font-size: 14px;
  color: #334155;
}
</style>
