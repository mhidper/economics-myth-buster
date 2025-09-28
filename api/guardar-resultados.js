// Este es el código que se ejecutará en el servidor de Vercel, no en el navegador.

export default function handler(req, res) {
  // 'req' (request) contiene toda la información de la petición que llega del navegador.
  // 'res' (response) es lo que usaremos para enviar una respuesta de vuelta.

  // 1. Comprobamos que la petición sea de tipo POST.
  if (req.method !== 'POST') {
    // Si no es POST, devolvemos un error.
    return res.status(405).json({ message: 'Solo se permiten peticiones POST' });
  }

  // 2. Obtenemos los datos del quiz que vienen en el cuerpo (body) de la petición.
  const quizData = req.body;

  // 3. (Por ahora) Mostramos los datos en los logs de Vercel para confirmar que han llegado.
  console.log('--- Resultados del Quiz Recibidos ---');
  console.log(quizData);
  console.log('------------------------------------');

  // --- Aquí es donde en el futuro guardarás los datos en una base de datos (como Supabase) ---

  // 4. Enviamos una respuesta de éxito de vuelta al navegador.
  res.status(200).json({ status: 'Éxito', data: quizData });
}