import React, { useState } from 'react';

interface ApiKeySetupProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Bienvenido al Cazador de Mitos Económicos
        </h1>
        <p className="text-slate-500 mb-6">
          Para comenzar, necesitas una clave de API de Google Gemini. Es gratis y te permite interactuar con el modelo de IA.
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
          <p className="text-xs text-slate-400 mb-6">
            Tu clave se guardará únicamente en tu navegador. No la compartimos con nadie.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors duration-300"
          >
            Guardar y Empezar
          </button>
        </form>

        <div className="mt-6">
            <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                ¿No tienes una clave? Consíguela aquí &rarr;
            </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
