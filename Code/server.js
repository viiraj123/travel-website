const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = []; // In-memory user store

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });

  const existing = users.find(u => u.email === email);
  if (existing)
    return res.status(409).json({ error: 'User already exists.' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    users.push({ name, email, password: hashed });
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Internal error.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

const DATA_FILE = 'locations.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Load saved locations or fallback
let locations = [];
if (fs.existsSync(DATA_FILE)) {
  const raw = fs.readFileSync(DATA_FILE);
  locations = JSON.parse(raw);
}

// GET all locations
app.get('/api/locations', (req, res) => {
  res.json(locations);
});

// POST a new location
app.post('/api/locations', (req, res) => {
  const { name, lat, lng } = req.body;

  if (!name || !lat || !lng) {
    return res.status(400).json({ error: 'Missing location data.' });
  }

  const newLocation = { name, lat, lng };
  locations.push(newLocation);

  // Save to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));

  res.status(201).json({ message: 'Location added!', location: newLocation });
});

app.listen(PORT, () => {
  console.log(`✅ RoamScape backend running at http://localhost:${PORT}`);
});
