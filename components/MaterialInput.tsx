import React, { useState, useEffect } from 'react';

interface MaterialInputProps {
  onGenerate: (source: string | File, studentData?: {
    username: string;
    edad: number;
    sexo: 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir';
    provincia: string;
    conocimientoPrevio: 'ninguno' | 'basico' | 'intermedio' | 'avanzado';
    subject?: string;
    topic?: string;
    numQuestions?: number;
    mythDifficulty?: 'baja' | 'media' | 'alta';
  }) => void;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ onGenerate }) => {
  const [material, setMaterial] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  // Datos del estudiante para Google Sheets
  const [username, setUsername] = useState<string>('');
  const [edad, setEdad] = useState<string>(''); 
  const [sexo, setSexo] = useState<'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir'>('prefiero-no-decir');
  const [provincia, setProvincia] = useState<string>('');
  const [conocimientoPrevio, setConocimientoPrevio] = useState<'ninguno' | 'basico' | 'intermedio' | 'avanzado'>('ninguno');
  
  // Número de preguntas
  const [numQuestions, setNumQuestions] = useState<number>(5);
  
  // Dificultad/temperatura de los mitos
  const [mythDifficulty, setMythDifficulty] = useState<'baja' | 'media' | 'alta'>('media');

  // Función para detectar asignaturas disponibles
  const loadAvailableSubjects = async () => {
    try {
      const response = await fetch('/materials-metadata.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar el metadata de materiales');
      }
      const metadata = await response.json();
      const subjects = Object.keys(metadata);
      setAvailableSubjects(subjects);
      console.log('Asignaturas detectadas:', subjects);
    } catch (error) {
      console.error('Error cargando asignaturas:', error);
      // Fallback a lista hardcodeada si falla
      const subjects = ['Economía Política', 'Macroeconómia Básica', 'Políticas SocioLaborales'];
      setAvailableSubjects(subjects);
    }
  };

  // Función para cargar temas de una asignatura específica
  const loadTopicsForSubject = async (subjectName: string) => {
    try {
      const response = await fetch('/materials-metadata.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar el metadata de materiales');
      }
      const metadata = await response.json();
      const topics = metadata[subjectName] || [];
      setAvailableTopics(topics);
      setSelectedTopic(''); // Reset topic selection
      console.log(`Temas para ${subjectName}:`, topics);
    } catch (error) {
      console.error('Error cargando temas:', error);
      setAvailableTopics([]);
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
    
    // Crear objeto con datos del estudiante
    const studentData = {
      username: username,
      edad: parseInt(edad) || 0,
      sexo: sexo,
      provincia: provincia,
      conocimientoPrevio: conocimientoPrevio,
      subject: selectedSubject,
      topic: selectedTopic,
      numQuestions: numQuestions,
      mythDifficulty: mythDifficulty
    };
    
    // Prioridad: 1. Tema seleccionado, 2. Archivo subido, 3. Texto pegado
    if (selectedSubject && selectedTopic) {
      // Cargar PDF seleccionado desde las carpetas
      loadSelectedPDF(selectedSubject, selectedTopic, studentData);
    } else if (file) {
      onGenerate(file, studentData);
    } else if (material.trim()) {
      onGenerate(material, studentData);
    }
  };
  
  // Función para cargar el PDF seleccionado
  const loadSelectedPDF = async (subject: string, topic: string, studentData: any) => {
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
      onGenerate(file, studentData);
    } catch (error) {
      console.error('Error cargando PDF:', error);
      alert(`Error cargando el tema seleccionado: ${error}`);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{backgroundColor: '#003772'}}>
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto border-2 animate-fade-in" style={{borderColor: '#003772'}}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{backgroundColor: '#003772'}}>
              <img 
                src="/images/logo.png" 
                alt="Universidad Pablo de Olavide" 
                className="h-8 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold" style={{background: 'linear-gradient(135deg, #003772 0%, #FCC100 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              📚 Economics Myth Buster
            </h2>
          </div>
          <h3 className="text-2xl font-semibold mb-4" style={{color: '#003772'}}>
            Selecciona la Asignatura y Material
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Elige una asignatura de la lista o sube tu propio material.
          </p>
        </div>
        
        {/* Datos del Estudiante */}
        <div className="bg-slate-50 border-2 p-6 rounded-xl mb-8 shadow-sm" style={{borderColor: '#003772'}}>
          <h3 className="text-lg font-semibold mb-2 flex items-center" style={{color: '#003772'}}>
            <span className="text-2xl mr-2">👨‍🎓</span>
            Datos del Participante
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            🔒 Estos datos son anónimos y confidenciales. No se harán públicos ni se compartirán con terceros.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#003772'}}>
                Nombre de usuario:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Elige un username"
                className="w-full p-3 border-2 rounded-lg text-base bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{borderColor: '#003772'}}
              />
            </div>
            
            {/* Edad */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#003772'}}>
                Edad:
              </label>
              <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Tu edad"
                min="10"
                max="100"
                className="w-full p-3 border-2 rounded-lg text-base bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{borderColor: '#003772'}}
              />
            </div>
            
            {/* Sexo */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#003772'}}>
                Género:
              </label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as any)}
                className="w-full p-3 border-2 rounded-lg text-base bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{borderColor: '#003772'}}
              >
                <option value="prefiero-no-decir">Prefiero no decir</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#003772'}}>
                Provincia:
              </label>
              <input
                type="text"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                placeholder="Tu provincia"
                className="w-full p-3 border-2 rounded-lg text-base bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{borderColor: '#003772'}}
              />
            </div>
            
            {/* Conocimiento Previo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{color: '#003772'}}>
                ¿Has estudiado economía anteriormente?
              </label>
              <select
                value={conocimientoPrevio}
                onChange={(e) => setConocimientoPrevio(e.target.value as any)}
                className="w-full p-3 border-2 rounded-lg text-base bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{borderColor: '#003772'}}
              >
                <option value="ninguno">No, es mi primera vez</option>
                <option value="basico">Sí, nivel básico (secundaria)</option>
                <option value="intermedio">Sí, nivel intermedio (bachillerato/FP)</option>
                <option value="avanzado">Sí, nivel avanzado (universidad/posgrado)</option>
              </select>
            </div>
          </div>
          
          {username && edad && provincia && (
            <div className="mt-4 p-3 rounded-lg text-center" style={{backgroundColor: '#003772', color: 'white'}}>
              <p className="text-sm font-medium">
                ✅ Datos completados - Ya puedes configurar tu cuestionario
              </p>
            </div>
          )}
        </div>
        
        {/* Selector de Número de Preguntas */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 p-6 rounded-xl mb-8 shadow-sm" style={{borderColor: '#FCC100'}}>
          <h3 className="text-lg font-semibold mb-4 flex items-center" style={{color: '#003772'}}>
            <span className="text-2xl mr-2">❓</span>
            Número de Preguntas
          </h3>
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium" style={{color: '#003772'}}>
              ¿Cuántas preguntas quieres en el cuestionario?
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="p-3 border-2 rounded-lg text-base font-semibold bg-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-yellow-500"
              style={{borderColor: '#FCC100', color: '#003772', minWidth: '100px'}}
            >
              <option value={3}>3 preguntas</option>
              <option value={5}>5 preguntas</option>
              <option value={7}>7 preguntas</option>
              <option value={10}>10 preguntas</option>
              <option value={15}>15 preguntas</option>
              <option value={20}>20 preguntas</option>
            </select>
          </div>
          <div className="mt-3 p-2 rounded-lg text-center" style={{backgroundColor: '#FCC100'}}>
            <p className="text-sm font-medium" style={{color: '#003772'}}>
              📊 Se generarán <strong>{numQuestions} preguntas</strong> sobre el material seleccionado
            </p>
          </div>
        </div>
        
        {/* Selector de Dificultad de Mitos */}
        <div className="bg-gradient-to-r from-red-50 to-purple-50 border-2 p-6 rounded-xl mb-8 shadow-sm" style={{borderColor: '#8B1538'}}>
          <h3 className="text-lg font-semibold mb-4 flex items-center" style={{color: '#003772'}}>
            <span className="text-2xl mr-2">🔥</span>
            Dificultad de Detección de Mitos
          </h3>
          <div className="space-y-4">
            <p className="text-sm" style={{color: '#003772'}}>
              Selecciona qué tan sutiles serán los mitos económicos en las preguntas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMythDifficulty('baja')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  mythDifficulty === 'baja' 
                    ? 'border-green-500 bg-green-100 shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-green-400'
                }`}
              >
                <div className="text-2xl mb-2">👶</div>
                <div className="font-bold text-green-700">Básica</div>
                <div className="text-xs text-gray-600 mt-1">Mitos evidentes, respuestas claras</div>
              </button>
              
              <button
                type="button"
                onClick={() => setMythDifficulty('media')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  mythDifficulty === 'media' 
                    ? 'border-yellow-500 bg-yellow-100 shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-yellow-400'
                }`}
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-bold text-yellow-700">Intermedia</div>
                <div className="text-xs text-gray-600 mt-1">Mitos comunes, requiere análisis</div>
              </button>
              
              <button
                type="button"
                onClick={() => setMythDifficulty('alta')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  mythDifficulty === 'alta' 
                    ? 'border-red-500 bg-red-100 shadow-lg scale-105' 
                    : 'border-gray-300 bg-white hover:border-red-400'
                }`}
              >
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-bold text-red-700">Avanzada</div>
                <div className="text-xs text-gray-600 mt-1">Mitos sutiles, conocimiento profundo</div>
              </button>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg text-center" style={{backgroundColor: mythDifficulty === 'baja' ? '#86efac' : mythDifficulty === 'media' ? '#fde047' : '#fca5a5'}}>
            <p className="text-sm font-bold" style={{color: '#003772'}}>
              🎯 Dificultad seleccionada: <strong className="uppercase">{mythDifficulty}</strong>
            </p>
          </div>
        </div>
      
      {/* Selector de Asignaturas */}
      {availableSubjects.length > 0 && (
        <div className={`p-6 rounded-xl mb-8 shadow-lg transition-all duration-300 ${
          !username || !edad || !provincia ? 'opacity-50 pointer-events-none' : ''
        }`} style={{background: 'linear-gradient(135deg, #003772 0%, #0056b3 100%)', color: 'white'}}>
          <label className="block text-xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Selecciona una asignatura:
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full p-4 border-2 rounded-xl text-lg font-medium bg-white shadow-md hover:shadow-lg transition-all duration-300"
            style={{borderColor: '#FCC100', color: '#003772'}}
          >
            <option value="">-- Elige una asignatura --</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {selectedSubject && (
            <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#FCC100', color: '#003772'}}>
              <p className="font-bold flex items-center">
                <span className="text-xl mr-2">✅</span>
                Asignatura seleccionada: <strong className="ml-2">{selectedSubject}</strong>
              </p>
            </div>
          )}
          
          {/* Selector de Temas */}
          {availableTopics.length > 0 && (
            <div className="mt-6">
              <label className="block text-xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">📝</span>
                Selecciona un tema:
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-4 border-2 rounded-xl text-lg font-medium bg-white shadow-md hover:shadow-lg transition-all duration-300"
                style={{borderColor: '#FCC100', color: '#003772'}}
              >
                <option value="">-- Elige un tema --</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic.replace('.pdf', '')} {/* Quitar extensión para mostrar */}
                  </option>
                ))}
              </select>
              {selectedTopic && (
                <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#FCC100', color: '#003772'}}>
                  <p className="font-bold flex items-center">
                    <span className="text-xl mr-2">📚</span>
                    Tema seleccionado: <strong className="ml-2">{selectedTopic.replace('.pdf', '')}</strong>
                  </p>
                </div>
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
          className="mt-8 w-full py-4 px-6 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
          style={{
            background: !selectedTopic && !material.trim() && !file 
              ? '#94a3b8' 
              : 'linear-gradient(135deg, #FCC100 0%, #003772 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <span className="text-2xl mr-3">⚡</span>
          {selectedTopic ? `Generar Cuestionario: ${selectedTopic.replace('.pdf', '')}` : 'Generar Cuestionario'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </form>
      
      {/* Copyright */}
      <div className="mt-8 text-right">
        <p className="text-sm" style={{color: '#003772'}}>
          © 2025 Manuel Alejandro Hidalgo Pérez
        </p>
      </div>
      </div>
      </div>
    </div>
  );
};

export default MaterialInput;