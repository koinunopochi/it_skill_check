<template>
  <div class="timer" :class="{ 'timer--warning': isWarning, 'timer--danger': isDanger }">
    残り時間: {{ formattedTime }}
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import "./timer.scss";

interface Props {
  duration: number; // 秒単位での試験時間
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'time-up': [],
  'half-time': [],
  'one-minute-left': []
}>();


const remainingTime = ref(props.duration);
const isWarning = ref(false);
const isDanger = ref(false);

const formattedTime = computed(() => {
  const hours = Math.floor(remainingTime.value / 3600);
  const minutes = Math.floor((remainingTime.value % 3600) / 60);
  const seconds = remainingTime.value % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
      
      if (remainingTime.value === Math.floor(props.duration / 2)) {
        emit('half-time');
      }
      
      if (remainingTime.value === 60) {
        emit('one-minute-left');
      }
    } else {
      clearInterval(intervalId);
      emit('time-up');
    }
  }, 1000);
});

onUnmounted(() => {
  window.clearInterval(intervalId);
});
</script>