require('dotenv').config();
const express = require('express');
const cors = require('cors');
<<<<<<< HEAD

const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
=======
const sequelize = require('./database');
>>>>>>> 6e3653cb39648374608b1606424a8f3da54c1979

const messagesRouter = require('./messages');

const app = express();

// CORS configuration - allow frontend to connect from multiple ports
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

<<<<<<< HEAD
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/messages', messagesRouter);

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, mfa_enabled } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const normEmail = String(email).trim().toLowerCase();

    const exists = await db.query('SELECT id FROM _user WHERE email = $1', [normEmail]);
    if (exists.rows.length) return res.status(409).json({ error: 'email already in use' });

    const password_hash = await bcrypt.hash(password, 10);

    const insert = await db.query(
      `INSERT INTO _user (name, email, password_hash, role, mfa_enabled)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, name, email, role, created_at`,
      [name, normEmail, password_hash, role || 'researcher', !!mfa_enabled]
    );

    const user = insert.rows[0];
    const secret = process.env.JWT_SECRET || 'pinneaple'; // consider changing in .env
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' });

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const normEmail = String(email).trim().toLowerCase();
    const found = await db.query(
      'SELECT id, name, email, role, created_at, password_hash FROM _user WHERE email = $1',
      [normEmail]
    );
    if (!found.rows.length) return res.status(401).json({ error: 'invalid email or password' });

    const userRow = found.rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'invalid email or password' });

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      created_at: userRow.created_at
    };

    const secret = process.env.JWT_SECRET || 'pinneaple';
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '7d' });

    return res.json({ user, token });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
=======
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

//ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const researcherRoutes = require('./routes/researcherRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const messageRoutes = require('./routes/messagesRoutes');

// Mount routes with /api prefix for clarity
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/researchers', researcherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 4000;

// Start server after database connection is ready
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    
    // Sync database (use migrations in production!)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✓ Database synchronized');
    }
    
    app.listen(PORT, () => {
      console.log(`✓ Backend server running on http://localhost:${PORT}`);
      console.log(`✓ Health check available at http://localhost:${PORT}/health`);
      console.log(`✓ API endpoints available at http://localhost:${PORT}/api/*`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

startServer();
>>>>>>> 6e3653cb39648374608b1606424a8f3da54c1979
