import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmit: (answers: (number | null)[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const isAllAnswered = answers.every(a => a !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Cuestionario de Economía</h2>
      <p className="text-center text-slate-500 mb-8">¡Pon a prueba tus conocimientos y descubre si puedes identificar los mitos económicos!</p>
      <form onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-lg font-semibold text-slate-700 mb-4">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-3">
              {q.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    answers[qIndex] === oIndex
                      ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
                      : 'border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswerChange(qIndex, oIndex)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="ml-4 text-slate-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={!isAllAnswered}
          className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Enviar Respuestas y Recibir Feedback
        </button>
      </form>
    </div>
  );
};

export default QuizView;