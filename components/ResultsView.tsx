import React from 'react';
import type { EvaluationResult, QuizQuestion } from '../types';

interface ResultsViewProps {
  evaluations: EvaluationResult[];
  questions: QuizQuestion[];
  onStartOver: () => void;
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

const ResultsView: React.FC<ResultsViewProps> = ({ evaluations, questions, onStartOver }) => {
  const correctCount = evaluations.filter(e => e.isCorrect).length;
  const totalCount = evaluations.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

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