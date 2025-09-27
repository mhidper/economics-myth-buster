import { GOOGLE_SHEETS_CONFIG } from './analyticsConfig';

// Función para enviar datos a Google Sheets
export const sendToGoogleSheets = async (data: {
  nombre: string;
  email: string;
  asignatura: string;
  tema: string;
  puntuacion: number;
  totalPreguntas: number;
  tiempoSegundos: number;
  preguntasFalladas: string;
}) => {
  try {
    if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
      console.log('Analytics deshabilitado');
      return;
    }

    // Solo enviar en producción (Vercel), no en localhost
    const isProduction = window.location.hostname !== 'localhost';
    
    if (!isProduction) {
      console.log('🔧 Modo desarrollo - Datos que se enviarían:', data);
      console.log('✅ (En producción se enviaría a Google Sheets)');
      return;
    }

    console.log('Enviando datos a Google Sheets:', data);

    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('✅ Datos enviados correctamente a Google Sheets');
    } else {
      console.error('❌ Error enviando datos:', response.status);
    }

  } catch (error) {
    console.error('❌ Error conectando con Google Sheets:', error);
  }
};

// Función de prueba para verificar que funciona
export const testGoogleSheets = async () => {
  const datosTest = {
    nombre: 'Estudiante Test',
    email: 'test@ejemplo.com',
    asignatura: 'Economía Política',
    tema: 'Tema 1. La Escasez',
    puntuacion: 8,
    totalPreguntas: 10,
    tiempoSegundos: 300,
    preguntasFalladas: 'Pregunta 3, Pregunta 7'
  };

  await sendToGoogleSheets(datosTest);
};
