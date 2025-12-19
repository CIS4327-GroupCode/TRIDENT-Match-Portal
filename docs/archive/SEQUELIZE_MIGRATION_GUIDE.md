# Sequelize ORM Implementation Guide for TRIDENT-Match-Portal

## Table of Contents
1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Sequelize Setup](#sequelize-setup)
4. [Model Migration Strategy](#model-migration-strategy)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Best Practices](#best-practices)
7. [Testing Strategy](#testing-strategy)

---

## Overview

This guide provides a roadmap for migrating the TRIDENT-Match-Portal backend from raw PostgreSQL queries (`pg` pool) to **Sequelize ORM** while minimizing disruption to the existing codebase.

### Why Sequelize?
- **Model-based architecture**: Define database schema as JavaScript classes
- **Migrations support**: Version-controlled database changes
- **Validation**: Built-in data validation before database operations
- **Associations**: Easily manage relationships between models
- **Query abstraction**: Reduce SQL boilerplate and prevent SQL injection
- **Database agnostic**: Easy to switch databases if needed

### Current Architecture
```
backend/
├── src/
│   ├── db.js                    # Raw pg Pool connection
│   ├── index.js                 # Express app entry
│   ├── models/
│   │   └── authModel.js         # Raw SQL queries for user operations
│   ├── controllers/
│   │   └── authController.js    # Business logic
│   └── routes/
│       └── authRoutes.js        # Route definitions
```

---

## Current State Analysis

### Database Connection (`db.js`)
- Uses `pg` Pool for direct PostgreSQL connections
- Exports a simple query wrapper function
- Connection established on app startup

### Auth Model (`authModel.js`)
Current implementation uses raw SQL:
```javascript
// findUserByEmail
SELECT id FROM _user WHERE email = $1

// createUser
INSERT INTO _user (name, email, password_hash, role, mfa_enabled) 
VALUES ($1,$2,$3,$4,$5) 
RETURNING id, name, email, role, created_at

// getUserByEmail
SELECT id, name, email, role, created_at, password_hash 
FROM _user WHERE email = $1
```

### Controller Pattern
- Controllers call model functions
- Models return plain JavaScript objects
- Controllers don't need to know about database implementation

**This pattern is perfect for Sequelize migration** - we only need to change the model layer!

---

## Sequelize Setup

### 1. Install Dependencies

```bash
cd backend
npm install sequelize sequelize-cli pg pg-hstore
```

### 2. Project Structure (Updated)

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── db.js                    # DEPRECATED (keep temporarily)
│   ├── database/
│   │   ├── index.js             # Sequelize instance & model loader
│   │   ├── models/              # Sequelize models
│   │   │   ├── index.js         # Auto-loads all models
│   │   │   ├── User.js          # User model (Sequelize)
│   │   │   ├── Organization.js  # Future model
│   │   │   └── Project.js       # Future model
│   │   └── migrations/          # Database migrations
│   │       └── 20250118-create-user.js
│   ├── models/                  # Data access layer (adapters)
│   │   └── authModel.js         # Updated to use Sequelize models
│   ├── controllers/
│   │   └── authController.js    # NO CHANGES NEEDED
│   └── routes/
│       └── authRoutes.js        # NO CHANGES NEEDED
├── .sequelizerc                 # Sequelize CLI config
└── package.json
```

---

## Model Migration Strategy

### Strategy: **Adapter Pattern**

Keep the existing `models/authModel.js` interface intact but replace the implementation to use Sequelize models internally. This ensures:
- ✅ **Zero changes** to controllers
- ✅ **Zero changes** to routes
- ✅ Same function signatures and return values
- ✅ Gradual migration path

### Before (Raw SQL):
```javascript
// models/authModel.js
const db = require("../db");

const findUserByEmail = async (email) => {  
    const exists = await db.query("SELECT id FROM _user WHERE email = $1", [email]);
    if(exists.rows.length) return true;
    return false;
}
```

### After (Sequelize):
```javascript
// models/authModel.js
const { User } = require("../database/models");

const findUserByEmail = async (email) => {  
    const exists = await User.findOne({ where: { email } });
    return !!exists;
}
```

**Controllers see NO difference!** ✨

---

## Step-by-Step Implementation

### Step 1: Configure Sequelize

#### Create `.sequelizerc` (root of backend/)
```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'database.js'),
  'models-path': path.resolve('src', 'database', 'models'),
  'seeders-path': path.resolve('src', 'database', 'seeders'),
  'migrations-path': path.resolve('src', 'database', 'migrations')
};
```

#### Create `src/config/database.js`
```javascript
require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
```

---

### Step 2: Create Sequelize Instance

#### Create `src/database/index.js`
```javascript
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions
});

