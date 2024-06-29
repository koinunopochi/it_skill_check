<template>
  <button type="button" :class="classes" @click="onClick" :style="style">{{ label }}</button>
</template>

<script lang="ts" setup>
import './button.css';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  /**
   * ボタンのラベル
   */
  label: string,
  /**
   * プライマリーボタンかセカンダリーボタンか
   */
  primary?: boolean,
  /**
   * ボタンのサイズ
   */
  size?: 'small' | 'medium' | 'large',
  /**
   * ボタンの背景色
   */
  backgroundColor?: string,
  /**
   * 四角めのスタイルを適用するかどうか
   */
  square?: boolean,
}>(), { primary: false, square: false });

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const classes = computed(() => ({
  'storybook-button': true,
  'storybook-button--primary': props.primary,
  'storybook-button--secondary': !props.primary,
  [`storybook-button--${props.size || 'medium'}`]: true,
  'storybook-button--square': props.square,
}));

const style = computed(() => ({
  backgroundColor: props.backgroundColor
}));

const onClick = () => {
  emit("click", 1)
};
</script>