#!/usr/bin/env node

/**
 * Git pre-commit hook
 * Regenera automáticamente materials-metadata.json antes de cada commit
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

try {
  console.log('🔄 Detectando cambios en materiales...');
  
  // Verificar si hay cambios en la carpeta materials
  const gitStatus = execSync('git diff --cached --name-only', { 
    cwd: rootDir, 
    encoding: 'utf8' 
  });
  
  const hasMaterialChanges = gitStatus.includes('public/materials/');
  
  if (hasMaterialChanges) {
    console.log('📚 Cambios detectados en materiales, regenerando metadata...');
    
    // Ejecutar el script de generación
    execSync('node scripts/generate-materials-metadata.js', { 
      cwd: rootDir, 
      stdio: 'inherit' 
    });
    
    // Agregar el metadata actualizado al commit
    execSync('git add public/materials-metadata.json', { cwd: rootDir });
    
    console.log('✅ Metadata actualizado y agregado al commit automáticamente');
  } else {
    console.log('✓ No hay cambios en materiales, continuando...');
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error en pre-commit hook:', error.message);
  process.exit(1);
}
