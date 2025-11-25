# Test Suite Documentation

## Overview

This directory contains the automated test suite for the TRIDENT Match Portal backend, specifically designed to verify the Sequelize ORM migration progress.

## Structure

```
tests/
├── setup.js                    # Global Jest setup
├── utils/
│   └── testHelper.js          # Test utilities and database helpers
├── models/
│   └── user.test.js           # User model unit tests (30+ tests)
└── integration/
    ├── auth.test.js           # Auth endpoint tests (25+ tests)
    └── database.test.js       # Migration verification (15+ tests)
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# Model tests only
npm run test:models

# Integration tests only
npm run test:integration

# Migration verification only
npm run test:migrations

# With coverage report
npm run test:coverage

# Watch mode (auto-rerun on changes)
npm run test:watch
```

## Test Categories

### 1. Model Tests (`tests/models/`)

**Purpose:** Verify Sequelize model definitions, validations, and methods

**User Model Tests:**
- Model definition and structure
- Field validations (name, email, password, role)
- Email normalization and uniqueness
- Timestamp functionality
- Instance methods (toSafeObject)
- Class methods (findByEmail)
- CRUD operations

**Example:**
```bash
npm test -- tests/models/user.test.js
```

### 2. Integration Tests (`tests/integration/`)

**Purpose:** Test API endpoints and database interactions

**Auth Tests:**
- POST /auth/register endpoint
- POST /auth/login endpoint
- Password hashing security
- JWT token generation
- Input validation
- Error handling

**Database Tests:**
- Table existence verification
- Schema validation
- Migration tracking
- Database connection

**Example:**
```bash
npm test -- tests/integration/auth.test.js
```

## Test Helpers

### Database Setup/Teardown

```javascript
const {
  setupTestDatabase,
  syncDatabase,
  clearDatabase,
  closeDatabase
} = require('../utils/testHelper');

describe('My Test Suite', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    await syncDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  // Your tests here
});
```

### Creating Test Data

```javascript
const { createTestUser, generateEmail } = require('../utils/testHelper');

test('should do something', async () => {
  const user = await createTestUser({
    name: 'Custom Name',
    email: generateEmail('custom'),
    role: 'admin'
  });
  
  // Test with user...
});
```

### Expecting Errors

```javascript
const { expectToReject } = require('../utils/testHelper');

test('should fail validation', async () => {
  const error = await expectToReject(
    User.create({ email: 'invalid' })
  );
  
  expect(error.name).toBe('SequelizeValidationError');
});
```

## Writing New Tests

### 1. Create Test File

```javascript
// tests/models/organization.test.js
const { Organization } = require('../../src/database/models');
const {
  setupTestDatabase,
  syncDatabase,
  clearDatabase,
  closeDatabase
} = require('../utils/testHelper');

describe('Organization Model', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    await syncDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  test('should create an organization', async () => {
    const org = await Organization.create({
      name: 'Test Org',
      description: 'A test organization'
    });
    
    expect(org.id).toBeDefined();
    expect(org.name).toBe('Test Org');
  });
});
```

### 2. Run Your Test

```bash
npm test -- tests/models/organization.test.js
```

## Configuration

### Jest Config (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};
```

### Environment Variables

Tests use the `test` environment from `config/database.js`:

```javascript
test: {
  url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  dialect: 'postgres',
  logging: false
}
```

## Test Data Management

### Clean Database Between Tests

```javascript
beforeEach(async () => {
  await clearDatabase(); // Truncates all tables
});
```

### Use Transactions (Advanced)

```javascript
const { sequelize } = require('../utils/testHelper');

let transaction;

beforeEach(async () => {
  transaction = await sequelize.transaction();
});

afterEach(async () => {
  await transaction.rollback();
});

test('test with transaction', async () => {
  const user = await User.create({...}, { transaction });
  // Test...
});
```

## Coverage Reports

### Generate Coverage

```bash
npm run test:coverage
```

### View HTML Report

```bash
# After running coverage
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

## Continuous Integration

Tests are designed to run in CI environments:

```yaml
# .github/workflows/test.yml
- name: Run tests
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    NODE_ENV: test
  run: |
    cd backend
    npm test
```

## Troubleshooting

### "Cannot connect to database"

**Solution:** Check DATABASE_URL in .env
```bash
cat .env | grep DATABASE_URL
```

### "Table does not exist"

**Solution:** Run migrations
```bash
npm run db:migrate
```

### Tests hang

**Solution:** Add forceExit flag
```bash
npm test -- --forceExit
```

### "Too many connections"

**Solution:** Tests use `--runInBand` to run serially (already configured)

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Clean up** - Always clear database between tests
3. **Use factories** - Create test data with helper functions
4. **Test edge cases** - Not just happy path
5. **Mock external APIs** - Don't hit real services in tests
6. **Keep tests fast** - Use transactions where possible
7. **Descriptive names** - Test names should explain what they verify

## Adding More Tests

### For New Models

1. Copy `tests/models/user.test.js`
2. Replace `User` with your model
3. Adjust test cases for your schema
4. Run `npm test`

### For New Endpoints

1. Copy `tests/integration/auth.test.js`
2. Update routes and expected responses
3. Add specific test cases
4. Run `npm run test:integration`

## Current Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| User Model | 30+ | ~95% |
| Auth Endpoints | 25+ | ~90% |
| Database Schema | 15+ | 100% |
| **Total** | **70+** | **~85%** |

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Sequelize Testing](https://sequelize.org/docs/v6/other-topics/testing/)
- [Supertest Guide](https://github.com/ladjs/supertest)
- Project Guide: `../TESTING_GUIDE.md`

---

**Last Updated:** November 25, 2025  
**Maintainers:** Danny Huasco - Development Team
