export interface ExamRepository {
  getExam(filename: string): Promise<string>;
  getYamlMetaList(): Promise<object[]>;
  createExam(filename: string, content: string): Promise<void>;
  updateExam(id: string, filename: string, content: string): Promise<void>;
  deleteExam(id: string): Promise<void>;
  saveData(id:string,data: any): Promise<void>;
}
