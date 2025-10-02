require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Register route
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, mfa_enabled } = req.body || {}
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' })

    // basic email normalization
    const normEmail = String(email).trim().toLowerCase()

    // check existing
    const exists = await db.query('SELECT id FROM _user WHERE email = $1', [normEmail])
    if (exists.rows.length) return res.status(409).json({ error: 'email already in use' })

    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    const insert = await db.query(
      `INSERT INTO _user (name, email, password_hash, role, mfa_enabled) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role, created_at`,
      [name, normEmail, password_hash, role || 'researcher', !!mfa_enabled]
    )

    const user = insert.rows[0]
  // Sign JWT and return created user (do not return password_hash)
  const secret = process.env.JWT_SECRET || 'pinneaple'
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' })
  return res.status(201).json({ user, token })
  } catch (err) {
    console.error('register error', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    const normEmail = String(email).trim().toLowerCase()
    const found = await db.query('SELECT id, name, email, role, created_at, password_hash FROM _user WHERE email = $1', [normEmail])
    if (!found.rows.length) return res.status(401).json({ error: 'invalid email or password' })

    const userRow = found.rows[0]
    const ok = await bcrypt.compare(password, userRow.password_hash || '')
    if (!ok) return res.status(401).json({ error: 'invalid email or password' })

    // build a safe user object without sensitive fields
    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      created_at: userRow.created_at
    }

    const secret = process.env.JWT_SECRET || 'pinneaple'
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' })

    return res.json({ user, token })
  } catch (err) {
    console.error('login error', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
