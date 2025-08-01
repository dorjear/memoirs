'use client';

import React, { useState, useEffect } from "react";
import MemoirList from "@/components/MemoirList";
import MemoirDetail from "@/components/MemoirDetail";
import MemoirForm from "@/components/MemoirForm";
import { Memoir } from "@/types/memoir";

async function getMemoirs(): Promise<Memoir[]> {
  const res = await fetch("http://localhost:4000/api/memoirs", { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch memoirs');
  }
  return res.json();
}

export default function Home() {
  const [memoirs, setMemoirs] = useState<Memoir[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemoirId, setSelectedMemoirId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMemoirId, setEditMemoirId] = useState<number | null>(null);

  useEffect(() => {
    fetchMemoirs();
  }, []);

  const fetchMemoirs = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/api/memoirs", { cache: 'no-store' });
    const data = await res.json();
    setMemoirs(data);
    setLoading(false);
  };

  const addMemoir = async (memoir: Omit<Memoir, 'id'>) => {
    const formData = new FormData();
    formData.append("title", memoir.title);
    formData.append("date", memoir.date);
    formData.append("content", memoir.content);
    formData.append("tags", JSON.stringify(memoir.tags));
    if (memoir.photo instanceof File) {
      formData.append("photo", memoir.photo);
    }

    await fetch("http://localhost:4000/api/memoirs", {
      method: "POST",
      body: formData
    });
    await fetchMemoirs();
    setShowForm(false);
    setSelectedMemoirId(memoirs.length ? memoirs.length + 1 : 1);
  };

  const editMemoir = async (id: number, updatedMemoir: Omit<Memoir, 'id'>) => {
    const formData = new FormData();
    formData.append("title", updatedMemoir.title);
    formData.append("date", updatedMemoir.date);
    formData.append("content", updatedMemoir.content);
    formData.append("tags", JSON.stringify(updatedMemoir.tags));
    if (updatedMemoir.photo instanceof File) {
      formData.append("photo", updatedMemoir.photo);
    }
    await fetch(`http://localhost:4000/api/memoirs/${id}`, {
      method: "PUT",
      body: formData
    });
    await fetchMemoirs();
    setShowForm(false);
    setSelectedMemoirId(id);
  };

  const handleSelectMemoir = (id: number) => {
    setSelectedMemoirId(id);
    setShowForm(false);
    setEditMemoirId(null);
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditMemoirId(null);
  };

  const handleEditClick = (id: number) => {
    setShowForm(true);
    setEditMemoirId(id);
  };

  if (loading) return <div className="container mt-5 glass p-5">Loading...</div>;

  const selectedMemoir = memoirs.find(m => m.id === selectedMemoirId);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 glass">
        <div className="container">
          <span className="navbar-brand">Memoir App</span>
          <button className="btn btn-success" onClick={handleAddClick}>Add Memoir</button>
        </div>
      </nav>
      <div className="container glass p-4">
        <div className="row">
          {/* Left: Memoir List */}
          <div className="col-md-5">
            <MemoirList
              memoirs={memoirs}
              onSelect={handleSelectMemoir}
              selectedId={selectedMemoirId}
            />
          </div>
          {/* Right: Detail or Form */}
          <div className="col-md-7">
            {showForm ? (
              <MemoirForm
                memoirs={memoirs}
                onSave={editMemoirId ? (data: Omit<Memoir, 'id'>) => editMemoir(editMemoirId, data) : addMemoir}
                editId={editMemoirId}
                initialMemoir={editMemoirId ? memoirs.find(m => m.id === editMemoirId) : null}
                onCancel={() => setShowForm(false)}
              />
            ) : selectedMemoir ? (
              <MemoirDetail
                memoir={selectedMemoir}
                onEdit={() => handleEditClick(selectedMemoir.id)}
              />
            ) : (
              <div className="alert alert-info glass-card">Select a memoir to view details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
