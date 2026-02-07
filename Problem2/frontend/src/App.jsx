import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <nav className="bg-white shadow">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-800">
                <a href="/">Candidate Management System</a>
              </div>
            </div>
          </div>
        </nav>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<CandidateList />} />
            <Route path="/add" element={<CandidateForm />} />
            <Route path="/edit/:id" element={<CandidateForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
