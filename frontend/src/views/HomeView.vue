<template>
  <main class="skill-check">
    <h1>ITエンジニアスキルチェック</h1>
    <div class="timer">残り時間: {{ formatTime(remainingTime) }}</div>
    <div class="score">現在のスコア: {{ score }}点</div>

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

      <div v-else-if="currentQuestion.type === 'sort'" class="sort-options">
        <div
          v-for="option in currentQuestion.options"
          :key="option"
          draggable="true"
          @dragstart="dragStart"
          @dragover.prevent
          @drop="drop"
          class="sort-item"
        >
          {{ option }}
        </div>
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
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Question, UserAnswers } from './types';
import Button from '@/stories/Buttons/Button.vue';
import RadioButton from '@/stories/RadioButtons/RadioButton.vue';
import CheckboxButton from '@/stories/CheckboxButtons/CheckboxButton.vue';
import TextInput from '@/stories/TextInputs/TextInput.vue';

const questions: Question[] = [
  {
    id: 1,
    type: 'single',
    question:
      'JavaScriptにおいて、配列の末尾に要素を追加するメソッドは次のうちどれですか？',
    options: ['push()', 'append()', 'addToEnd()', 'insert()'],
    correctAnswer: 'push()',
  },
  {
    id: 2,
    type: 'multiple',
    question:
      'RESTful APIのHTTPメソッドのうち、リソースの作成に使用されるものはどれですか？（複数選択可）',
    options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    correctAnswer: ['POST', 'PUT'],
  },
  {
    id: 3,
    type: 'code',
    question:
      '次の関数を完成させてください。この関数は与えられた配列の要素をすべて2倍にして返します。',
    correctAnswer: 'return arr.map(x => x * 2);',
  },
  {
    id: 4,
    type: 'sort',
    question:
      '以下のソフトウェア開発プロセスを正しい順序に並べ替えてください。',
    options: ['テスト', '設計', '要件定義', '実装', '保守'],
    correctAnswer: ['要件定義', '設計', '実装', 'テスト', '保守'],
  },
  {
    id: 5,
    type: 'single',
    question: 'どのデータ構造がLIFO（Last In First Out）の原則に従いますか？',
    options: ['キュー', 'スタック', '連結リスト', '二分木'],
    correctAnswer: 'スタック',
  },
  {
    id: 6,
    type: 'free_text',
    question:
      'オブジェクト指向プログラミングの主要な特徴を3つ挙げ、簡単に説明してください。',
    correctAnswer: '模範解答: カプセル化、継承、ポリモーフィズム', // 採点基準として使用
  },
  {
    id: 7,
    type: 'fill_in_blank',
    question:
      'HTMLにおいて、ハイパーリンクを作成するタグは <_____> です。このタグの主要な属性は _____ で、リンク先のURLを指定します。',
    blanks: ['a', 'href'],
    correctAnswer: ['a', 'href'],
  },
  {
    id: 8,
    type: 'matching',
    question:
      '以下のプログラミング言語と、その主な用途をマッチングしてください。',
    matchingPairs: [
      { left: 'Python', right: 'データ分析' },
      { left: 'JavaScript', right: 'Webフロントエンド' },
      { left: 'SQL', right: 'データベース操作' },
      { left: 'C++', right: 'システムプログラミング' },
    ],
    correctAnswer: {
      Python: 'データ分析',
      JavaScript: 'Webフロントエンド',
      SQL: 'データベース操作',
      'C++': 'システムプログラミング',
    },
  },
];

const currentQuestionIndex = ref(0);
const score = ref(0);
const remainingTime = ref(1800); // 30分
const userAnswers = ref<UserAnswers>({
  single: '',
  multiple: {},
  code: '',
  sort: [],
  free_text: '',
  fill_in_blank: [],
  matching: {},
});

const currentQuestion = computed(() => questions[currentQuestionIndex.value]);

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

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    resetUserAnswer();
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
    resetUserAnswer();
  }
}

function resetUserAnswer() {
  const currentQuestion = questions[currentQuestionIndex.value];
  const questionType = currentQuestion.type;

  switch (questionType) {
    case 'multiple':
      userAnswers.value.multiple = Object.fromEntries(
        (currentQuestion.options ?? []).map((option) => [option, false])
      );
      break;
    case 'fill_in_blank':
      userAnswers.value.fill_in_blank = new Array(
        currentQuestion.blanks?.length || 0
      ).fill('');
      break;
    case 'matching':
      userAnswers.value.matching = Object.fromEntries(
        (currentQuestion.matchingPairs ?? []).map((pair) => [pair.left, ''])
      );
      break;
    case 'sort':
      userAnswers.value.sort = [...(currentQuestion.options ?? [])];
      break;
    default:
      userAnswers.value[questionType] = '';
  }
}

// function getSelectedOptions() {
//   return Object.entries(userAnswers.value.multiple)
//     .filter(([_, isChecked]) => isChecked)
//     .map(([option, _]) => option);
// }

function submitTest() {
  // Here you would implement the logic to calculate the final score
  alert(`テストが終了しました。最終スコア: ${score.value}点`);
}

// Drag and drop functionality for sort questions
function dragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', (e.target as HTMLElement).innerHTML);
  }
}

function drop(e: DragEvent) {
  e.preventDefault();
  const data = e.dataTransfer?.getData('text');
  if (data && e.target instanceof HTMLElement) {
    e.target.innerHTML = data;
  }
}
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

  .timer,
  .score {
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
