<!-- RadioButton.vue -->
<template>
  <label class="radio-button">
    <input 
      type="radio" 
      :value="value" 
      :name="name" 
      :checked="modelValue === value"
      @change="handleChange"
    >
    <span class="radio-label">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import "./radio-button.css";
const props = defineProps<{
  label: string;
  value: string;
  name: string;
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    emit('update:modelValue', props.value);
  }
};
</script>
