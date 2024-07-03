<!-- HomeView.vue -->
<template>
  <main class="skill-check">
      <ExplanationPage
      v-if="!testStarted"
      :meta="meta"
      @start-test="startTest"
    />
    <div v-if="!showResults && testStarted">
      <h1>{{ meta.title }}</h1>
      <Timer
        :key="timerKey"
        :duration="meta.limitTime"
        @time-up="submitTest"
        @half-time="handleHalfTime"
        @one-minute-left="handleOneMinuteLeft"
      />

      <div v-if="currentQuestion" class="question">
        <h2>問題 {{ currentQuestionIndex + 1 }}:</h2>
        <p>{{ currentQuestion.question }}</p>

        <!-- Single choice question -->
        <div v-if="currentQuestion.type === 'single'" class="options">
          <RadioButton
            v-for="option in currentQuestion.options"
            :key="option"
            :label="option"
            :value="option"
            :name="'question-' + currentQuestion.id"
            v-model="userAnswers.single"
          />
        </div>

        <!-- Multiple choice question -->
        <div v-else-if="currentQuestion.type === 'multiple'" class="options">
          <CheckboxButton
            v-for="option in currentQuestion.options"
            :key="option"
            :label="option"
            :value="option"
            v-model="userAnswers.multiple[option]"
          />
        </div>

        <!-- Code question -->
        <div v-else-if="currentQuestion.type === 'code'" class="code-input">
          <TextInput
            :id="'code-input-' + currentQuestion.id"
            v-model="userAnswers.code"
            type="textarea"
            rows="5"
            placeholder="コードを入力してください"
          />
        </div>

        <div v-else-if="currentQuestion.type === 'sort'" class="sort-question">
          <Sort :options="currentQuestion.options" v-model="userAnswers.sort" />
        </div>
        <!-- Free text question -->
        <div
          v-else-if="currentQuestion.type === 'free_text'"
          class="free-text-input"
        >
          <TextInput
            :id="'free-text-' + currentQuestion.id"
            v-model="userAnswers.free_text"
            type="textarea"
            rows="5"
            placeholder="自由に回答を記述してください"
          />
        </div>

        <!-- Fill in the blank question -->
        <div
          v-else-if="currentQuestion.type === 'fill_in_blank'"
          class="fill-in-blank"
        >
          <TextInput
            v-for="(blank, index) in currentQuestion.blanks"
            :key="index"
            :id="'blank-' + currentQuestion.id + '-' + index"
            v-model="userAnswers.fill_in_blank[index]"
            :placeholder="`空欄${index + 1}`"
          />
        </div>

        <!-- Matching question -->
        <div v-else-if="currentQuestion.type === 'matching'" class="matching">
          <div
            v-for="(pair, index) in currentQuestion.matchingPairs"
            :key="index"
            class="matching-pair"
          >
            <span>{{ pair.left }}</span>
            <select v-model="userAnswers.matching[pair.left]">
              <option
                v-for="rightOption in shuffledRightOptions"
                :key="rightOption"
                :value="rightOption"
              >
                {{ rightOption }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="navigation">
        <Button
          :primary="true"
          @click="prevQuestion"
          label="前の問題"
          :square="true"
          :disabled="currentQuestionIndex === 0"
        />
        <Button
          :primary="true"
          @click="nextQuestion"
          label="次の問題"
          :square="true"
          :disabled="currentQuestionIndex === questions.length - 1"
        />
      </div>
      <Button
        :primary="true"
        @click="submitTest"
        label="終了"
        :square="true"
        background-color="#3a75ff"
      />
    </div>

    <TestResults
      v-if="showResults"
      :questions="questions"
      :userAnswers="userAnswers"
      :score="score"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import type { Meta, Question, UserAnswers } from './types';
import Button from '@/stories/Bases/Buttons/Button.vue';
import RadioButton from '@/stories/Bases/RadioButtons/RadioButton.vue';
import CheckboxButton from '@/stories/Bases/CheckboxButtons/CheckboxButton.vue';
import TextInput from '@/stories/Bases/TextInputs/TextInput.vue';
import Timer from '@/stories/Bases/Timers/Timer.vue';
import Sort from '@/stories/Bases/Sorts/Sort.vue';
import TestResults from '@/stories/pages/TestResults.vue';
import ExplanationPage from '@/stories/pages/ExplanationPage.vue';

const timerKey = ref(0);
const testStarted = ref(false);

const fetchQuestions = async () => {
  const id = '20c674a8-5494-4513-95e9-ca07f31fe220';
  try {
    const response = await fetch(`http://localhost:3000/api/exam?id=${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
};

const meta = reactive<Meta>({
  title: '読み込み中です...',
  limitTime: 24 * 60 * 60,
});

const questions = ref<Question[]>([]);
const currentQuestionIndex = ref(0);
const score = ref(0);

const userAnswers = ref<UserAnswers>({
  single: '',
  multiple: {},
  code: '',
  sort: [],
  free_text: '',
  fill_in_blank: [],
  matching: {},
});

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value]
);

const shuffledRightOptions = computed(() => {
  if (
    currentQuestion.value?.type === 'matching' &&
    Array.isArray(currentQuestion.value.matchingPairs)
  ) {
    return currentQuestion.value.matchingPairs
      .map((pair) => pair.right)
      .sort(() => Math.random() - 0.5);
  }
  return [];
});

const handleHalfTime = () => {
  alert('残り時間が半分になりました。');
};

const handleOneMinuteLeft = () => {
  alert('残り時間が1分を切りました。');
};

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
}

function calculateScore(): number {
  let totalScore = 0;
  questions.value.forEach((question) => {
    const userAnswer = userAnswers.value[question.type];
    switch (question.type) {
      case 'single':
        if (userAnswer === question.correctAnswer) totalScore++;
        break;
      case 'multiple':
        const selectedOptions = Object.entries(userAnswer)
          .filter(([_, isChecked]) => isChecked)
          .map(([option, _]) => option);
        if (
          JSON.stringify(selectedOptions.sort()) ===
          JSON.stringify(question.correctAnswer.sort())
        )
          totalScore++;
        break;
      case 'code':
        if (userAnswer.trim() === question.correctAnswer.trim()) totalScore++;
        break;
      case 'sort':
        if (
          JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
        )
          totalScore++;
        break;
      case 'free_text':
        if (userAnswer.includes(question.correctAnswer)) totalScore++;
        break;
      case 'fill_in_blank':
        if (
          JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
        )
          totalScore++;
        break;
      case 'matching':
        if (
          JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
        )
          totalScore++;
        break;
    }
  });
  return totalScore;
}

const showResults = ref(false);

function submitTest() {
  const finalScore = calculateScore();
  score.value = finalScore;
  showResults.value = true;
}

watch(
  () => meta.limitTime,
  (newLimitTime) => {
    // meta.limitTimeが変更されたらtimerKeyを更新
    timerKey.value++;
  },
  { immediate: true }
);

const startTest = () => {
  const name = prompt('お名前を入力してください');
  if (name) {
    userAnswers.value.name = name;
  }else{
    alert('お名前を入力してください');
    return;
  }
  testStarted.value = true;
};

onMounted(async () => {
  const data = await fetchQuestions();
  if (data) {
    meta.title = data.meta.title;
    meta.limitTime = data.meta.limitTime;
    meta.description = data.meta.description;
    meta.instructions = data.meta.instructions;
    meta.rules = data.meta.rules;
    meta.scoring = data.meta.scoring;
    meta.requirements = data.meta.requirements;
    meta.contact = data.meta.contact;
    questions.value = data.questions;
  } else {
    meta.title = 'エラーが発生しました';
  }
});

</script>
<style lang="scss" scoped>
.skill-check {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  h1 {
    text-align: center;
    color: #333;
  }

  .timer {
    text-align: right;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .question {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;

    h2 {
      margin-top: 0;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;

      label {
        display: flex;
        align-items: center;
        cursor: pointer;

        input {
          margin-right: 10px;
        }
      }
    }

    .code-input {
      textarea {
        width: 100%;
        padding: 10px;
        font-family: monospace;
      }
    }

    .sort-options {
      .sort-item {
        background-color: #ddd;
        padding: 10px;
        margin: 5px 0;
        cursor: move;
      }
    }
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    button {
      padding: 10px 20px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #45a049;
      }

      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    }
  }

  .submit {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #008cba;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;

    &:hover {
      background-color: #007b9a;
    }
  }

  .free-text-input,
  .fill-in-blank,
  .matching {
    margin-top: 15px;
  }

  .free-text-input textarea,
  .fill-in-blank input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .matching {
    .matching-pair {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      select {
        width: 50%;
        padding: 5px;
      }
    }
  }
}
</style>
