import React from "react";

function MemoirList({ memoirs, onSelect, selectedId }) {
  if (!memoirs.length) return <div className="alert alert-info">No memoirs found.</div>;
  return (
    <div>
      <h2 className="mb-4">Memoir List</h2>
      <div className="list-group">
        {memoirs.map(memoir => (
          <button
            key={memoir.id}
            className={`list-group-item list-group-item-action d-flex align-items-center ${selectedId === memoir.id ? "active" : ""}`}
            onClick={() => onSelect(memoir.id)}
            style={{ cursor: "pointer" }}
          >
            {memoir.photo && (
              <img
                src={`http://localhost:4000${memoir.photo}`}
                alt={memoir.title}
                className="rounded me-3"
                style={{ width: "48px", height: "48px", objectFit: "cover", flexShrink: 0 }}
              />
            )}
            <div>
              <div className="fw-bold">{memoir.title}</div>
              <div className="text-muted small">{memoir.date}</div>
              <div>
                {memoir.tags.map(tag => (
                  <span className="badge bg-secondary me-1" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MemoirList;