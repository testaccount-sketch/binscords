const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for users (for demonstration purposes)
const users = {};

// Helper function to generate a private key
function generatePrivateKey() {
  return crypto.randomBytes(64).toString('base64');
}

// Register endpoint
app.post('/register', (req, res) => {
  const { email, password, secretKey } = req.body;
  if (!email || !password || !secretKey) {
    return res.status(400).send('Missing required fields');
  }

  const privateKey = generatePrivateKey();
  users[email] = {
    password,
    privateKey: privateKey.slice(0, privateKey.length / 2), // Store half of the private key
    secretKey
  };

  res.json({ privateKey });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, privateKey } = req.body;
  if (!email || !privateKey) {
    return res.status(400).send('Missing required fields');
  }

  const user = users[email];
  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.privateKey === privateKey.slice(0, privateKey.length / 2)) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid private key');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
