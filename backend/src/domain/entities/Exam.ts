export interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

export interface Exam {
  title: string;
  limitTime: number;
  questions: Question[];
}
