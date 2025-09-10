# 🎓 Economics Myth Buster

Una aplicación educativa inteligente que ayuda a estudiantes a identificar y desmentir mitos económicos comunes usando inteligencia artificial.

## 🌐 **¡Pruébala ahora!**

**🔗 [Usar la aplicación online](https://economics-myth-buster.vercel.app)** ← ¡Clic aquí!

*No necesitas instalar nada - funciona directamente en tu navegador*

![Economics Myth Buster](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Características

- 📚 **Genera cuestionarios automáticamente** desde material de curso (texto o PDF)
- 🧠 **Identifica mitos económicos** y proporciona explicaciones detalladas
- 🤖 **Powered by Google Gemini AI** para evaluación inteligente
- 📱 **Interfaz responsive** y fácil de usar
- 🇪🇸 **Completamente en español**
- 🌐 **Disponible online** - sin instalación requerida
- 🔐 **Tu propia API** - usa tu clave personal de Gemini (gratis)
- 📊 **10 preguntas por cuestionario** para evaluación completa

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **IA**: Google Gemini 2.5 Flash
- **Estilos**: Tailwind CSS
- **PDF Processing**: PDF.js

## ⚡ Instalación y Uso Local

### Prerequisitos
- Node.js (versión 16 o superior)
- Una clave de API de Google Gemini

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/mhidper/economics-myth-buster.git
   cd economics-myth-buster
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura tu API Key**
   ```bash
   cp .env.example .env.local
   ```
   Luego edita `.env.local` y reemplaza `tu_clave_gemini_aqui` con tu clave real.

   **¿Cómo obtener una clave de API de Gemini?**
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Inicia sesión con tu cuenta de Google
   - Crea una nueva API Key gratuita

4. **Ejecuta la aplicación**
   ```bash
   npm run dev
   ```

5. **Abre en tu navegador**
   ```
   http://localhost:5173
   ```

## 🎆 **¿Cómo usar la aplicación online?**

1. **Ve a la aplicación**: [economics-myth-buster.vercel.app](https://economics-myth-buster.vercel.app)
2. **Obtén tu API Key gratis**: 
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Inicia sesión con tu cuenta de Google
   - Crea una nueva API Key gratuita
3. **Introduce tu API Key** en la aplicación (solo la primera vez)
4. **Sube tu material**: PDF o pega texto de economía
5. **¡Responde el cuestionario y aprende!**

*Tu API Key se guarda localmente en tu navegador - nunca la vemos nosotros*



## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build de producción

## 🔧 Estructura del Proyecto

```
├── src/
│   ├── components/          # Componentes React
│   ├── services/           # Servicios (Gemini API)
│   ├── types.ts           # Definiciones TypeScript
│   └── App.tsx            # Componente principal
├── public/                # Archivos estáticos
├── .env.example          # Plantilla de variables de entorno
└── package.json          # Configuración del proyecto
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Reconocimientos

- Desarrollado con [Google Gemini AI](https://ai.google.dev/)
- UI inspirada en mejores prácticas de UX educativo
- Creado para mejorar la educación económica

---

**¿Encontraste un bug o tienes una sugerencia?** ¡Abre un [issue](../../issues)!