// Test connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

testConnection();

module.exports = sequelize;
```

---

### Step 3: Create User Model

#### Create `src/database/models/User.js`
```javascript
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../index');

class User extends Model {
  // Instance methods
  toSafeObject() {
    const { password_hash, ...safeUser } = this.toJSON();
    return safeUser;
  }

  // Class methods can go here
  static async findByEmail(email) {
    return await this.findOne({ where: { email } });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      },
      set(value) {
        // Auto-normalize email
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('researcher', 'nonprofit', 'admin'),
      allowNull: false,
      defaultValue: 'researcher'
    },
    mfa_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: '_user',  // Match existing table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  }
);

module.exports = User;
```

---

### Step 4: Create Model Index (Auto-loader)

#### Create `src/database/models/index.js`
```javascript
const User = require('./User');
// Future models
// const Organization = require('./Organization');
// const Project = require('./Project');
// const Application = require('./Application');

// Define associations here when you have multiple models
// User.hasMany(Application, { foreignKey: 'user_id' });
// Application.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  // Organization,
  // Project,
  // Application
};
```

---

### Step 5: Create Migration for User Table

```bash
npx sequelize-cli migration:generate --name create-user-table
```

#### Edit `src/database/migrations/XXXXXX-create-user-table.js`
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('researcher', 'nonprofit', 'admin'),
        allowNull: false,
        defaultValue: 'researcher'
      },
      mfa_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on email for faster lookups
    await queryInterface.addIndex('_user', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_user');
  }
};
```

---

### Step 6: Update Auth Model (Adapter Layer)

#### Update `src/models/authModel.js`
```javascript
const { User } = require("../database/models");

// REGISTER ROUTE
const findUserByEmail = async (email) => {  
    const exists = await User.findOne({ 
      where: { email },
      attributes: ['id']
    });
    return !!exists;
}

const createUser = async (name, email, password_hash, role, mfa_enabled) => {
    const user = await User.create({
      name,
      email,
      password_hash,
      role: role || 'researcher',
      mfa_enabled: !!mfa_enabled
    });

    // Return plain object matching old format
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
}

// LOGIN ROUTE
const getUserByEmail = async (email) => {
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'role', 'created_at', 'password_hash']
    });
    
    if (!user) return null;
    
    // Return plain object matching old format
    return user.toJSON();
}

module.exports = {
    findUserByEmail,
    createUser,
    getUserByEmail
}
```

**Key Points:**
- ✅ Same function names
- ✅ Same parameters
- ✅ Same return format (plain objects)
- ✅ **Controllers don't need any changes!**

---

### Step 7: Update Entry Point

#### Update `src/index.js`
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./database'); // Import Sequelize instance

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
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
```

---

### Step 8: Add Migration Scripts

#### Update `backend/package.json`
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "db:migrate": "sequelize-cli db:migrate",
    "db:migrate:undo": "sequelize-cli db:migrate:undo",
    "db:migrate:undo:all": "sequelize-cli db:migrate:undo:all",
    "db:seed": "sequelize-cli db:seed:all",
    "db:reset": "sequelize-cli db:migrate:undo:all && sequelize-cli db:migrate && sequelize-cli db:seed:all"
  }
}
```

