const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory store for journal entries
let journalEntries = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET: All journal entries
app.get('/api/entries', (req, res) => {
  res.json(journalEntries);
});

// POST: Add new journal entry
app.post('/api/entries', (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content || !date) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const newEntry = {
    id: Date.now(),
    title,
    content,
    date
  };

  journalEntries.unshift(newEntry); // Add to beginning
  res.status(201).json(newEntry);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
