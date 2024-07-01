<template>
  <div class="admin-console">
    <h1>管理コンソール</h1>

    <div class="content">
      <div class="sidebar">
        <h2>YAMLファイル一覧</h2>
        <ul class="file-list">
          <li
            v-for="file in YamlMeta"
            :key="file.id"
            :class="{ active: editingFile?.id === file.id }"
          >
            <span class="file-name">{{ file.name }}</span>
            <div class="file-actions">
              <Button
                :primary="true"
                @click="editFile(file.id)"
                label="編"
                size="small"
                :square="true"
              />
              <Button
                :primary="true"
                @click="deleteFile(file.id)"
                label="削"
                background-color="#F44336"
                size="small"
                :square="true"
              />
            </div>
          </li>
        </ul>
      </div>

      <div class="main-content">
        <!-- 新規作成フォーム -->
        <div v-if="!editingFile" class="form-container">
          <h2>新規YAMLファイル作成</h2>
          <TextInput
            id="new-file-name"
            label="ファイル名"
            type="text"
            v-model="newFileName"
            placeholder="Input file name"
          />
          <textarea
            v-model="newFileContent"
            placeholder="YAMLコンテンツ"
          ></textarea>
          <div class="form-actions">
            <Button
              :primary="true"
              @click="createFile"
              label="作成"
              :square="true"
            />
          </div>
        </div>

        <!-- 編集フォーム -->
        <div v-if="editingFile" class="form-container">
          <h2>YAMLファイル編集</h2>
          <TextInput
            id="edit-file-name"
            label="ファイル名"
            type="text"
            v-model="editingFile.name"
            placeholder="Input file name"
          />
          <textarea
            v-model="editingFile.content"
            placeholder="YAMLコンテンツ"
          ></textarea>
          <div class="form-actions">
            <Button
              :primary="true"
              @click="saveEdit"
              label="保存"
              :square="true"
            />
            <Button
              @click="cancelEdit"
              label="キャンセル"
              background-color="#acacac"
              :square="true"
            />
          </div>
        </div>
      </div>
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
    const response = await fetch(
      `http://localhost:3000/api/exam?id=${id}&format=yaml`
    );
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
const editFile = async (id: string) => {
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
    const response = await fetch(`http://localhost:3000/api/exam?id=${id}`, {
      method: 'DELETE',
    });
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

<style lang="scss" scoped>
.admin-console {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  .content {
    display: flex;
    gap: 20px;
  }

  .sidebar {
    flex: 0 0 300px;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 5px;

    h2 {
      margin-bottom: 15px;
      color: #444;
    }
  }

  .file-list {
    list-style: none;
    padding: 0;
    margin-top: 15px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      transition: background-color 0.3s;

      &:hover,
      &.active {
        background-color: #e0e0e0;
      }

      .file-name {
        flex-grow: 1;
        margin-right: 10px;
      }

      .file-actions {
        display: flex;
        gap: 5px;
      }
    }
  }

  .main-content {
    flex-grow: 1;
  }

  .form-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 15px;
      color: #444;
    }

    textarea {
      width: 100%;
      height: 300px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      font-family: monospace;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style>
