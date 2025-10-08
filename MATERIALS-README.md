# 📚 Economics Myth Buster - Gestión de Materiales

## Agregar nuevos PDFs al sistema

### Proceso Automático

1. **Coloca tu PDF en la carpeta correspondiente:**
   ```
   public/materials/[Nombre de la Asignatura]/[nombre-del-tema].pdf
   ```

2. **Ejecuta el script de actualización:**
   ```bash
   npm run generate-metadata
   ```

3. **¡Listo!** El nuevo PDF aparecerá automáticamente en el desplegable.

### Estructura de carpetas

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

### Crear una nueva asignatura

1. Crea una nueva carpeta dentro de `public/materials/`
2. Agrega los PDFs correspondientes
3. Ejecuta `npm run generate-metadata`

### Notas importantes

- El script `generate-metadata` se ejecuta automáticamente antes de cada build (`npm run build`)
- Si agregas un PDF manualmente y no ves los cambios, asegúrate de ejecutar el script
- Los nombres de los archivos PDF se mostrarán tal como están (sin la extensión .pdf)

## Cómo funciona

El sistema utiliza un archivo `materials-metadata.json` que contiene un mapeo de todas las asignaturas y sus temas:

```json
{
  "Economía Política": [
    "Tema 1. La Escasez y el Coste de Oportunidad.pdf",
    "Tema 2. La División del Trabajo y la Eficiencia.pdf"
  ],
  "Políticas SocioLaborales": [
    "Tema 1 El Mercado de Trabajo. Equilibrio y tipos de desempleo.pdf"
  ]
}
```

Este archivo se genera automáticamente escaneando la carpeta `public/materials/`.
