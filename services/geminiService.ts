import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, StudentAnswer, EvaluationResult, QuizBehaviorData } from '../types';

// The API key is no longer loaded from environment variables here.
// It will be passed into each function call.

const quizGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        quiz: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The question text."
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: { type: Type.STRING }
                    },
                    correctOptionIndex: {
                        type: Type.INTEGER,
                        description: "The 0-based index of the correct option in the 'options' array."
                    },
                    mythExplanation: {
                        type: Type.STRING,
                        description: "A brief explanation of why one of the incorrect options is a common economic myth. This explanation should be concise and clear."
                    }
                },
                required: ["question", "options", "correctOptionIndex", "mythExplanation"]
            }
        }
    }
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        evaluations: {
            type: Type.ARRAY,
            description: "An array of evaluations for each student answer.",
            items: {
                type: Type.OBJECT,
                properties: {
                    isCorrect: {
                        type: Type.BOOLEAN,
                        description: "Whether the student's answer was correct."
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer text from the options."
                    },
                    studentAnswer: {
                        type: Type.STRING,
                        description: "The answer text the student selected."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A detailed explanation for why the answer is correct or incorrect. If incorrect, explain the economic principle. If the student chose a myth, explicitly state that it is a common myth and debunk it using principles from the provided course material."
                    }
                },
                required: ["isCorrect", "correctAnswer", "studentAnswer", "explanation"]
            }
        }
    }
};


export const generateQuizFromMaterial = async (material: string, apiKey: string): Promise<QuizQuestion[]> => {
  if (!apiKey) throw new Error("API Key is required.");
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
Eres un profesor de economía experto en pedagogía y en identificar y corregir errores conceptuales comunes en los estudiantes. Tu objetivo no es solo evaluar si el estudiante memorizó el material, sino descubrir sus creencias preexistentes sobre economía, especialmente los mitos populares.

Basado en los temas centrales del siguiente material del curso, que está en español, genera un cuestionario de 10 preguntas de opción múltiple, todo en español. Las preguntas no deben ser sobre detalles específicos del texto, sino que deben usar los conceptos del texto (como 'coste de oportunidad') para plantear escenarios del mundo real o preguntas conceptuales que pongan a prueba las intuiciones del estudiante. Trata de usar ejemplos reales, o aunque sean inventados, que se puedan encontrar en la realidad. 

Para cada pregunta, diseña las opciones de respuesta de la siguiente manera:
- Una opción claramente correcta según la teoría económica presentada en el material o similar que puedas conocer y relacionar.
- Al menos dos opciones que representen mitos económicos muy comunes o razonamientos falaces que los estudiantes suelen tener sobre el tema.
- Una opción incorrecta pero plausible.

Por ejemplo, si el material habla sobre 'costes de oportunidad', una buena pregunta no sería '¿Qué es el coste de oportunidad?', sino 'Una persona tiene una entrada gratis para un concierto de su banda favorita. La misma noche, su segunda mejor opción es trabajar de canguro por 20€. ¿Cuál es el coste de oportunidad de ir al concierto?'. Las opciones incorrectas podrían reflejar mitos como 'No hay coste porque la entrada es gratis' o 'El coste es el precio de la entrada más los 20€ del trabajo'.

Finalmente, para cada pregunta, proporciona una explicación concisa, en español, del mito principal que se está evaluando en una de las opciones incorrectas.

Material del Curso:
---
${material}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizGenerationSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("No se pudo generar el cuestionario. Verifica que tu clave de API sea correcta y tenga permisos.");
  }
};


export const evaluateStudentAnswers = async (
    material: string,
    questions: QuizQuestion[],
    answers: StudentAnswer[],
    apiKey: string
): Promise<EvaluationResult[]> => {

    if (!apiKey) throw new Error("API Key is required.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Eres el asistente de un profesor de economía. Tu tarea es evaluar las respuestas de un estudiante a un cuestionario, basándote en el material del curso proporcionado y las preguntas originales del cuestionario. Todo el proceso y la salida deben estar en español. Para cada pregunta, proporciona una explicación detallada. Si la respuesta del estudiante es correcta, confírmalo y explica brevemente el principio económico subyacente. Si la respuesta es incorrecta, explica por qué y aclara el concepto correcto. Lo más importante, si el estudiante seleccionó una respuesta que es un mito económico común, identifícala explícitamente como un mito y proporciona una refutación clara y detallada basada en los principios del material del curso.

Material del Curso:
---
${material}
---

Preguntas del Cuestionario y Respuestas del Estudiante:
---
${JSON.stringify({questions, answers}, null, 2)}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.evaluations;
  } catch (error) {
    console.error("Error evaluating answers:", error);
    throw new Error("No se pudieron evaluar las respuestas. Verifica que tu clave de API sea correcta y tenga permisos.");
  }
};

