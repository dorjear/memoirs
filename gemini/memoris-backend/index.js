const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;
const data = require('./data');

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.get('/api/memoirs', (req, res) => {
  res.json(data);
});

app.get('/api/memoirs/:id', (req, res) => {
  const memoir = data.find(m => m.id === parseInt(req.params.id));
  if (memoir) {
    res.json(memoir);
  } else {
    res.status(404).send('Memoir not found');
  }
});

app.post('/api/memoirs', upload.single('photo'), (req, res) => {
  const { title, content, author } = req.body;
  const newMemoir = {
    id: data.length + 1,
    title,
    content,
    author,
    date: new Date().toISOString().split('T')[0],
    photo: req.file ? `/uploads/${req.file.filename}` : null
  };
  data.push(newMemoir);
  res.status(201).json(newMemoir);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
