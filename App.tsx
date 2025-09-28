import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MaterialInput from './components/MaterialInput';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ApiKeySetup from './components/ApiKeySetup'; // New component
import { generateQuizFromMaterial, evaluateStudentAnswers, generateGlobalComment } from './services/geminiService';
import { sendToGoogleSheets } from './services/googleSheetsService';
import { AppState, QuizQuestion, StudentAnswer, EvaluationResult, QuizBehaviorData } from './types';
import * as pdfjsLib from 'pdfjs-dist';

// Import the worker
import 'pdfjs-dist/build/pdf.worker.mjs';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [courseMaterial, setCourseMaterial] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Datos del estudiante para Google Sheets
  const [studentData, setStudentData] = useState<{name: string, email: string, subject?: string, topic?: string} | null>(null);
  
  // NUEVO: Datos de comportamiento del quiz
  const [behaviorData, setBehaviorData] = useState<QuizBehaviorData | null>(null);
  
  // NUEVO: Comentario global de IA
  const [globalComment, setGlobalComment] = useState<string | null>(null);

  // On initial load, check for a saved API key in local storage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Set the worker source for pdf.js once the component mounts
  useEffect(() => {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
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

  const handleGenerateQuiz = useCallback(async (source: string | File, studentInfo?: {name: string, email: string, subject?: string, topic?: string}) => {
    if (!apiKey) {
      setError("La clave de API no está configurada.");
      return;
    }
    
    // Guardar datos del estudiante si se proporcionaron
    if (studentInfo) {
      setStudentData(studentInfo);
      console.log('Datos del estudiante guardados:', studentInfo);
    }
    
    setError(null);
    setAppState(AppState.GENERATING_QUIZ);
    
    let materialText = '';

    try {
      if (source instanceof File) {
        try {
          const arrayBuffer = await source.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          let fullText = '';
          
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          materialText = fullText;
        } catch (pdfError) {
          console.error('Error processing PDF:', pdfError);
          throw new Error("No se pudo procesar el archivo PDF. Asegúrate de que es un PDF válido con texto (no escaneado).");
        }

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
  
  // NUEVO: Función para enviar datos completos a Vercel
  const sendCompleteDataToVercel = useCallback(async (completeBehaviorData: QuizBehaviorData) => {
    if (studentData && studentData.name && studentData.email && evaluationResults.length > 0) {
      const correctAnswers = evaluationResults.filter(r => r.isCorrect).length;
      const totalQuestions = evaluationResults.length;
      const wrongQuestions = evaluationResults
        .filter(r => !r.isCorrect)
        .map((r, index) => `Pregunta ${index + 1}`)
        .join(', ');
      
      // Calcular tiempo total del quiz
      const tiempoTotal = completeBehaviorData.tiempoInicioQuiz && completeBehaviorData.tiempoFinQuiz 
        ? Math.round((new Date(completeBehaviorData.tiempoFinQuiz).getTime() - new Date(completeBehaviorData.tiempoInicioQuiz).getTime()) / 1000)
        : 0;
      
      const analyticsData = {
        nombre: studentData.name,
        email: studentData.email,
        asignatura: studentData.subject || 'No especificada',
        tema: studentData.topic?.replace('.pdf', '') || 'No especificado',
        puntuacion: correctAnswers,
        totalPreguntas: totalQuestions,
        tiempoSegundos: tiempoTotal,
        preguntasFalladas: wrongQuestions || 'Ninguna',
        // NUEVO: Datos completos de comportamiento con comentario y dificultad
        behaviorData: completeBehaviorData
      };
      
      console.log('📤 Enviando datos completos a Vercel:', analyticsData);
      await sendToGoogleSheets(analyticsData);
    }
  }, [studentData, evaluationResults]);

  const handleQuizSubmit = useCallback(async (answers: (number | null)[], newBehaviorData: QuizBehaviorData) => {
     if (!apiKey) {
      setError("La clave de API no está configurada.");
      return;
    }
    
    // NUEVO: Guardar datos de comportamiento
    setBehaviorData(newBehaviorData);
    
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
        
        // NUEVO: Generar comentario global personalizado
        if (studentData?.name) {
          try {
            console.log('🤖 Generando comentario personalizado...');
            const comment = await generateGlobalComment(
              courseMaterial,
              quizQuestions,
              results,
              {
                tiemposPorPregunta: newBehaviorData.tiemposPorPregunta,
                cambiosPorPregunta: newBehaviorData.cambiosPorPregunta,
                dificultadPercibida: newBehaviorData.dificultadPercibida
              },
              studentData.name,
              apiKey
            );
            setGlobalComment(comment);
            
            // NUEVO: Actualizar behaviorData con el comentario
            const completeBehaviorData = {
              ...newBehaviorData,
              comentarioGlobal: comment
            };
            setBehaviorData(completeBehaviorData);
            
            console.log('✅ Comentario global generado');
          } catch (commentError) {
            console.error('⚠️ Error generando comentario global:', commentError);
            // No bloquear el flujo si falla el comentario
          }
        }
        
        // NO enviar datos aquí, esperar a que se complete con dificultad
        
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
    setStudentData(null); // Limpiar datos del estudiante
    setBehaviorData(null); // NUEVO: Limpiar datos de comportamiento
    setGlobalComment(null); // NUEVO: Limpiar comentario global
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
        return (
          <ResultsView 
            evaluations={evaluationResults} 
            questions={quizQuestions} 
            onStartOver={handleStartOver}
            globalComment={globalComment || undefined}
            onDifficultySubmit={(difficulty) => {
              // NUEVO: Manejar dificultad percibida
              if (behaviorData) {
                const updatedBehaviorData = { 
                  ...behaviorData, 
                  dificultadPercibida: difficulty 
                };
                setBehaviorData(updatedBehaviorData);
                
                // NUEVO: Enviar datos completos a Vercel ahora que tenemos todo
                sendCompleteDataToVercel(updatedBehaviorData);
                
                // Si aún no tenemos comentario global, generarlo ahora con la dificultad
                if (!globalComment && studentData?.name && apiKey) {
                  generateGlobalComment(
                    courseMaterial,
                    quizQuestions,
                    evaluationResults,
                    updatedBehaviorData,
                    studentData.name,
                    apiKey
                  ).then(comment => {
                    setGlobalComment(comment);
                    // NUEVO: Actualizar behaviorData y reenviar con comentario
                    const finalBehaviorData = { ...updatedBehaviorData, comentarioGlobal: comment };
                    setBehaviorData(finalBehaviorData);
                    sendCompleteDataToVercel(finalBehaviorData);
                    console.log('✅ Comentario global generado con dificultad percibida');
                  }).catch(error => {
                    console.error('Error generando comentario con dificultad:', error);
                  });
                }
              }
            }}
          />
        );
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