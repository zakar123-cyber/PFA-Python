import React from 'react';
import './App.css';

import Leaderboard from './components/leaderboard';
import QuizListTable from './components/QuizListTable'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <nav className="navbar navbar-dark bg-primary mb-4">
          <div className="container">
            <span className="navbar-brand">Quiz Application</span>
          </div>
        </nav>

        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={
              <div className="container-fluid px-4">
                <div className="row">
                  {/* Main quiz list column */}
                  <div className="col-lg-7 mb-4">
                    <QuizListTable />
                  </div>
                  {/* Leaderboard column */}
                  <div className="col-lg-5">
                    <div style={{ position: 'sticky', top: '20px' }}>
                      <Leaderboard />
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>

        <footer className="footer">
          <div className="container text-center py-3">
            <span className="text-muted">&copy; 2025 Quiz Application</span>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
