import fs from 'fs/promises';
import yaml from 'js-yaml';
import { Exam } from '../domain/entities/Exam';
import { ExamRepository } from '../domain/repositories/ExamRepository';

export class YamlExamRepository implements ExamRepository {
  private filePath: string;

  constructor() {
    const src_path = __dirname.replace('dist', 'src');
    this.filePath = src_path + '/../storage/yamls/';
  }

  async getExam(filename: string): Promise<Exam> {
    console.log(this.filePath + filename + '.yaml');
    const fileContents = await fs.readFile(
      this.filePath + filename + '.yaml',
      'utf8'
    );
    const data = yaml.load(fileContents) as Exam;
    console.log(data);
    return data;
  }
}
