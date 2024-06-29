<template>
  <div class="admin-console">
    <h1>管理コンソール</h1>

    <!-- YAMLファイルリスト -->
    <div class="file-list">
      <h2>YAMLファイル一覧</h2>
      <ul>
        <li v-for="file in YamlMeta" :key="file.id">
          <span>{{ file.name }}</span>
          <button @click="editFile(file.id)">編集</button>
          <button @click="deleteFile(file.id)">削除</button>
        </li>
      </ul>
    </div>

    <!-- 新規作成フォーム -->
    <div class="create-form">
      <h2>新規YAMLファイル作成</h2>
      <!-- <input v-model="newFileName" placeholder="ファイル名" /> -->
      <TextInput
        id="file-name"
        label="ファイル名"
        type="text"
        v-model="newFileName"
        placeholder="Input file name"
      />
      <textarea
        v-model="newFileContent"
        placeholder="YAMLコンテンツ"
      ></textarea>
      <Button :primary="true" @click="createFile" label="作成" :square="true" />
    </div>

    <!-- 編集フォーム -->
    <div v-if="editingFile" class="edit-form">
      <h2>YAMLファイル編集</h2>
      <input v-model="editingFile.name" placeholder="ファイル名" />
      <textarea
        v-model="editingFile.content"
        placeholder="YAMLコンテンツ"
      ></textarea>
      <Button :primary="true" @click="saveEdit" label="保存" :square="true" />
      <button @click="cancelEdit">キャンセル</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from '@/stories/Bases/Buttons/Button.vue';
import TextInput from '@/stories/Bases/TextInputs/TextInput.vue';

interface YamlFile {
  id: string;
  name: string;
  content: string;
}

interface YamlMeta {
  id: string;
  name: string;
}

const YamlMeta = ref<YamlMeta[]>([]);
const newFileName = ref('');
const newFileContent = ref('');
const editingFile = ref<YamlFile | null>(null);

// ファイルリストの取得
const fetchYamlFiles = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/exam/meta/list');
    YamlMeta.value = await response.json();
  } catch (error) {
    console.error('Error fetching YAML files:', error);
  }
};

// 新規ファイル作成
const createFile = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newFileName.value,
        content: newFileContent.value,
      }),
    });
    if (response.ok) {
      await fetchYamlFiles();
      newFileName.value = '';
      newFileContent.value = '';
    }
  } catch (error) {
    console.error('Error creating YAML file:', error);
  }
};

const fetchQuestions = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/exam?id=${id}&format=yaml`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
};

// ファイル編集
const editFile = async(id: string) => {
  const content = await fetchQuestions(id);
  if (!content) return;
  const name = YamlMeta.value.find((file) => file.id === id)?.name || '';
  const file = { id, name: name, content: content };
  editingFile.value = { ...file };
};

// 編集保存
const saveEdit = async () => {
  if (!editingFile.value) return;
  try {
    const response = await fetch(
      `http://localhost:3000/api/exam?id=${editingFile.value.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingFile.value.name,
          content: editingFile.value.content,
        }),
      }
    );
    if (response.ok) {
      await fetchYamlFiles();
      editingFile.value = null;
    }
  } catch (error) {
    console.error('Error updating YAML file:', error);
  }
};

// 編集キャンセル
const cancelEdit = () => {
  editingFile.value = null;
};

// ファイル削除
const deleteFile = async (id: string) => {
  if (!confirm('本当に削除しますか？')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/exam?id=${id}`, { method: 'DELETE' });
    if (response.ok) {
      await fetchYamlFiles();
    }
  } catch (error) {
    console.error('Error deleting YAML file:', error);
  }
};

// 初期化時にファイルリストを取得
onMounted(fetchYamlFiles);
</script>

<style scoped>
.admin-console {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.file-list,
.create-form,
.edit-form {
  margin-bottom: 30px;
}

input,
textarea {
  width: 100%;
  margin-bottom: 10px;
}

textarea {
  height: 200px;
}

button {
  margin-right: 10px;
}
</style>
