<!-- TextInput.vue -->
<template>
  <div class="text-input">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
    >
  </div>
</template>

<script lang="ts" setup>
import "./text-input.css";
const props = defineProps<{
  id: string;
  label?: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>