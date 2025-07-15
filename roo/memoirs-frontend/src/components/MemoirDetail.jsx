import React from "react";

function MemoirDetail({ memoir, onEdit }) {
  if (!memoir) return <div className="alert alert-info glass-card">Select a memoir to view details.</div>;

  return (
    <div className="card shadow-sm glass-card">
      {memoir.photo && (
        <img
          src={`http://localhost:4000${memoir.photo}`}
          alt={memoir.title}
          className="card-img-top"
          style={{ objectFit: "cover", maxHeight: "350px" }}
        />
      )}
      <div className="card-body">
        <h2 className="card-title">{memoir.title}</h2>
        <h6 className="card-subtitle mb-2 text-muted">{memoir.date}</h6>
        <div className="mb-2">
          {memoir.tags.map(tag => (
            <span className="badge bg-secondary me-1" key={tag}>{tag}</span>
          ))}
        </div>
        <p className="card-text">{memoir.content}</p>
        <button className="btn btn-warning me-2" onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
}

export default MemoirDetail;