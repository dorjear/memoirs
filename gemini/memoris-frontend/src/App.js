import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import AddMemoir from './AddMemoir.js';
import MemoirDetail from './MemoirDetail.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memoir/:id" element={<MemoirDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const [memoirs, setMemoirs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/memoirs')
      .then(response => response.json())
      .then(data => setMemoirs(data));
  }, []);

  const handleAddMemoir = (newMemoir) => {
    setMemoirs([...memoirs, newMemoir]);
    setIsFormVisible(false);
  };

  return (
    <>
      <header className="App-header">
        <h1>Memoirs</h1>
        <button onClick={() => setIsFormVisible(!isFormVisible)} className="add-button">
          {isFormVisible ? 'Close' : 'Add Memoir'}
        </button>
      </header>
      {isFormVisible && <AddMemoir onAdd={handleAddMemoir} />}
      <div className="memoir-list">
        {memoirs.map(memoir => (
          <Link to={`/memoir/${memoir.id}`} key={memoir.id} className="memoir-card-link">
            <div className="memoir-card">
              {memoir.photo && <img src={`http://localhost:3001${memoir.photo}`} alt={memoir.title} />}
              <h2>{memoir.title}</h2>
              <p>{memoir.content}</p>
              <p><strong>{memoir.author}</strong> - <em>{memoir.date}</em></p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default App;
