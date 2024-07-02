<!-- Pages/TestResults.vue -->
<template>
  <div class="test-results">
    <h1>テスト結果</h1>
    <div class="score-summary">
      <h2>総合スコア: {{ score }} / {{ questions.length }}</h2>
    </div>
    <div v-for="(question, index) in questions" :key="question.id" class="question-result">
      <h3>問題 {{ index + 1 }}: {{ question.question }}</h3>
      <div class="answer-comparison">
        <div class="user-answer">
          <h4>あなたの回答:</h4>
          <p v-if="question.type === 'single' || question.type === 'multiple'">
            {{ formatAnswer(userAnswers[question.type], question.type) }}
          </p>
          <pre v-else-if="question.type === 'code'">{{ userAnswers.code }}</pre>
          <p v-else>{{ userAnswers[question.type] }}</p>
        </div>
        <div class="correct-answer">
          <h4>正解:</h4>
          <p v-if="question.type === 'single' || question.type === 'multiple'">
            {{ formatAnswer(question.correctAnswer, question.type) }}
          </p>
          <pre v-else-if="question.type === 'code'">{{ question.correctAnswer }}</pre>
          <p v-else>{{ question.correctAnswer }}</p>
        </div>
      </div>
      <div class="result-status" :class="{ correct: isCorrect(question, userAnswers[question.type]) }">
        {{ isCorrect(question, userAnswers[question.type]) ? '正解' : '不正解' }}
      </div>
      <div class="explanation" v-if="question.explanation">
        <h4>解説:</h4>
        <p>{{ question.explanation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Question, UserAnswers } from '@/views/types';

const props = defineProps<{
  questions: Question[];
  userAnswers: UserAnswers;
  score: number;
}>();

const formatAnswer = (answer: any, type: string) => {
  if (type === 'multiple') {
    return Object.entries(answer)
      .filter(([_, isChecked]) => isChecked)
      .map(([option, _]) => option)
      .join(', ');
  }
  return answer;
};

const isCorrect = (question: Question, userAnswer: any) => {
  switch (question.type) {
    case 'single':
      return userAnswer === question.correctAnswer;
    case 'multiple':
      const selectedOptions = Object.entries(userAnswer)
        .filter(([_, isChecked]) => isChecked)
        .map(([option, _]) => option);
      return JSON.stringify(selectedOptions.sort()) === JSON.stringify(question.correctAnswer.sort());
    case 'code':
      return userAnswer.trim() === question.correctAnswer.trim();
    case 'sort':
    case 'fill_in_blank':
    case 'matching':
      return JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
    case 'free_text':
      return userAnswer.includes(question.correctAnswer);
    default:
      return false;
  }
};
</script>

<style scoped>
.test-results {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.score-summary {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.question-result {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.answer-comparison {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-answer, .correct-answer {
  width: 48%;
}

.result-status {
  font-weight: bold;
  color: #ff4444;
}

.result-status.correct {
  color: #44aa44;
}

.explanation {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>