// NUEVA FUNCIÓN: Generar comentario global personalizado
export const generateGlobalComment = async (
    material: string,
    questions: QuizQuestion[],
    evaluations: EvaluationResult[],
    behaviorData: { tiemposPorPregunta?: number[], cambiosPorPregunta?: number[], dificultadPercibida?: number },
    studentName: string,
    apiKey: string
): Promise<string> => {
    if (!apiKey) throw new Error("API Key is required.");
    const ai = new GoogleGenAI({ apiKey });

    // Preparar datos de comportamiento para el prompt
    const correctCount = evaluations.filter(e => e.isCorrect).length;
    const totalQuestions = evaluations.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Analizar patrones de tiempo
    const avgTime = behaviorData.tiemposPorPregunta 
        ? behaviorData.tiemposPorPregunta.reduce((a, b) => a + b, 0) / behaviorData.tiemposPorPregunta.length 
        : 0;
    
    // Analizar cambios de respuesta
    const totalChanges = behaviorData.cambiosPorPregunta 
        ? behaviorData.cambiosPorPregunta.reduce((a, b) => a + b, 0) 
        : 0;
    
    // Preguntas más problemáticas (tiempo alto + cambios + incorrectas)
    const problematicQuestions = evaluations
        .map((evaluation, index) => ({
            index,
            question: questions[index].question,
            isCorrect: evaluation.isCorrect,
            timeSpent: behaviorData.tiemposPorPregunta?.[index] || 0,
            changes: behaviorData.cambiosPorPregunta?.[index] || 0
        }))
        .filter(q => !q.isCorrect || q.timeSpent > avgTime * 1.5 || q.changes > 1)
        .slice(0, 3); // Solo las 3 más problemáticas

    const prompt = `Eres un profesor de economía experto en pedagogía. Tu tarea es crear un comentario personalizado y constructivo para ${studentName}, basándote en su rendimiento en el cuestionario y su comportamiento durante la realización.

Datos del rendimiento:
- Puntuación: ${correctCount}/${totalQuestions} (${scorePercentage}%)
- Tiempo promedio por pregunta: ${avgTime.toFixed(1)} segundos
- Total de cambios de respuesta: ${totalChanges}
- Dificultad percibida por el estudiante: ${behaviorData.dificultadPercibida}/5

Preguntas más problemáticas:
${problematicQuestions.map(q => `- Pregunta ${q.index + 1}: ${q.timeSpent.toFixed(1)}s, ${q.changes} cambios, ${q.isCorrect ? 'correcta' : 'incorrecta'}`).join('\n')}

Resultados detallados:
${evaluations.map((evaluation, i) => `Pregunta ${i + 1}: ${evaluation.isCorrect ? 'CORRECTA' : 'INCORRECTA'} - Respuesta: "${evaluation.studentAnswer}"`).join('\n')}

Material del curso:
---
${material}
---

Crea un comentario personalizado que:
1. **Felicite los aciertos** y reconozca el esfuerzo
2. **Analice los patrones de comportamiento** (tiempos, cambios, dificultad percibida)
3. **Identifique conceptos que necesita reforzar** basándote en errores específicos
4. **Proporcione recomendaciones concretas** de estudio
5. **Sea motivador y constructivo**, no crítico

El comentario debe ser:
- Dirigido directamente a ${studentName} (tutéale)
- Entre 200-400 palabras
- En español
- Específico sobre sus respuestas y comportamiento
- Educativo y motivador

No uses formato JSON, responde solo con el texto del comentario.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating global comment:", error);
        throw new Error("No se pudo generar el comentario personalizado.");
    }
};