import React, { useState, useEffect, useRef } from "react";

function MemoirForm({ memoirs = [], onSave, editId, initialMemoir, onCancel }) {
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
    tags: "",
    photo: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialMemoir) {
      setForm({
        title: initialMemoir.title || "",
        date: initialMemoir.date || "",
        content: initialMemoir.content || "",
        tags: (initialMemoir.tags || []).join(", "),
        photo: null
      });
      setPreview(initialMemoir.photo ? `http://localhost:4000${initialMemoir.photo}` : null);
    }
  }, [initialMemoir]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, photo: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Always build a complete memoir object with all fields as strings
    const memoirData = {
      title: form.title || "",
      date: form.date || "",
      content: form.content || "",
      tags: form.tags
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [],
      photo: form.photo || null
    };
    await onSave(memoirData);
  };

  return (
    <div className="card shadow-sm glass-card">
      <div className="card-body">
        <h2 className="card-title mb-4">{editId ? "Edit Memoir" : "Add Memoir"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={6} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Photo</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} ref={fileInputRef} />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} className="img-thumbnail" />
              </div>
            )}
          </div>
          <button type="submit" className={`btn ${editId ? "btn-warning" : "btn-success"} me-2`}>
            {editId ? "Update" : "Add"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default MemoirForm;