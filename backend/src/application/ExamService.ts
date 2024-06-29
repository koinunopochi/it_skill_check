import { Exam } from '../domain/entities/Exam';
import { ExamRepository } from '../domain/repositories/ExamRepository';

export class ExamService {
  constructor(private examRepository: ExamRepository) {}

  async getExam(filename:string): Promise<Exam> {
    return this.examRepository.getExam(filename);
  }
}
