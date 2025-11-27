require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');

const app = express();

// CORS configuration - allow frontend to connect
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

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

// Mount routes with /api prefix for clarity
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/researchers', researcherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

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