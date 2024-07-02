<!-- ExplanationPage.vue -->
<template>
  <div class="explanation-page">
    <h1>{{ meta.title }}</h1>
    <div class="instructions">
      <h2>テスト説明</h2>
      <p>{{ meta.description }}</p>
      <h3>指示事項:</h3>
      <ul>
        <li v-for="(instruction, index) in meta.instructions" :key="index">
          {{ instruction }}
        </li>
      </ul>
      <h3>ルール:</h3>
      <ul>
        <li v-for="(rule, index) in meta.rules" :key="index">
          {{ rule }}
        </li>
      </ul>
      <h3>採点方法:</h3>
      <ul>
        <li v-for="(scoringInfo, index) in meta.scoring" :key="index">
          {{ scoringInfo }}
        </li>
      </ul>
      <h3>必要条件:</h3>
      <ul>
        <li v-for="(requirement, index) in meta.requirements" :key="index">
          {{ requirement }}
        </li>
      </ul>
      <p class="contact-info">{{ meta.contact }}</p>
    </div>
    <Button
      :primary="true"
      @click="$emit('start-test')"
      label="テスト開始"
      :square="true"
      background-color="#3a75ff"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import Button from '@/stories/Bases/Buttons/Button.vue';
import type { Meta } from '@/views/types';

defineProps<{
  meta: Meta;
}>();

defineEmits<{
  (e: 'start-test'): void;
}>();
</script>

<style scoped>
.explanation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.instructions {
  margin-bottom: 20px;
}

.contact-info {
  font-style: italic;
  margin-top: 20px;
}
</style>