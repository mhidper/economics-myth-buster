// Importamos las funciones necesarias del paquete de Vercel Blob
import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
  // Nos aseguramos de que sea una petición POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permiten peticiones POST' });
  }

  try {
    const quizData = req.body;
    const blobFileName = 'resultados.json';

    // 1. LEER EL ARCHIVO EXISTENTE: Buscamos si ya existe un 'resultados.json' en nuestro Blob.
    const { blobs } = await list({ prefix: blobFileName });
    
    let allResults = [];
    if (blobs.length > 0) {
      // Si el archivo existe, descargamos su contenido y lo convertimos de texto a un objeto JSON.
      const existingBlob = blobs[0];
      const existingDataText = await (await fetch(existingBlob.url)).text();
      allResults = JSON.parse(existingDataText);
    }

    // 2. AÑADIR EL NUEVO RESULTADO: Añadimos los datos del nuevo quiz al array de resultados.
    allResults.push(quizData);

    // 3. BORRAR EL ARCHIVO ANTIGUO (si existía):
    // Vercel Blob no permite "modificar" un archivo, el proceso es borrar el viejo y subir el nuevo.
    if (blobs.length > 0) {
        await del(blobs[0].url);
    }

    // 4. GUARDAR EL NUEVO ARCHIVO: Subimos el array actualizado como un nuevo 'resultados.json'.
    // JSON.stringify lo convierte de nuevo a texto para poder guardarlo.
    const { url } = await put(blobFileName, JSON.stringify(allResults, null, 2), {
      access: 'public', // 'public' nos da una URL para poder verlo o descargarlo fácilmente.
    });

    // 5. RESPONDER CON ÉXITO: Enviamos una respuesta positiva al navegador.
    res.status(200).json({ status: 'Éxito', message: 'Resultados guardados correctamente', blobUrl: url });

  } catch (error) {
    console.error('Error procesando la petición en la API:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}