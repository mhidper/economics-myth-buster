# 📚 Economics Myth Buster - Gestión Automática de Materiales

## ✨ Sistema Completamente Automático

### 🎯 Flujo de trabajo (100% automático):

1. **Agrega tu PDF a la carpeta:**
   ```
   public/materials/[Asignatura]/[nuevo-tema].pdf
   ```

2. **Haz commit normalmente:**
   ```bash
   git add .
   git commit -m "feat: añadir nuevo tema"
   ```

3. **¡Listo!** El sistema automáticamente:
   - ✅ Detecta los cambios en materiales
   - ✅ Regenera el archivo metadata
   - ✅ Lo incluye en tu commit
   - ✅ Aparecerá en el desplegable al hacer push

### 🔧 ¿Cómo funciona?

El sistema usa un **Git pre-commit hook** que:
- Se ejecuta automáticamente antes de cada commit
- Detecta si agregaste/modificaste PDFs en `public/materials/`
- Regenera `materials-metadata.json` automáticamente
- Lo agrega al commit sin que tengas que hacer nada

### 📦 Instalación (solo una vez)

Si clonas el repo o trabajas en otra máquina:
```bash
npm install
```

El hook se instala automáticamente con `postinstall`.

### 📂 Estructura de carpetas

```
public/
└── materials/
    ├── Economía Política/
    │   ├── Tema 1. La Escasez y el Coste de Oportunidad.pdf
    │   └── Tema 2. La División del Trabajo y la Eficiencia.pdf
    ├── Macroeconómia Básica/
    └── Políticas SocioLaborales/
        ├── Tema 1 El Mercado de Trabajo. Equilibrio y tipos de desempleo.pdf
        └── Tema 2 Las Políticas Activas de Empleo.pdf
```

### 🆕 Crear una nueva asignatura

1. Crea la carpeta: `public/materials/Nueva Asignatura/`
2. Agrega los PDFs dentro
3. Haz commit
4. ¡Aparecerá automáticamente en el desplegable!

### 🚀 Comandos útiles

```bash
# Si necesitas regenerar el metadata manualmente (raro)
npm run generate-metadata

# Reinstalar el hook (si lo borraste accidentalmente)
npm run postinstall
```

### ⚠️ Importante

- Los nombres de carpetas = nombres de asignaturas en el desplegable
- Los nombres de archivos PDF se mostrarán sin la extensión `.pdf`
- El sistema detecta SOLO archivos `.pdf`

### 🎉 Ejemplo completo

```bash
# 1. Agregar nuevo PDF
cp "Tema 3.pdf" "public/materials/Políticas SocioLaborales/"

# 2. Commit normal
git add .
git commit -m "feat: añadir Tema 3 de Políticas SocioLaborales"

# 3. El hook hace su magia automáticamente:
# 🔄 Detectando cambios en materiales...
# 📚 Cambios detectados en materiales, regenerando metadata...
# ✅ Metadata actualizado y agregado al commit automáticamente

# 4. Push
git push

# 5. ¡El nuevo tema ya está en producción!
```

### 💡 Sin necesidad de npm run nada

El sistema es completamente transparente. Solo trabaja con Git normalmente y todo se actualiza solo.
