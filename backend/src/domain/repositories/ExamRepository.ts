import { Exam } from '../entities/Exam';

export interface ExamRepository {
  getExam(filename:string): Promise<Exam>;
}