---

## Best Practices

### 1. **Never Use `sync()` in Production**
```javascript
// ❌ DON'T DO THIS IN PRODUCTION
await sequelize.sync({ force: true }); // Drops all tables!

// ✅ Use migrations instead
npm run db:migrate
```

### 2. **Use Transactions for Critical Operations**
```javascript
const { sequelize } = require('../database');

const createUserWithProfile = async (userData, profileData) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user = await User.create(userData, { transaction });
    const profile = await Profile.create(
      { ...profileData, user_id: user.id }, 
      { transaction }
    );
    
    await transaction.commit();
    return { user, profile };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

### 3. **Leverage Model Validations**
```javascript
// In User model
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true,
    notEmpty: true,
    async isUnique(value) {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error('Email already in use');
      }
    }
  }
}
```

### 4. **Use Scopes for Common Queries**
```javascript
// In User model definition
User.init({...}, {
  sequelize,
  scopes: {
    active: {
      where: { status: 'active' }
    },
    withoutPassword: {
      attributes: { exclude: ['password_hash'] }
    },
    researcher: {
      where: { role: 'researcher' }
    }
  }
});

// Usage
const activeResearchers = await User.scope(['active', 'researcher']).findAll();
```

### 5. **Index Important Columns**
```javascript
// In migration
await queryInterface.addIndex('_user', ['email']);
await queryInterface.addIndex('projects', ['organization_id']);
await queryInterface.addIndex('applications', ['project_id', 'user_id']);
```

### 6. **Use Paranoid for Soft Deletes**
```javascript
User.init({...}, {
  sequelize,
  paranoid: true,  // Adds deletedAt column
  deletedAt: 'deleted_at'
});

// Now user.destroy() will soft delete
await user.destroy();  // Sets deleted_at timestamp

// Force delete
await user.destroy({ force: true });

// Include deleted records
await User.findAll({ paranoid: false });
```

---

## Future Models

### Organization Model Example
```javascript
// src/database/models/Organization.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../index');

class Organization extends Model {}

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    website: DataTypes.STRING(255),
    contact_email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true }
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Organization',
    tableName: 'organizations',
    timestamps: true,
    underscored: true
  }
);

module.exports = Organization;
```

### Define Associations
```javascript
// In src/database/models/index.js
const User = require('./User');
const Organization = require('./Organization');
const Project = require('./Project');
const Application = require('./Application');

// User <-> Organization
User.hasMany(Organization, { foreignKey: 'created_by', as: 'organizations' });
Organization.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Organization <-> Project
Organization.hasMany(Project, { foreignKey: 'organization_id', as: 'projects' });
Project.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });

// User <-> Application
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

// Project <-> Application
Project.hasMany(Application, { foreignKey: 'project_id', as: 'applications' });
Application.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

module.exports = {
  User,
  Organization,
  Project,
  Application
};
```

### Using Associations
```javascript
// Get user with all their organizations
const user = await User.findByPk(userId, {
  include: [{ model: Organization, as: 'organizations' }]
});

// Get project with organization and applications
const project = await Project.findByPk(projectId, {
  include: [
    { model: Organization, as: 'organization' },
    { 
      model: Application, 
      as: 'applications',
      include: [{ model: User, as: 'applicant' }]
    }
  ]
});
```

---

## Testing Strategy

### 1. Unit Tests for Models
```javascript
// tests/models/user.test.js
const { User } = require('../../src/database/models');

describe('User Model', () => {
  test('should create a user with valid data', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashed_password',
      role: 'researcher'
    });
    
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('researcher');
  });

  test('should fail with invalid email', async () => {
    await expect(
      User.create({
        name: 'Test User',
        email: 'invalid-email',
        password_hash: 'hashed_password'
      })
    ).rejects.toThrow();
  });
});
```

### 2. Integration Tests
```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/index');
const { User } = require('../../src/database/models');

