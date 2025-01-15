import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import ReportPage from './pages/ReportsPage'; // ✅ Import the Report Page

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Login Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Books Page Route */}
      <Route path="/books" element={<BooksPage />} />

      {/* Report Page Route */}
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  </Router>
);

export default App;






/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/


