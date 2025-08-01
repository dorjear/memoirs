import React, { useState, useEffect, useRef } from "react";
import { Memoir } from "@/types/memoir";

interface MemoirFormProps {
  memoirs?: Memoir[];
  onSave: (memoir: Omit<Memoir, 'id'>) => Promise<void>;
  editId: number | null;
  initialMemoir: Memoir | null;
  onCancel: () => void;
}

function MemoirForm({ memoirs = [], onSave, editId, initialMemoir, onCancel }: MemoirFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
    tags: "",
    photo: null as File | null
  });
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setForm(f => ({ ...f, photo: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const memoirData: Omit<Memoir, 'id'> = {
      title: form.title || "",
      date: form.date || "",
      content: form.content || "",
      tags: form.tags
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [],
      photo: form.photo
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