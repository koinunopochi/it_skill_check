<!-- CheckboxButton.vue -->
<template>
  <label class="checkbox-button">
    <input 
      type="checkbox" 
      :value="value"
      :checked="modelValue"
      @change="handleChange"
    >
    <span class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import "./checkbox-button.css";
const props = defineProps<{
  label: string;
  value: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

