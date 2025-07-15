const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// In-memory memoir data
let memoirs = [
  {
    id: 1,
    title: "My First Memory",
    date: "2023-01-01",
    content: "This is the content of my first memory.",
    tags: ["childhood", "family"],
    photo: null
  },
  {
    id: 2,
    title: "A Day at the Beach",
    date: "2023-02-15",
    content: "Sunny skies and sandy toes.",
    tags: ["vacation", "beach"],
    photo: null
  }
];

// Get all memoirs
app.get('/api/memoirs', (req, res) => {
  res.json(memoirs);
});

// Get a single memoir by id
app.get('/api/memoirs/:id', (req, res) => {
  const memoir = memoirs.find(m => m.id === parseInt(req.params.id));
  if (!memoir) return res.status(404).json({ error: 'Memoir not found' });
  res.json(memoir);
});

// Create a new memoir with optional photo
app.post('/api/memoirs', upload.single('photo'), (req, res) => {
  const { title, date, content, tags } = req.body;
  let tagsArr = [];
  try {
    tagsArr = typeof tags === 'string' ? JSON.parse(tags) : tags;
  } catch {
    tagsArr = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }
  const newMemoir = {
    id: memoirs.length ? Math.max(...memoirs.map(m => m.id)) + 1 : 1,
    title,
    date,
    content,
    tags: tagsArr || [],
    photo: req.file ? `/uploads/${req.file.filename}` : null
  };
  memoirs.push(newMemoir);
  res.status(201).json(newMemoir);
});

// Edit an existing memoir with optional photo
app.put('/api/memoirs/:id', upload.single('photo'), (req, res) => {
  const { title, date, content, tags } = req.body;
  let tagsArr = [];
  try {
    tagsArr = typeof tags === 'string' ? JSON.parse(tags) : tags;
  } catch {
    tagsArr = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }
  const memoir = memoirs.find(m => m.id === parseInt(req.params.id));
  if (!memoir) return res.status(404).json({ error: 'Memoir not found' });
  memoir.title = title;
  memoir.date = date;
  memoir.content = content;
  memoir.tags = tagsArr || [];
  if (req.file) {
    memoir.photo = `/uploads/${req.file.filename}`;
  }
  res.json(memoir);
});

app.listen(PORT, () => {
  console.log(`Memoir backend running on http://localhost:${PORT}`);
});