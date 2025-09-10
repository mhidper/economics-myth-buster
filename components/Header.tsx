import React from 'react';

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <BookIcon className="h-8 w-8 text-blue-600" />
        <h1 className="ml-3 text-2xl font-bold text-slate-800 tracking-tight">
          Cazador de Mitos Económicos
        </h1>
      </div>
    </header>
  );
};

export default Header;