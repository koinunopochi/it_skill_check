<template>
  <div class="sort-options">
    <div
      v-for="(option, index) in sortedOptions"
      :key="index"
      draggable="true"
      @dragstart="dragStart($event, index)"
      @dragover.prevent
      @drop="drop($event, index)"
      class="sort-item"
    >
      {{ option }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import "./sort.scss";

interface Props {
  options: string[];
  modelValue: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const sortedOptions = ref<string[]>([]);

watch(() => props.options, (newOptions) => {
  sortedOptions.value = [...newOptions];
}, { immediate: true });

function dragStart(e: DragEvent, index: number) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', index.toString());
  }
}

function drop(e: DragEvent, dropIndex: number) {
  const dragIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1');
  if (dragIndex !== -1 && dragIndex !== dropIndex) {
    const newSortedOptions = [...sortedOptions.value];
    const [removed] = newSortedOptions.splice(dragIndex, 1);
    newSortedOptions.splice(dropIndex, 0, removed);
    sortedOptions.value = newSortedOptions;
    emit('update:modelValue', newSortedOptions);
  }
}
</script>