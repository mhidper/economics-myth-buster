
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

// NUEVOS TIPOS PARA FASE 1 - Todos opcionales para compatibilidad
export interface QuizBehaviorData {
  // Datos de tiempo
  tiempoInicioQuiz?: string; // ISO timestamp
  tiempoFinQuiz?: string; // ISO timestamp
  tiemposPorPregunta?: number[]; // Segundos para cada pregunta
  
  // Datos de interacción
  cambiosPorPregunta?: number[]; // Cuántas veces cambió cada respuesta
  
  // Datos de percepción
  dificultadPercibida?: number; // 1-5 escala
  
  // Comentario global de IA
  comentarioGlobal?: string; // Análisis personalizado de IA
}

// Extensión de los datos que enviamos al servidor
export interface QuizResultData {
  // Datos existentes (mantener exactamente igual)
  nombre: string;
  email: string;
  asignatura: string;
  tema: string;
  puntuacion: number;
  totalPreguntas: number;
  tiempoSegundos: number;
  preguntasFalladas: string;
  
  // NUEVOS: Datos de comportamiento (opcionales)
  behaviorData?: QuizBehaviorData;
}
