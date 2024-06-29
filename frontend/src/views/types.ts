// types.ts
export interface Meta {
  title: string;
  limitTime: number;
}

type QuestionType =
  | 'single'
  | 'multiple'
  | 'code'
  | 'sort'
  | 'free_text'
  | 'fill_in_blank'
  | 'matching';

interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
}

interface SingleQuestion extends BaseQuestion {
  type: 'single';
  options: string[];
  correctAnswer: string;
}

interface MultipleQuestion extends BaseQuestion {
  type: 'multiple';
  options: string[];
  correctAnswer: string[];
}

interface CodeQuestion extends BaseQuestion {
  type: 'code';
  correctAnswer: string;
}

interface SortQuestion extends BaseQuestion {
  type: 'sort';
  options: string[];
  correctAnswer: string[];
}

interface FreeTextQuestion extends BaseQuestion {
  type: 'free_text';
  correctAnswer: string;
}

interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill_in_blank';
  blanks: string[];
  correctAnswer: string[];
}

interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  matchingPairs: { left: string; right: string }[];
  correctAnswer: { [key: string]: string };
}

export  type Question =
  | SingleQuestion
  | MultipleQuestion
  | CodeQuestion
  | SortQuestion
  | FreeTextQuestion
  | FillInBlankQuestion
  | MatchingQuestion;

export interface UserAnswers {
  single: string;
  multiple: { [key: string]: boolean };
  code: string;
  sort: string[];
  free_text: string;
  fill_in_blank: string[];
  matching: { [key: string]: string };
}
