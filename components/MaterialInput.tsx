import React, { useState, useEffect } from 'react';

interface MaterialInputProps {
  onGenerate: (source: string | File) => void;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ onGenerate }) => {
  const [material, setMaterial] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  // Función para detectar asignaturas disponibles
  const loadAvailableSubjects = async () => {
    try {
      // Por ahora, lista hardcodeada basada en tu estructura actual
      // En el siguiente paso haremos esto dinámico
      const subjects = ['Economía Política', 'Macroeconómia Básica', 'Políticas SocioLaborales'];
      setAvailableSubjects(subjects);
      console.log('Asignaturas detectadas:', subjects);
    } catch (error) {
      console.error('Error cargando asignaturas:', error);
    }
  };

  // Función para cargar temas de una asignatura específica
  const loadTopicsForSubject = async (subjectName: string) => {
    try {
      // Por ahora, mapeo hardcodeado basado en tu estructura actual
      const topicMap: Record<string, string[]> = {
        'Economía Política': [
          'Tema 1. La Escasez y el Coste de Oportunidad.pdf',
          'Tema 2. La División del Trabajo y la Eficiencia.pdf'
        ],
        'Macroeconómia Básica': [
          // Vacío por ahora
        ],
        'Políticas SocioLaborales': [
          'Tema 1 El Mercado de Trabajo. Equilibrio y tipos de desempleo.pdf'
        ]
      };
      
      const topics = topicMap[subjectName] || [];
      setAvailableTopics(topics);
      setSelectedTopic(''); // Reset topic selection
      console.log(`Temas para ${subjectName}:`, topics);
    } catch (error) {
      console.error('Error cargando temas:', error);
    }
  };

  useEffect(() => {
    loadAvailableSubjects();
  }, []);

  // Cargar temas cuando se selecciona una asignatura
  const handleSubjectChange = (subjectName: string) => {
    setSelectedSubject(subjectName);
    if (subjectName) {
      loadTopicsForSubject(subjectName);
    } else {
      setAvailableTopics([]);
      setSelectedTopic('');
    }
  };

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
    
    // Prioridad: 1. Tema seleccionado, 2. Archivo subido, 3. Texto pegado
    if (selectedSubject && selectedTopic) {
      // Cargar PDF seleccionado desde las carpetas
      loadSelectedPDF(selectedSubject, selectedTopic);
    } else if (file) {
      onGenerate(file);
    } else if (material.trim()) {
      onGenerate(material);
    }
  };
  
  // Función para cargar el PDF seleccionado
  const loadSelectedPDF = async (subject: string, topic: string) => {
    try {
      const pdfPath = `/materials/${subject}/${topic}`;
      console.log('Intentando cargar PDF:', pdfPath);
      
      const response = await fetch(pdfPath);
      if (!response.ok) {
        throw new Error(`No se pudo cargar el archivo: ${response.status}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], topic, { type: 'application/pdf' });
      
      console.log('PDF cargado exitosamente:', topic);
      onGenerate(file);
    } catch (error) {
      console.error('Error cargando PDF:', error);
      alert(`Error cargando el tema seleccionado: ${error}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">
        Selecciona la Asignatura y Material
      </h2>
      <p className="text-slate-500 mb-6">
        Elige una asignatura de la lista o sube tu propio material.
      </p>
      
      {/* Selector de Asignaturas */}
      {availableSubjects.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📚 Selecciona una asignatura:
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">-- Elige una asignatura --</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {selectedSubject && (
            <p className="text-sm text-green-600 mt-2">
              ✅ Has seleccionado: <strong>{selectedSubject}</strong>
            </p>
          )}
          
          {/* Selector de Temas */}
          {availableTopics.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📝 Selecciona un tema:
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">-- Elige un tema --</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic.replace('.pdf', '')} {/* Quitar extensión para mostrar */}
                  </option>
                ))}
              </select>
              {selectedTopic && (
                <p className="text-sm text-blue-600 mt-2">
                  📚 Tema seleccionado: <strong>{selectedTopic.replace('.pdf', '')}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-slate-700 mb-4">
          O sube tu propio material:
        </h3>
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
          disabled={!selectedTopic && !material.trim() && !file}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
        >
          {selectedTopic ? `Generar Cuestionario: ${selectedTopic.replace('.pdf', '')}` : 'Generar Cuestionario'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </form>
      </div>
    </div>
  );
};

export default MaterialInput;