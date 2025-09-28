import React, { useState, useEffect, useRef } from 'react';
import type { QuizQuestion, QuizBehaviorData } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmit: (answers: (number | null)[], behaviorData: QuizBehaviorData) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  
  // NUEVO: Estados para tracking de comportamiento
  const [startTime] = useState(new Date().toISOString());
  const [questionStartTimes, setQuestionStartTimes] = useState<number[]>(Array(questions.length).fill(0));
  const [questionTimes, setQuestionTimes] = useState<number[]>(Array(questions.length).fill(0));
  const [answerChanges, setAnswerChanges] = useState<number[]>(Array(questions.length).fill(0));
  const currentQuestionStartTime = useRef<number>(Date.now());
  const hasStartedTracking = useRef<boolean[]>(Array(questions.length).fill(false));

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const now = Date.now();
    
    // NUEVO: Iniciar tracking de tiempo para esta pregunta si es la primera vez
    if (!hasStartedTracking.current[questionIndex]) {
      const newStartTimes = [...questionStartTimes];
      newStartTimes[questionIndex] = now;
      setQuestionStartTimes(newStartTimes);
      hasStartedTracking.current[questionIndex] = true;
    }
    
    // NUEVO: Contar cambio de respuesta si ya tenía una respuesta anterior
    if (answers[questionIndex] !== null) {
      const newChanges = [...answerChanges];
      newChanges[questionIndex] += 1;
      setAnswerChanges(newChanges);
    }
    
    // Actualizar respuesta (funcionalidad original)
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    
    // NUEVO: Actualizar tiempo de esta pregunta
    if (hasStartedTracking.current[questionIndex]) {
      const timeSpent = (now - questionStartTimes[questionIndex]) / 1000; // en segundos
      const newTimes = [...questionTimes];
      newTimes[questionIndex] = timeSpent;
      setQuestionTimes(newTimes);
    }
  };
  
  const isAllAnswered = answers.every(a => a !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // NUEVO: Preparar datos de comportamiento
    const endTime = new Date().toISOString();
    
    const behaviorData: QuizBehaviorData = {
      tiempoInicioQuiz: startTime,
      tiempoFinQuiz: endTime,
      tiemposPorPregunta: questionTimes,
      cambiosPorPregunta: answerChanges,
      // dificultadPercibida se añadirá en ResultsView
      // comentarioGlobal se añadirá cuando se genere con IA
    };
    
    onSubmit(answers, behaviorData);
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