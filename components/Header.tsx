import React from 'react';

const ChartBarIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
            <ChartBarIcon className="w-8 h-8 text-sky-400" />
            <h1 className="ml-3 text-2xl font-bold text-white tracking-wider">
                AI Stock Comparator
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
