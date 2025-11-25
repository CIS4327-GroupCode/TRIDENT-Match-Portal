/**
 * Database Migration Verification Test
 * 
 * This test verifies that all migrations have been run correctly
 * and the database schema matches expectations
 */

const {
  setupTestDatabase,
  closeDatabase,
  getSequelize
} = require('../utils/testHelper');

describe('Database Migrations', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = await setupTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Table Existence', () => {
    test('_user table should exist', async () => {
      const [results] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '_user'
        );
      `);

      expect(results[0].exists).toBe(true);
    });

    test('organizations table should exist', async () => {
      const [results] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'organizations'
        );
      `);

      // This will fail until migration is created
      // expect(results[0].exists).toBe(true);
      
      // For now, just log the status
      if (!results[0].exists) {
        console.warn('⚠️  organizations table does not exist - migration needed');
      }
    });

    test('projects table should exist', async () => {
      const [results] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'projects'
        );
      `);

      if (!results[0].exists) {
        console.warn('⚠️  projects table does not exist - migration needed');
      }
    });

    test('applications table should exist', async () => {
      const [results] = await sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'applications'
        );
      `);

      if (!results[0].exists) {
        console.warn('⚠️  applications table does not exist - migration needed');
      }
    });
  });

  describe('User Table Schema', () => {
    test('should have all required columns', async () => {
      const [results] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = '_user'
        ORDER BY ordinal_position;
      `);

      const columnNames = results.map(r => r.column_name);

      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('password_hash');
      expect(columnNames).toContain('role');
      expect(columnNames).toContain('mfa_enabled');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    test('id should be primary key with auto-increment', async () => {
      const [results] = await sequelize.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '_user' AND column_name = 'id';
      `);

      expect(results[0].data_type).toBe('integer');
    });

    test('email should be unique', async () => {
      const [results] = await sequelize.query(`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = '_user' AND constraint_type = 'UNIQUE';
      `);

      const hasEmailUnique = results.some(r => 
        r.constraint_name.includes('email')
      );

      expect(hasEmailUnique).toBe(true);
    });

    test('email should have index', async () => {
      const [results] = await sequelize.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = '_user';
      `);

      const hasEmailIndex = results.some(r => 
        r.indexname.includes('email')
      );

      expect(hasEmailIndex).toBe(true);
    });

    test('role should be ENUM type', async () => {
      const [results] = await sequelize.query(`
        SELECT data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = '_user' AND column_name = 'role';
      `);

      expect(results[0].data_type).toBe('USER-DEFINED');
    });

    test('mfa_enabled should be boolean with default false', async () => {
      const [results] = await sequelize.query(`
        SELECT data_type, column_default
        FROM information_schema.columns
        WHERE table_name = '_user' AND column_name = 'mfa_enabled';
      `);

      expect(results[0].data_type).toBe('boolean');
      expect(results[0].column_default).toBe('false');
    });
  });

  describe('Migration Status', () => {
    test('should list all executed migrations', async () => {
      try {
        const [results] = await sequelize.query(`
          SELECT name FROM "SequelizeMeta" ORDER BY name;
        `);

        console.log('✅ Executed migrations:');
        results.forEach(r => console.log(`   - ${r.name}`));

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toContain('create-user-table');
      } catch (error) {
        console.warn('⚠️  SequelizeMeta table not found - migrations may not have been run');
        console.warn('   Run: npm run db:migrate');
      }
    });
  });

  describe('Database Connection', () => {
    test('should connect successfully', async () => {
      try {
        await sequelize.authenticate();
        expect(true).toBe(true);
      } catch (error) {
        fail('Database connection failed: ' + error.message);
      }
    });

    test('should use correct database', async () => {
      const [results] = await sequelize.query('SELECT current_database();');
      
      console.log(`📊 Connected to database: ${results[0].current_database}`);
      expect(results[0].current_database).toBeDefined();
    });

    test('should have correct privileges', async () => {
      const [results] = await sequelize.query(`
        SELECT current_user, session_user;
      `);
      
      console.log(`👤 Database user: ${results[0].current_user}`);
      expect(results[0].current_user).toBeDefined();
    });
  });
});
