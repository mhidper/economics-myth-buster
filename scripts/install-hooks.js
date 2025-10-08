#!/usr/bin/env node

/**
 * Script de instalación de hooks de Git
 * Configura el pre-commit hook automáticamente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hookSource = path.join(__dirname, '..', 'scripts', 'pre-commit-hook.js');
const hookDest = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');

try {
  // Crear el contenido del hook
  const hookContent = `#!/bin/sh
node scripts/pre-commit-hook.js
`;

  // Escribir el hook
  fs.writeFileSync(hookDest, hookContent, { mode: 0o755 });
  
  console.log('✅ Git pre-commit hook instalado correctamente');
  console.log('📝 Ahora los materiales se actualizarán automáticamente al hacer commit');
} catch (error) {
  console.error('❌ Error instalando hook:', error.message);
  process.exit(1);
}
