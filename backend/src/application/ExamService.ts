import { Exam } from '../domain/entities/Exam';
import yaml from 'js-yaml';
import { ExamRepository } from '../domain/repositories/ExamRepository';

export class ExamService {
  constructor(private examRepository: ExamRepository) {}

  async getExam(filename: string, format: string): Promise<Exam | string> {
    const exam = await this.examRepository.getExam(filename);

    console.log(format);
    // examを作る
    if (format === 'yaml') {
      return exam;
    }
    return yaml.load(exam) as Exam;
  }

  async getYamlMetaList(): Promise<object[]> {
    return this.examRepository.getYamlMetaList();
  }

  async createExam(filename: string, content: string): Promise<void> {
    return this.examRepository.createExam(filename, content);
  }

  async updateExam(
    id: string,
    filename: string,
    content: string
  ): Promise<void> {
    return this.examRepository.updateExam(id, filename, content);
  }

  async deleteExam(id: string): Promise<void> {
    return this.examRepository.deleteExam(id);
  }
}