beforeEach(async () => {
  await User.destroy({ where: {}, force: true });
});

describe('POST /auth/register', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('john@example.com');
    expect(response.body.token).toBeDefined();
  });
});
```

---

## Migration Checklist

- [ ] Install Sequelize dependencies
- [ ] Create `.sequelizerc` configuration
- [ ] Create `src/config/database.js`
- [ ] Create `src/database/index.js` (Sequelize instance)
- [ ] Create `src/database/models/User.js`
- [ ] Create `src/database/models/index.js` (model loader)
- [ ] Create migration for User table
- [ ] Run migration: `npm run db:migrate`
- [ ] Update `src/models/authModel.js` to use Sequelize
- [ ] Update `src/index.js` to initialize Sequelize
- [ ] Test authentication endpoints
- [ ] Remove old `src/db.js` file (after testing)
- [ ] Update `package.json` with migration scripts
- [ ] Document environment variables
- [ ] Create additional models (Organization, Project, etc.)
- [ ] Define model associations
- [ ] Write unit tests for models
- [ ] Write integration tests for API endpoints

---

## Environment Variables

Update your `.env` file:
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trident_dev
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trident_test

# Node environment
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=4000
```

---

## Common Sequelize Queries

### Finding Records
```javascript
// Find by primary key
const user = await User.findByPk(1);

// Find one by criteria
const user = await User.findOne({ where: { email: 'test@example.com' } });

// Find all
const users = await User.findAll();

// Find with conditions
const researchers = await User.findAll({ 
  where: { role: 'researcher' },
  order: [['created_at', 'DESC']],
  limit: 10
});

// Count
const count = await User.count({ where: { role: 'researcher' } });

// Find or create
const [user, created] = await User.findOrCreate({
  where: { email: 'test@example.com' },
  defaults: { name: 'Test', password_hash: 'hash' }
});
```

### Creating Records
```javascript
// Create single
const user = await User.create({
  name: 'John',
  email: 'john@example.com',
  password_hash: 'hash'
});

// Bulk create
const users = await User.bulkCreate([
  { name: 'User 1', email: 'user1@example.com', password_hash: 'hash' },
  { name: 'User 2', email: 'user2@example.com', password_hash: 'hash' }
]);
```

### Updating Records
```javascript
// Update instance
user.name = 'New Name';
await user.save();

// Update with query
await User.update(
  { verified: true },
  { where: { email: 'test@example.com' } }
);
```

### Deleting Records
```javascript
// Delete instance
await user.destroy();

// Delete with query
await User.destroy({ where: { role: 'inactive' } });
```

---

## Troubleshooting

### Issue: "relation '_user' does not exist"
**Solution:** Run migrations
```bash
npm run db:migrate
```

### Issue: "Unable to connect to database"
**Solution:** Check DATABASE_URL and ensure PostgreSQL is running
```bash
docker compose up -d
```

### Issue: "Sequelize is not defined"
**Solution:** Ensure proper imports
```javascript
const { Sequelize, DataTypes } = require('sequelize');
```

### Issue: "Model not registered"
**Solution:** Make sure model is imported in `database/models/index.js`

---

## Conclusion

This migration strategy provides:
- ✅ **Minimal disruption** to existing code
- ✅ **Backward compatibility** through adapter pattern
- ✅ **Gradual migration** path
- ✅ **Future-proof** architecture
- ✅ **Easy to test** and validate

By following this guide, you can migrate to Sequelize incrementally while maintaining a working application at every step. Controllers and routes remain unchanged, making this a low-risk, high-reward migration.

---

## Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize CLI](https://github.com/sequelize/cli)
- [Sequelize Migrations](https://sequelize.org/docs/v6/other-topics/migrations/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

---

**Last Updated:** November 18, 2025  
**Project:** TRIDENT-Match-Portal  
**Author:** Development Team
