/**
 * Test Setup and Helper Utilities
 * 
 * This file provides database setup/teardown and helper functions for tests
 */

const { Sequelize } = require('sequelize');
const config = require('../../src/config/database');

// Use test environment
const env = 'test';
const dbConfig = config[env];

let sequelize;

/**
 * Initialize test database connection
 */
async function setupTestDatabase() {
  if (!sequelize) {
    sequelize = new Sequelize(dbConfig.url, {
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      pool: dbConfig.pool,
      dialectOptions: dbConfig.dialectOptions
    });
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Test database connection established');
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to test database:', error);
    throw error;
  }
}

/**
 * Sync all models (create tables)
 */
async function syncDatabase(options = {}) {
  const defaultOptions = { force: true, ...options };
  
  try {
    await sequelize.sync(defaultOptions);
    console.log('✅ Test database synchronized');
  } catch (error) {
    console.error('❌ Failed to sync database:', error);
    throw error;
  }
}

/**
 * Clear all tables
 */
async function clearDatabase() {
  try {
    const models = Object.values(sequelize.models);
    
    // Disable foreign key checks temporarily
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Truncate all tables
    for (const model of models) {
      await model.destroy({ 
        where: {}, 
        force: true,
        truncate: true,
        cascade: true
      });
    }
    
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    console.log('✅ Test database connection closed');
  }
}

/**
 * Create a test user
 */
async function createTestUser(overrides = {}) {
  const { User } = require('../../src/database/models');
  const bcrypt = require('bcrypt');
  
  const defaultData = {
    name: 'Test User',
    email: 'test@example.com',
    password_hash: await bcrypt.hash('password123', 10),
    role: 'researcher',
    mfa_enabled: false
  };
  
  return await User.create({ ...defaultData, ...overrides });
}

/**
 * Create a test organization
 */
async function createTestOrganization(overrides = {}) {
  const { Organization } = require('../../src/database/models');
  
  const defaultData = {
    name: 'Test Organization',
    description: 'A test organization',
    website: 'https://test.org',
    contact_email: 'contact@test.org',
    verified: false
  };
  
  return await Organization.create({ ...defaultData, ...overrides });
}

/**
 * Wait for a promise to reject
 */
async function expectToReject(promise) {
  try {
    await promise;
    throw new Error('Expected promise to reject, but it resolved');
  } catch (error) {
    return error;
  }
}

/**
 * Generate random email
 */
function generateEmail(prefix = 'test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
}

module.exports = {
  setupTestDatabase,
  syncDatabase,
  clearDatabase,
  closeDatabase,
  createTestUser,
  createTestOrganization,
  expectToReject,
  generateEmail,
  getSequelize: () => sequelize
};
