
import React from 'react';

interface SpinnerProps {
  text: string;
}

const Spinner: React.FC<SpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-600 font-semibold">{text}</p>
    </div>
  );
};

export default Spinner;
