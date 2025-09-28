import React, { useState, useEffect } from 'react';
import type { EvaluationResult, QuizQuestion } from '../types';

interface ResultsViewProps {
  evaluations: EvaluationResult[];
  questions: QuizQuestion[];
  onStartOver: () => void;
  // NUEVO: Callback para enviar dificultad percibida
  onDifficultySubmit?: (difficulty: number) => void;
  // NUEVO: Comentario global de IA (cuando esté disponible)
  globalComment?: string;
}

const TickIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ResultsView: React.FC<ResultsViewProps> = ({ evaluations, questions, onStartOver, onDifficultySubmit, globalComment }) => {
  const correctCount = evaluations.filter(e => e.isCorrect).length;
  const totalCount = evaluations.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  // NUEVO: Estado para la pregunta de dificultad
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const [showDifficultyQuestion, setShowDifficultyQuestion] = useState(true);
  
  // NUEVO: Manejar envío de dificultad
  const handleDifficultySubmit = (rating: number) => {
    setDifficultyRating(rating);
    setShowDifficultyQuestion(false);
    if (onDifficultySubmit) {
      onDifficultySubmit(rating);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Resultados del Cuestionario</h2>
        <p className="text-slate-600 text-lg">Obtuviste una puntuación de</p>
        <p className="text-6xl font-extrabold text-blue-600 my-4">{scorePercentage}%</p>
        <p className="text-slate-600 text-lg">({correctCount} de {totalCount} correctas)</p>
      </div>

      <div className="space-y-6">
        {evaluations.map((result, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md border-l-4 ${result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{index + 1}. {questions[index].question}</h3>
            
            <div className="mb-4 space-y-2">
                <div className="flex items-start">
                    <span className="font-bold w-32 shrink-0">Tu Respuesta:</span>
                    <div className="flex items-center">
                        {result.isCorrect ? <TickIcon /> : <CrossIcon />}
                        <span className={`ml-2 ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{result.studentAnswer}</span>
                    </div>
                </div>
                 {!result.isCorrect && (
                    <div className="flex items-start">
                        <span className="font-bold w-32 shrink-0">Respuesta Correcta:</span>
                        <span className="text-slate-700">{result.correctAnswer}</span>
                    </div>
                )}
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2">Explicación:</h4>
                <p className="text-slate-600 whitespace-pre-wrap">{result.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* NUEVO: Pregunta de dificultad percibida */}
      {showDifficultyQuestion && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
            🎨 ¿Qué tal te pareció la dificultad del cuestionario?
          </h3>
          <p className="text-slate-600 text-center mb-6">
            Tu opinión nos ayuda a mejorar los cuestionarios futuros
          </p>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleDifficultySubmit(rating)}
                className="flex flex-col items-center p-3 bg-white border-2 border-yellow-300 rounded-lg hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200"
              >
                <span className="text-2xl mb-1">
                  {rating === 1 ? '😎' : rating === 2 ? '😊' : rating === 3 ? '😐' : rating === 4 ? '😩' : '😱'}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {rating === 1 ? 'Muy fácil' : rating === 2 ? 'Fácil' : rating === 3 ? 'Normal' : rating === 4 ? 'Difícil' : 'Muy difícil'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* NUEVO: Mostrar dificultad seleccionada */}
      {difficultyRating && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 text-center">
          <p className="text-slate-700">
            ✅ Gracias por tu feedback. Calificaste la dificultad como:
            <span className="font-bold ml-1">
              {difficultyRating === 1 ? 'Muy fácil' : difficultyRating === 2 ? 'Fácil' : difficultyRating === 3 ? 'Normal' : difficultyRating === 4 ? 'Difícil' : 'Muy difícil'}
            </span>
          </p>
        </div>
      )}
      
      {/* NUEVO: Comentario global de IA (cuando esté disponible) */}
      {globalComment && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-8 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            🤖 Análisis Personalizado de tu Rendimiento
          </h3>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {globalComment}
            </p>
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <button
            onClick={onStartOver}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
            Realizar Otro Cuestionario
        </button>
      </div>
    </div>
  );
};

export default ResultsView;