
const Database = require("../src/database");
const assert = require("assert");

module.exports = function() {

  /**
   * NOTE: All tests assume valid environment variables are set and db exists
   */

  describe('Database', () => {

    describe('#init', () => {
      it('should set the database configuration', () => {
        // Initialize Database connection
        const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
        Database.init(config);
        assert.equal(Database.config, config);
      });
      it('should set the database configuration and automatically create a new connection pool', () => {
        const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
        Database.init(config);
        assert.equal(Database.config, config);
        assert(Database.pool);
        assert.equal(Database.pool.config.connectionConfig.database, config.database);
      });
      it('should set the databse configuration and enable debugging mode', () => {
        const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
        const debugMode = true;
        Database.init(config, debugMode);
        assert(Database.debug);
      });
    });

    describe('#createConnection', () => {
      it('should create a new mysql connection', () => {
        const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
        const debugMode = false;
        const createPool = false;
        Database.init(config, debugMode, createPool);
        const connection = Database.createConnection();
        assert(connection);
      });
    });

    describe('#createPool', () => {
      it('should create a new mysql connection pool', () => {
        const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
        const debugMode = false;
        const createPool = false;
        Database.init(config, debugMode, createPool);
        const pool = Database.createPool();
        assert(pool);
      });
    });

  });

}
