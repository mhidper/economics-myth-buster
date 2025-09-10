import React, { useState } from 'react';

interface ApiKeySetupProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              📚 Economics Myth Buster
            </h1>
            <p className="text-lg text-slate-600">
              ¡Bienvenido! Identifica y desmiente mitos económicos con IA.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  🔑 Necesitas una API Key de Google Gemini (100% GRATIS)
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Esta aplicación usa tu propia clave de API para garantizar tu privacidad y que no tengas límites.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-slate-700">
              🚀 ¿Cómo obtener tu API Key GRATIS?
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-2">
                📍 Requisitos:
              </h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Una cuenta de Google/Gmail (si tienes Android o usas Gmail, ya la tienes)</li>
                <li>• Acceso a internet</li>
                <li>• ¡Solo toma 2 minutos!</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-400 bg-green-50 p-4">
              <h3 className="font-medium text-green-800 mb-3">
                ⚡ Pasos rápidos:
              </h3>
              <ol className="text-sm text-green-700 space-y-2">
                <li><strong>1.</strong> Haz clic en el botón de abajo para ir a Google AI Studio</li>
                <li><strong>2.</strong> Inicia sesión con tu cuenta de Google/Gmail</li>
                <li><strong>3.</strong> Haz clic en "Create API Key" (Crear clave de API)</li>
                <li><strong>4.</strong> Copia la clave que te genere</li>
                <li><strong>5.</strong> Vuelve aquí y pégala en el formulario</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    🔒 Tu privacidad está protegida
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Tu clave se guarda únicamente en tu navegador. Nosotros nunca la vemos ni almacenamos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 text-center flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Obtener API Key Gratis
            </a>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 transition-colors duration-300"
            >
              Ya tengo mi API Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          🔑 Introduce tu API Key
        </h1>
        <p className="text-slate-500 mb-6">
          Pega aquí la clave de API que obtuviste de Google AI Studio.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 text-left mb-1">
              Tu Clave de API de Google Gemini
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pega tu clave de API aquí"
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-700">
              ✓ Tu clave se guardará únicamente en tu navegador
            </p>
            <p className="text-xs text-green-700">
              ✓ Nosotros nunca la vemos ni almacenamos
            </p>
          </div>

          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 mb-4"
          >
            Guardar y Empezar
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowInstructions(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver a las instrucciones
          </button>
          
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:underline"
          >
            ¿No tienes una clave? Consíguela aquí →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
