require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

//ROUTES
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;

// Start server after database connection is ready
async function startServer() {
  try {
    // Sync database (use migrations in production!)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('Database synchronized');
    }
    
    app.listen(PORT, () => {
      console.log(`Backend listening on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();