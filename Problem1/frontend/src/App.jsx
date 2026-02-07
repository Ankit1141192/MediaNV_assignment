import React from 'react';
import DatabaseForm from './components/DatabaseForm';
import DatabaseCheck from './components/DatabaseCheck';
import MigrationForm from './components/MigrationForm';

function App() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="text-center space-y-4 animate-float">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-xl tracking-tight">
            PostgreSQL Manager
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Effortlessly manage your databases, perform checks, and migrate data with a modern, intuitive interface.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <DatabaseForm />
          </div>
          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <DatabaseCheck />
          </div>
        </div>

        {/* Migration Section */}
        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <MigrationForm />
        </div>

      </div>
    </div>
  );
}

export default App;
