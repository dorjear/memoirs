import React, { useState } from 'react';

function AddMemoir({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('photo', photo);

    fetch('http://localhost:3001/api/memoirs', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(newMemoir => {
        onAdd(newMemoir);
        setTitle('');
        setContent('');
        setAuthor('');
        setPhoto(null);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="add-memoir-form">
      <h2>Add a New Memoir</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
      />
      <button type="submit">Add Memoir</button>
    </form>
  );
}

export default AddMemoir;
