import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, StudentAnswer, EvaluationResult } from '../types';

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