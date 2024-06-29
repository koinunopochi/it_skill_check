import fs from 'fs/promises';
import { ExamRepository } from '../domain/repositories/ExamRepository';
import { randomUUID } from 'crypto';

export class YamlExamRepository implements ExamRepository {
  private filePath: string;

  constructor() {
    const src_path = __dirname.replace('dist', 'src');
    this.filePath = src_path + '/../storage/yamls/';
  }

  async getExam(id: string): Promise<string> {
    const meta = await this.getYamlMetaList();
    const target: any = meta.find((m: any) => m['id'] === id);
    const filename = target['name'] + '$_id_' + id;

    console.log(this.filePath + filename + '.yaml');

    const fileContents = await fs.readFile(
      this.filePath + filename + '.yaml',
      'utf8'
    );

    return fileContents;
  }

  async getYamlMetaList(): Promise<object[]> {
    const files = await fs.readdir(this.filePath);
    const yamlFiles = files
      .filter((file) => file.endsWith('.yaml'))
      .map((file) => file.replace('.yaml', ''));
    // ここから、$_id_以降の文字列を分割する
    // 例: hogehoge$_id_1.yaml => {id: 1, name: hogehoge}

    let yamlFilesWithId: object[] = [];
    yamlFiles.forEach((file) => {
      const id = file.split('$_id_')[1];
      const name = file.split('$_id_')[0];
      yamlFilesWithId.push({ id: id, name: name });
    });

    return yamlFilesWithId;
  }

  async createExam(filename: string, content: string): Promise<void> {
    const id = randomUUID();
    await fs.writeFile(
      this.filePath + filename + '$_id_' + id + '.yaml',
      content
    );
  }

  async updateExam(
    id: string,
    filename: string,
    content: string
  ): Promise<void> {
    const meta = await this.getYamlMetaList();
    const target: any = meta.find((m: any) => m['id'] === id);
    const filename_ = target['name'];

    if (filename !== filename_) {
      await fs.unlink(this.filePath + filename_ + '$_id_' + id + '.yaml');
    }

    await fs.writeFile(
      this.filePath + filename + '$_id_' + id + '.yaml',
      content
    );
  }

  async deleteExam(id: string): Promise<void> {
    const meta = await this.getYamlMetaList();
    const target: any = meta.find((m: any) => m['id'] === id);
    const filename = target['name'];

    await fs.unlink(this.filePath + filename + '$_id_' + id + '.yaml');
  }
}
