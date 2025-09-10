import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MaterialInput from './components/MaterialInput';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ApiKeySetup from './components/ApiKeySetup'; // New component
import { generateQuizFromMaterial, evaluateStudentAnswers } from './services/geminiService';
import { AppState, QuizQuestion, StudentAnswer, EvaluationResult } from './types';

// Add a global declaration for pdfjsLib to inform TypeScript that it will be available on the window object
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [courseMaterial, setCourseMaterial] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // On initial load, check for a saved API key in local storage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Set the worker source for pdf.js once the component mounts
  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js`;
    }
  }, []);
  
  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    // Reset the app to its initial state
    handleStartOver();
  };

  const handleGenerateQuiz = useCallback(async (source: string | File) => {
    if (!apiKey) {
      setError("La clave de API no está configurada.");
      return;
    }
    setError(null);
    setAppState(AppState.GENERATING_QUIZ);
    
    let materialText = '';

    try {
      if (source instanceof File) {
        if (!window.pdfjsLib) {
            throw new Error("La librería para leer PDFs (pdf.js) no se ha cargado correctamente. Por favor, refresca la página.");
        }
        const arrayBuffer = await source.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let fullText = '';
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        materialText = fullText;

      } else {
        materialText = source;
      }
      
      if (!materialText.trim()) {
        throw new Error("El material del curso (ya sea del texto o del PDF) está vacío.");
      }

      setCourseMaterial(materialText);

      const questions = await generateQuizFromMaterial(materialText, apiKey);
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        setAppState(AppState.TAKING_QUIZ);
      } else {
        throw new Error("El cuestionario generado estaba vacío.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido al procesar el material.";
      setError(errorMessage);
      setAppState(AppState.INPUT);
    }
  }, [apiKey]);

  const handleQuizSubmit = useCallback(async (answers: (number | null)[]) => {
     if (!apiKey) {
      setError("La clave de API no está configurada.");
      return;
    }
    setError(null);
    setAppState(AppState.EVALUATING);

    const studentAnswers: StudentAnswer[] = answers.map((answerIndex, questionIndex) => {
        const question = quizQuestions[questionIndex];
        const selectedOption = answerIndex !== null ? question.options[answerIndex] : '';
        return {
            question: question.question,
            selectedAnswer: selectedOption,
        };
    });

    try {
        const results = await evaluateStudentAnswers(courseMaterial, quizQuestions, studentAnswers, apiKey);
        setEvaluationResults(results);
        setAppState(AppState.SHOWING_RESULTS);
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
        setError(errorMessage);
        setAppState(AppState.TAKING_QUIZ);
    }
  }, [courseMaterial, quizQuestions, apiKey]);

  const handleStartOver = useCallback(() => {
    setAppState(AppState.INPUT);
    setCourseMaterial('');
    setQuizQuestions([]);
    setEvaluationResults([]);
    setError(null);
  }, []);
  
  const renderContent = () => {
    switch (appState) {
      case AppState.INPUT:
        return <MaterialInput onGenerate={handleGenerateQuiz} />;
      case AppState.GENERATING_QUIZ:
        return <Spinner text="Extrayendo texto y generando un cuestionario..." />;
      case AppState.TAKING_QUIZ:
        return <QuizView questions={quizQuestions} onSubmit={handleQuizSubmit} />;
      case AppState.EVALUATING:
        return <Spinner text="Evaluando tus respuestas y preparando el feedback..." />;
      case AppState.SHOWING_RESULTS:
        return <ResultsView evaluations={evaluationResults} questions={quizQuestions} onStartOver={handleStartOver} />;
      default:
        return null;
    }
  };

  if (!apiKey) {
    return <ApiKeySetup onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && <Alert message={error} onClose={() => setError(null)} />}
        {renderContent()}
      </main>
       <footer className="text-center py-4">
          <button onClick={handleClearApiKey} className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            Cambiar Clave de API
          </button>
        </footer>
    </div>
  );
};

export default App;