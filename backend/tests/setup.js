/**
 * Jest Setup File
 * 
 * Runs before each test file
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout for database operations
jest.setTimeout(30000);

// Suppress console.log in tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};
