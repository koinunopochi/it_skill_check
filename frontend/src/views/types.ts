// types.ts
export type QuestionType = 'single' | 'multiple' | 'code' | 'sort' | 'free_text' | 'fill_in_blank' | 'matching';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | { [key: string]: string };
  userAnswer?: string | string[] | { [key: string]: string };
  blanks?: string[];
  matchingPairs?: { left: string; right: string }[];
}

export interface UserAnswers {
  single: string;
  multiple: { [key: string]: boolean };
  code: string;
  sort: string[];
  free_text: string;
  fill_in_blank: string[];
  matching: { [key: string]: string };
}
