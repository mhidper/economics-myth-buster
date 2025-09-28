// Ya no necesitamos importar la configuración de Google Sheets

// Función para enviar datos a nuestra propia API en Vercel
export const sendToGoogleSheets = async (data: { // Puedes mantener el nombre o cambiarlo a sendResults
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
    console.log('Enviando datos a nuestra API en Vercel:', data);

    // 1. EL CAMBIO CLAVE: La URL ahora apunta a nuestra API interna.
    const response = await fetch('/api/guardar-resultados', { // ¡Adiós, URL de Google!
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // 2. Simplificamos el código: Ya no hace falta comprobar si es localhost,
    // porque esta llamada funciona tanto en local como en producción.

    if (response.ok) {
      console.log('✅ Datos recibidos por la API de Vercel');
    } else {
      console.error('❌ La API de Vercel devolvió un error:', response.status);
    }

  } catch (error) {
    console.error('❌ Error de red al contactar la API de Vercel:', error);
  }
};

// Puedes mantener la función de prueba si quieres, ¡ahora funcionará!
export const testGoogleSheets = async () => {
  const datosTest = {
    nombre: 'Estudiante Test API',
    email: 'test@vercel.com',
    asignatura: 'Economía Política',
    tema: 'Tema 1. La Escasez',
    puntuacion: 10,
    totalPreguntas: 10,
    tiempoSegundos: 150,
    preguntasFalladas: 'Ninguna'
  };

  await sendToGoogleSheets(datosTest);
};
