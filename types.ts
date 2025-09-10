
export enum AppState {
  INPUT = 'INPUT',
  GENERATING_QUIZ = 'GENERATING_QUIZ',
  TAKING_QUIZ = 'TAKING_QUIZ',
  EVALUATING = 'EVALUATING',
  SHOWING_RESULTS = 'SHOWING_RESULTS',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  mythExplanation: string; // Explains why one of the wrong options is a common myth
}

export interface StudentAnswer {
    question: string;
    selectedAnswer: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
}
