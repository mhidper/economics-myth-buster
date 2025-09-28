// api/guardar-resultados.js
import { put, list, del } from '@vercel/blob';

// Función para validar los datos recibidos
function validateQuizData(data) {
  const required = ['nombre', 'email', 'asignatura', 'tema', 'puntuacion', 'totalPreguntas'];
  const missing = required.filter(field => !data[field] && data[field] !== 0);
  
  if (missing.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
  }
  
  if (typeof data.puntuacion !== 'number' || typeof data.totalPreguntas !== 'number') {
    throw new Error('puntuacion y totalPreguntas deben ser números');
  }
  
  if (data.puntuacion > data.totalPreguntas || data.puntuacion < 0) {
    throw new Error('Puntuación inválida');
  }
}

export default async function handler(req, res) {
  // Configurar headers CORS por si acaso
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Solo se permiten peticiones POST' 
    });
  }

  try {
    const quizData = req.body;
    
    // Validar datos de entrada
    validateQuizData(quizData);
    
    // Añadir metadata adicional
    const enrichedData = {
      ...quizData,
      timestamp: new Date().toISOString(),
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
    };
    
    const blobFileName = 'resultados.json';
    console.log(`📝 Procesando nuevo resultado para: ${quizData.nombre}`);

    // 1. LEER ARCHIVO EXISTENTE
    const { blobs } = await list({ prefix: blobFileName });
    
    let allResults = [];
    if (blobs.length > 0) {
      try {
        const existingBlob = blobs[0];
        const existingDataText = await (await fetch(existingBlob.url)).text();
        allResults = JSON.parse(existingDataText);
        console.log(`📚 Cargados ${allResults.length} resultados existentes`);
      } catch (parseError) {
        console.warn('⚠️ Error parseando datos existentes, iniciando array vacío:', parseError);
        allResults = [];
      }
    }

    // 2. AÑADIR NUEVO RESULTADO
    allResults.push(enrichedData);
    console.log(`➕ Añadido nuevo resultado. Total: ${allResults.length}`);

    // 3. BORRAR ARCHIVO ANTIGUO
    if (blobs.length > 0) {
      await del(blobs[0].url);
      console.log('🗑️ Archivo anterior eliminado');
    }

    // 4. GUARDAR NUEVO ARCHIVO
    const { url } = await put(blobFileName, JSON.stringify(allResults, null, 2), {
      access: 'public',
      addRandomSuffix: false // Para mantener el mismo nombre
    });
    
    console.log(`💾 Resultados guardados exitosamente. URL: ${url}`);

    // 5. RESPUESTA DE ÉXITO
    res.status(200).json({ 
      success: true,
      message: 'Resultados guardados correctamente', 
      blobUrl: url,
      totalResults: allResults.length,
      studentName: quizData.nombre,
      score: `${quizData.puntuacion}/${quizData.totalPreguntas}`
    });

  } catch (error) {
    console.error('❌ Error procesando la petición:', error);
    
    // Respuesta de error más detallada
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
}