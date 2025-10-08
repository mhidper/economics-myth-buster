/**
 * Script para generar automáticamente metadata.json de los materiales
 * Ejecutar con: node scripts/generate-materials-metadata.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDir = path.join(__dirname, '../public/materials');
const outputFile = path.join(__dirname, '../public/materials-metadata.json');

function scanMaterialsDirectory() {
  const materials = {};

  try {
    // Leer todas las carpetas (asignaturas) en /public/materials
    const subjects = fs.readdirSync(materialsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log('📚 Asignaturas encontradas:', subjects);

    for (const subject of subjects) {
      const subjectPath = path.join(materialsDir, subject);
      
      // Leer todos los archivos PDF en cada carpeta de asignatura
      const files = fs.readdirSync(subjectPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.pdf'))
        .map(dirent => dirent.name);

      materials[subject] = files;
      console.log(`  ✅ ${subject}: ${files.length} temas encontrados`);
    }

    // Escribir el archivo JSON
    fs.writeFileSync(outputFile, JSON.stringify(materials, null, 2), 'utf8');
    console.log('\n✅ Metadata generado exitosamente en:', outputFile);
    console.log('\n📄 Contenido:');
    console.log(JSON.stringify(materials, null, 2));

  } catch (error) {
    console.error('❌ Error generando metadata:', error);
    process.exit(1);
  }
}

scanMaterialsDirectory();
