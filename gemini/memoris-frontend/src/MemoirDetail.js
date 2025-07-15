import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function MemoirDetail() {
  const [memoir, setMemoir] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/api/memoirs/${id}`)
      .then(response => response.json())
      .then(data => setMemoir(data));
  }, [id]);

  if (!memoir) {
    return <div>Loading...</div>;
  }

  return (
    <div className="memoir-detail">
      <div className="memoir-card">
        {memoir.photo && <img src={`http://localhost:3001${memoir.photo}`} alt={memoir.title} />}
        <h2>{memoir.title}</h2>
        <p>{memoir.content}</p>
        <p><strong>{memoir.author}</strong> - <em>{memoir.date}</em></p>
      </div>
    </div>
  );
}

export default MemoirDetail;
