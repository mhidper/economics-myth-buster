import React, { useState } from 'react';

interface MaterialInputProps {
  onGenerate: (source: string | File) => void;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ onGenerate }) => {
  const [material, setMaterial] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setMaterial(''); // Clear textarea if file is selected
      } else {
        alert('Por favor, selecciona un archivo PDF válido.');
        e.target.value = '';
        setFile(null);
      }
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMaterial(e.target.value);
      if (file) {
          setFile(null);
          // Also reset the file input visually
          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onGenerate(file);
    } else if (material.trim()) {
      onGenerate(material);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">
        Paso 1: Proporciona el Material de tu Curso
      </h2>
      <p className="text-slate-500 mb-6">
        Pega el texto de tu lección o sube un PDF. La IA usará este contenido para crear un cuestionario adaptado a tus estudios.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={material}
          onChange={handleTextChange}
          placeholder="Pega el material de tu curso aquí..."
          className="w-full h-48 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />

        <div className="flex items-center justify-center my-4">
          <span className="h-px bg-slate-300 flex-grow"></span>
          <span className="mx-4 text-slate-500 font-semibold">O</span>
          <span className="h-px bg-slate-300 flex-grow"></span>
        </div>
        
        <div className="w-full">
            <label htmlFor="file-upload" className="w-full flex justify-center items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow-sm tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-4h2v4z" />
                </svg>
                <span className="text-base leading-normal">{file ? 'Cambiar archivo' : 'Seleccionar archivo PDF'}</span>
                <input id="file-upload" type='file' className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
            {file && <p className="text-center text-sm text-slate-600 mt-2">Archivo seleccionado: <span className="font-medium">{file.name}</span></p>}
        </div>

        <button
          type="submit"
          disabled={!material.trim() && !file}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
        >
          Generar Cuestionario
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MaterialInput;