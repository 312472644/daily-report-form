<template>
  <NModal
    :show="visible"
    @update:show="$emit('update:visible', $event)"
    title="修改日报日期"
    :style="{ width: isMobile ? '95%' : '450px' }"
    preset="card"
  >
    <div class="change-date-modal">
      <p class="modal-desc">
        当前日报日期：<strong>{{ report?.date }}</strong>
      </p>
      <div style="margin: 12px 0">
        <NForm :model="{ date: newDate }" label-placement="left" label-width="100px">
          <NFormItem label="新日期" path="date" required>
            <NDatePicker v-model:value="newDate" type="date" style="width: 100%" placeholder="请选择新日期" />
          </NFormItem>
        </NForm>
      </div>
      <div class="modal-actions" style="display: flex; justify-content: flex-end">
        <NButton @click="$emit('update:visible', false)" style="margin-right: 12px">取消</NButton>
        <NButton type="primary" @click="handleConfirm">确认修改</NButton>
      </div>
    </div>
  </NModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { NModal, NForm, NFormItem, NDatePicker, NButton } from 'naive-ui';
import dayjs from 'dayjs';
import useMobile from '@/hooks/useMobile';

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

const isMobile = useMobile();

const emit = defineEmits(['confirm', 'update:visible']);

const newDate = ref(null);

watch(
  () => props.visible,
  val => {
    if (val && props.report) {
      newDate.value = dayjs(props.report.date);
    }
  },
);

const handleConfirm = () => {
  if (!newDate.value) return;
  emit('confirm', dayjs(newDate.value).format('YYYY-MM-DD'));
};
</script>

<style scoped>
.change-date-modal {
  padding: 8px 0;

  .modal-desc {
    margin-bottom: 16px;
    font-size: 15px;
    color: #333;
  }

  .modal-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }
}
</style>
